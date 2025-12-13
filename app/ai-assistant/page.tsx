'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Send,
    Settings,
    Users,
    MessageSquare,
    Maximize2,
    Minimize2,
    Volume2,
    VolumeX,
    Share2,
    MoreVertical,
    Loader2,
    History,
    Download
} from 'lucide-react';
import { aiAssistantService } from '@/services/aiAssistant.service';
import { AIInteraction } from '@/types/aiAssistant';
import { toast } from 'sonner';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    interactionId?: string;
}

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    isMuted: boolean;
    isVideoOn: boolean;
    isActive?: boolean;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: 'Hello! I\'m your AI Learning Assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeView, setActiveView] = useState<'presentation' | 'chat'>('presentation');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [interactionHistory, setInteractionHistory] = useState<AIInteraction[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock user ID - in production, get from auth context
    const currentUserId = '674f5e8a9b1234567890abcd';

    // Mock participants data
    const [participants] = useState<Participant[]>([
        { id: '1', name: 'MR.G', avatar: '', isMuted: false, isVideoOn: true },
        { id: '2', name: 'Rani', avatar: '', isMuted: true, isVideoOn: true },
        { id: '3', name: 'C', avatar: '', isMuted: false, isVideoOn: false, isActive: true },
        { id: '4', name: 'Jerom S', avatar: '', isMuted: true, isVideoOn: true },
        { id: '5', name: 'Maran', avatar: '', isMuted: true, isVideoOn: true },
        { id: '6', name: 'Gana', avatar: '', isMuted: true, isVideoOn: true },
        { id: '7', name: 'ramsan', avatar: '', isMuted: true, isVideoOn: true },
        { id: '8', name: 'Ann', avatar: '', isMuted: true, isVideoOn: true },
    ]);

    // Mock presentation slides
    const slides = [
        {
            title: 'Practical Recommendations',
            content: [
                'Start with data quality',
                'Define ownership clearly',
                'Invest in lineage and cataloging',
                'Automate checks',
                'Monitor models continuously',
                'Build governance gradually'
            ]
        },
        {
            title: 'AI Learning Objectives',
            content: [
                'Understand core AI concepts',
                'Apply machine learning techniques',
                'Develop ethical AI solutions',
                'Master data preprocessing',
                'Build and deploy models'
            ]
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load interaction history on mount
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await aiAssistantService.getUserHistory(currentUserId, 1, 10);
            if (response.success) {
                setInteractionHistory(response.data);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Create interaction in backend
            const interaction = await aiAssistantService.createInteraction({
                user: currentUserId,
                question: inputMessage,
                mode: isMicOn ? 'voice' : 'text'
            });

            // Get AI response from API
            try {
                let aiResponseText = '';
                
                // Try OpenAI first, fallback to Gemini
                try {
                    const openaiResponse = await fetch('/api/ai/openai', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: inputMessage }),
                    });
                    
                    if (openaiResponse.ok) {
                        const data = await openaiResponse.json();
                        aiResponseText = data.response || generateAIResponse(inputMessage);
                    } else {
                        throw new Error('OpenAI failed');
                    }
                } catch (openaiError) {
                    // Fallback to Gemini
                    try {
                        const geminiResponse = await fetch('/api/ai/gemini', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: inputMessage }),
                        });
                        
                        if (geminiResponse.ok) {
                            const data = await geminiResponse.json();
                            aiResponseText = data.response || generateAIResponse(inputMessage);
                        } else {
                            aiResponseText = generateAIResponse(inputMessage);
                        }
                    } catch (geminiError) {
                        aiResponseText = generateAIResponse(inputMessage);
                    }
                }

                // Update interaction with response
                if (interaction.data._id) {
                    await aiAssistantService.updateInteraction(interaction.data._id, {
                        response: aiResponseText
                    });
                }

                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: aiResponseText,
                    timestamp: new Date(),
                    interactionId: interaction.data._id
                };

                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);

                // Reload history
                loadHistory();

                toast.success('AI response generated');
            } catch (aiError) {
                console.error('AI response error:', aiError);
                const fallbackResponse = generateAIResponse(inputMessage);
                
                if (interaction.data._id) {
                    await aiAssistantService.updateInteraction(interaction.data._id, {
                        response: fallbackResponse
                    });
                }

                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: fallbackResponse,
                    timestamp: new Date(),
                    interactionId: interaction.data._id
                };

                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
                loadHistory();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
            setIsLoading(false);
        }
    };

    const generateAIResponse = (question: string): string => {
        // Simple mock AI responses - in production, integrate with actual AI service
        const responses: Record<string, string> = {
            'hello': 'Hello! How can I assist you with your learning today?',
            'help': 'I can help you with course content, answer questions, provide explanations, and guide you through learning materials.',
            'course': 'I can provide information about various courses including AI, Machine Learning, Data Science, and more.',
            'default': 'That\'s an interesting question! Let me help you understand this better. Based on your query, I recommend exploring our course materials and practical exercises.'
        };

        const lowerQuestion = question.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(key)) {
                return response;
            }
        }
        return responses.default;
    };

    const exportHistory = () => {
        const dataStr = JSON.stringify(interactionHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-interaction-history-${new Date().toISOString()}.json`;
        link.click();
        toast.success('History exported successfully');
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        AI Learning Assistant
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        Live Session
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
                    >
                        <History className="w-5 h-5" />
                        <span className="text-sm">History</span>
                    </button>
                    <button
                        onClick={exportHistory}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* History Sidebar */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className="w-80 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-4 border-b border-white/10">
                                <h3 className="font-semibold text-lg">Interaction History</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {interactionHistory.length} interactions
                                </p>
                            </div>
                            <div className="overflow-auto h-full p-4 space-y-3">
                                {interactionHistory.map((interaction) => (
                                    <motion.div
                                        key={interaction._id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-slate-800/50 rounded-lg p-3 border border-white/5 cursor-pointer hover:border-cyan-500/30 transition-all"
                                    >
                                        <p className="text-sm font-medium text-cyan-400 mb-1">
                                            {interaction.question.substring(0, 50)}...
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(interaction.timestamp || '').toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded ${interaction.mode === 'voice'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {interaction.mode}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Left Panel - Presentation/Content */}
                <motion.div
                    className="flex-1 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-full flex flex-col">
                        {/* View Toggle */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveView('presentation')}
                                    className={`px-4 py-2 rounded-lg transition-all ${activeView === 'presentation'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Presentation
                                </button>
                                <button
                                    onClick={() => setActiveView('chat')}
                                    className={`px-4 py-2 rounded-lg transition-all ${activeView === 'chat'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4 inline mr-2" />
                                    Chat
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>You are viewing <span className="text-cyan-400 font-medium">AI Assistant's</span> screen</span>
                                <button className="p-1 hover:bg-white/10 rounded">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-auto p-6">
                            <AnimatePresence mode="wait">
                                {activeView === 'presentation' ? (
                                    <motion.div
                                        key="presentation"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="h-full flex items-center justify-center"
                                    >
                                        <div className="w-full max-w-4xl bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border-2 border-emerald-500/30 p-12 shadow-2xl">
                                            <h2 className="text-4xl font-bold mb-8 text-white">
                                                {slides[currentSlide].title}
                                            </h2>

                                            <div className="flex gap-8">
                                                <div className="flex-1 space-y-4">
                                                    {slides[currentSlide].content.map((item, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex items-start gap-3 text-lg"
                                                        >
                                                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                                                            <span className="text-gray-200">{item}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <div className="w-64 bg-white/5 rounded-xl p-6 flex items-center justify-center">
                                                    <div className="text-center text-gray-400">
                                                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                                                            <MessageSquare className="w-16 h-16 text-cyan-400" />
                                                        </div>
                                                        <p className="text-sm">AI Assistant Illustration</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
                                                <div className="flex gap-2">
                                                    {slides.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentSlide(index)}
                                                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                                                ? 'bg-emerald-400 w-8'
                                                                : 'bg-white/30 hover:bg-white/50'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">
                                                    {currentSlide + 1} / {slides.length}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="chat"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="h-full flex flex-col"
                                    >
                                        {/* Messages */}
                                        <div className="flex-1 overflow-auto space-y-4 mb-4">
                                            {messages.map((message) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-6 py-4 ${message.type === 'user'
                                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                                            : 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-gray-100 border border-white/10'
                                                            }`}
                                                    >
                                                        <p className="text-sm mb-1 opacity-70">
                                                            {message.type === 'user' ? 'You' : 'AI Assistant'}
                                                        </p>
                                                        <p>{message.content}</p>
                                                        <p className="text-xs mt-2 opacity-60">
                                                            {message.timestamp.toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {isLoading && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex justify-center items-center"
                                                >
                                                    <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl px-12 py-8 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 backdrop-blur-xl">
                                                        <div className="flex flex-col items-center gap-6">
                                                            <div className="relative">
                                                                {/* Outer spinning ring */}
                                                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-400 animate-spin w-24 h-24"></div>
                                                                {/* Middle spinning ring */}
                                                                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 animate-spin w-20 h-20" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                                                                {/* Inner icon */}
                                                                <div className="w-24 h-24 flex items-center justify-center">
                                                                    <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                                                    AI is thinking...
                                                                </h3>
                                                                <p className="text-sm text-gray-400 animate-pulse">
                                                                    Processing your request
                                                                </p>
                                                            </div>
                                                            {/* Animated dots */}
                                                            <div className="flex gap-2">
                                                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Area */}
                                        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={inputMessage}
                                                    onChange={(e) => setInputMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                                    placeholder="Ask me anything..."
                                                    disabled={isLoading}
                                                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                                                />
                                                <button
                                                    onClick={handleSendMessage}
                                                    disabled={isLoading || !inputMessage.trim()}
                                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        <Send className="w-5 h-5" />
                                                    )}
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel - Video Feed */}
                <motion.div
                    className="w-[500px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="h-full flex flex-col">
                        {/* Video Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">AI Instructor</span>
                            </div>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Video Area */}
                        <div className="flex-1 relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 overflow-hidden">
                            {/* Starfield Background */}
                            <div className="absolute inset-0 opacity-30">
                                {[...Array(50)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                            animationDuration: `${2 + Math.random() * 3}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Earth-like planet */}
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"></div>

                            {/* Avatar Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                                        <span className="text-4xl font-bold">AI</span>
                                    </div>
                                    <p className="text-lg font-medium">AI Assistant</p>
                                    <p className="text-sm text-gray-400">Learning Instructor</p>
                                </div>
                            </div>

                            {/* Video Controls Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsMicOn(!isMicOn)}
                                        className={`p-3 rounded-lg transition-all ${isMicOn
                                            ? 'bg-white/20 hover:bg-white/30'
                                            : 'bg-red-500/80 hover:bg-red-600'
                                            }`}
                                    >
                                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setIsVideoOn(!isVideoOn)}
                                        className={`p-3 rounded-lg transition-all ${isVideoOn
                                            ? 'bg-white/20 hover:bg-white/30'
                                            : 'bg-red-500/80 hover:bg-red-600'
                                            }`}
                                    >
                                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsSoundOn(!isSoundOn)}
                                    className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                >
                                    {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Panel - Participants */}
            <motion.div
                className="bg-black/30 backdrop-blur-xl border-t border-white/10 px-6 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {participants.map((participant) => (
                        <motion.div
                            key={participant.id}
                            whileHover={{ scale: 1.05 }}
                            className={`flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden relative ${participant.isActive
                                ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50'
                                : 'ring-1 ring-white/20'
                                }`}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                {participant.isVideoOn ? (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                                        {participant.name.charAt(0)}
                                    </div>
                                ) : (
                                    <VideoOff className="w-6 h-6 text-gray-500" />
                                )}
                            </div>

                            {/* Participant Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium truncate">{participant.name}</span>
                                    {participant.isMuted && (
                                        <MicOff className="w-3 h-3 text-red-400" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
