'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { aiAssistantService } from '@/services/aiAssistant.service';
import { toast } from 'sonner';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface AIChatWidgetProps {
    userId: string;
    courseId?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    theme?: 'dark' | 'light';
}

export default function AIChatWidget({
    userId,
    courseId,
    position = 'bottom-right',
    theme = 'dark'
}: AIChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: 'Hi! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

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
            const interaction = await aiAssistantService.createInteraction({
                user: userId,
                course: courseId,
                question: inputMessage,
                mode: 'text'
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

                if (interaction.data._id) {
                    await aiAssistantService.updateInteraction(interaction.data._id, {
                        response: aiResponseText
                    });
                }

                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: aiResponseText,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
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
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
            setIsLoading(false);
        }
    };

    const generateAIResponse = (question: string): string => {
        const responses: Record<string, string> = {
            'hello': 'Hello! How can I assist you?',
            'help': 'I can help you with course content, answer questions, and guide you through learning materials.',
            'course': 'I can provide information about various courses. What would you like to know?',
            'default': 'That\'s an interesting question! Let me help you with that.'
        };

        const lowerQuestion = question.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(key)) {
                return response;
            }
        }
        return responses.default;
    };

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6'
    };

    const themeClasses = theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-white/10'
        : 'bg-white text-gray-900 border-gray-200';

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={`mb-4 w-96 rounded-2xl border shadow-2xl overflow-hidden ${themeClasses}`}
                        style={{ height: isMinimized ? '60px' : '500px' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">AI Assistant</h3>
                                    <p className="text-xs opacity-70">Always here to help</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="h-[360px] overflow-auto p-4 space-y-3">
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-xl px-4 py-2 ${message.type === 'user'
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                                    : theme === 'dark'
                                                        ? 'bg-slate-700/50 text-gray-100'
                                                        : 'bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className="text-xs mt-1 opacity-60">
                                                    {message.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className={`rounded-xl px-4 py-2 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'
                                                }`}>
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm">Thinking...</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your message..."
                                            disabled={isLoading}
                                            className={`flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${theme === 'dark'
                                                ? 'bg-slate-800 border border-white/10 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                                                } disabled:opacity-50`}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isLoading || !inputMessage.trim()}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                                            ) : (
                                                <Send className="w-5 h-5 text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shadow-2xl flex items-center justify-center hover:shadow-cyan-500/50 transition-all"
                >
                    <MessageSquare className="w-7 h-7 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </motion.button>
            )}
        </div>
    );
}
