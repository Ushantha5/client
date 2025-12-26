'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    X,
    Sparkles,
    Send,
    Bot,
    User,
    Image as ImageIcon,
    Heart,
    Volume2,
    VolumeX,
    Loader2,
    ArrowDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MoodDetector } from '@/components/classroom/MoodDetector';
import Image from 'next/image';
import { toast } from 'sonner';
// import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'ai';
    content: string;
    type?: 'text' | 'image';
}

interface TeachingAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    voiceInteraction?: {
        transcript: string;
        listening: boolean;
        startListening: () => void;
        stopListening: () => void;
        response: string;
        isSpeaking: boolean;
        isProcessing: boolean;
        browserSupportsSpeechRecognition: boolean;
    };
}

export function TeachingAIModal({ isOpen, onClose, voiceInteraction }: TeachingAIModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [emotionalState, setEmotionalState] = useState({
        engagement: 'High',
        confidence: 'Medium',
        curiosity: 'Strong'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const isNearBottom = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [latency, setLatency] = useState(24);
    const sessionId = useRef(Math.random().toString(36).substr(2, 6).toUpperCase());

    // Simulate live latency updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (45 - 15) + 15));
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    const {
        transcript = '',
        listening = false,
        startListening = () => { },
        stopListening = () => { },
        response = '',
        isSpeaking = false,
        isProcessing = false,
        browserSupportsSpeechRecognition = false,
    } = voiceInteraction || {};

    // Auto-scroll to bottom
    // Scroll tracking
    const scrollToBottom = () => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const isBottom = distanceToBottom < 100;

        isNearBottom.current = isBottom;
        setShowScrollButton(!isBottom);
    };

    // Auto-scroll to bottom only if user was already near bottom
    useEffect(() => {
        if (isNearBottom.current) {
            scrollToBottom();
        }
    }, [messages, transcript, isProcessing]);

    // Update messages when AI responds
    useEffect(() => {
        if (response) {
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
        }
    }, [response]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Send message to Gemini API
    const sendToGeminiAPI = async (messageContent: string, imageData?: string) => {
        try {
            setIsSending(true);

            // Create abort controller for cancellation
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            // Prepare the message content
            let content: string | { text: string; images?: string[] } = messageContent;
            if (imageData) {
                content = {
                    text: messageContent,
                    images: [imageData]
                };
            }

            // Prepare messages array for the API
            const apiMessages = [
                {
                    role: "system",
                    content: "You are an expert AI tutor specializing in personalized education. Provide detailed, accurate, and engaging explanations tailored to the student's level. Adapt your teaching style based on emotional cues and learning progress. Always be encouraging and supportive."
                },
                ...messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                {
                    role: "user",
                    content
                }
            ];

            // Call Gemini API through backend
            const response = await fetch("/api/ai/gemini", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    multimodal: !!imageData,
                    options: {
                        temperature: 0.7,
                        max_tokens: 1000
                    }
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();

            // Add AI response to messages
            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);

            // Simulate emotional analysis (in a real implementation, this would call the analyzeEmotions API)
            const emotions = ['High', 'Medium', 'Strong'];
            setEmotionalState({
                engagement: emotions[Math.floor(Math.random() * emotions.length)],
                confidence: emotions[Math.floor(Math.random() * emotions.length)],
                curiosity: emotions[Math.floor(Math.random() * emotions.length)]
            });

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }

            console.error("Gemini API Error:", error);
            toast.error("AI Tutor Error", {
                description: error.message || "Failed to get response from AI tutor. Please try again."
            });

            // Add error message to chat
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sorry, I encountered an error processing your request. Please try again."
            }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendMessage = async (text?: string) => {
        const messageToSend = text || inputMessage;
        if (!messageToSend.trim() && !imagePreview) return;

        // Add user message to chat
        const newUserMessage: Message = {
            role: 'user',
            content: messageToSend,
            type: imagePreview ? 'image' : 'text'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');

        // Send to Gemini API
        await sendToGeminiAPI(messageToSend, imagePreview || undefined);
        setImagePreview(null);
    };

    // Handle image upload
    const handleImageUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Invalid file type", {
                description: "Please upload an image file (JPEG, PNG, etc.)"
            });
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large", {
                description: "Please upload an image smaller than 5MB"
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle drag and drop events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
        // In a real implementation, this would integrate with the TTS service
    };

    // Cancel current request
    const cancelRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsSending(false);
            toast.info("Request cancelled");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="sm:max-w-[1200px] p-0 border-0 bg-transparent shadow-none overflow-hidden h-[85vh] max-h-[900px]">
                        <DialogDescription className="sr-only">
                            Interactive AI Tutor session where you can ask questions and get real-time feedback.
                        </DialogDescription>

                        {/* Background Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-cyan-500/5 to-transparent pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-[#030712]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex h-full relative z-10"
                        >
                            {/* Sidebar - Student View & HUD */}
                            <div className="w-80 border-r border-white/5 bg-black/40 p-6 flex flex-col gap-6 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <h3 className="text-sm font-semibold text-white tracking-widest uppercase opacity-80">Live Session</h3>
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono">ID: {sessionId.current}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-1 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 shadow-inner">
                                        <MoodDetector />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">Neurometric Analysis</h4>

                                        {/* Radial Stats HUD */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Engagement */}
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                                                <Heart className="w-4 h-4 text-red-400 mb-2" />
                                                <div className="text-xl font-bold text-white mb-1">{emotionalState.engagement}</div>
                                                <div className="text-[10px] text-gray-400 uppercase">Engagement</div>
                                            </div>

                                            {/* Confidence */}
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                                                <Sparkles className="w-4 h-4 text-amber-400 mb-2" />
                                                <div className="text-xl font-bold text-white mb-1">{emotionalState.confidence}</div>
                                                <div className="text-[10px] text-gray-400 uppercase">Confidence</div>
                                            </div>

                                            {/* Curiosity */}
                                            <div className="col-span-2 bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Bot className="w-4 h-4 text-cyan-400 mb-2" />
                                                        <div className="text-[10px] text-gray-400 uppercase">Curiosity Level</div>
                                                    </div>
                                                    <div className="text-xl font-bold text-white">{emotionalState.curiosity}</div>
                                                </div>
                                                <div className="w-full bg-black/50 h-1 mt-2 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 w-[75%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="text-[10px] font-mono text-center space-y-1 bg-black/20 py-2 rounded-lg border border-white/5 mx-2">
                                        <div className="flex items-center justify-center gap-2 text-green-400">
                                            <div className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </div>
                                            <span className="tracking-widest opacity-90">SYSTEM ONLINE</span>
                                        </div>
                                        <div className="text-gray-500 flex justify-center gap-3">
                                            <span>LATENCY: <span className={latency < 30 ? "text-green-400/80" : "text-yellow-400/80"}>{latency}ms</span></span>
                                            <span className="text-white/20">|</span>
                                            <span className="text-cyan-400/80">LIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content - AI Chat */}
                            <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-transparent to-black/20">
                                {/* Header */}
                                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm sticky top-0 z-20">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 p-[2px] overflow-hidden">
                                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative">
                                                    <Image
                                                        src="/assets/mr5-logo-neon.png"
                                                        alt="MR5 AI"
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-black p-1 rounded-full">
                                                <span className="block w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            </div>
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                                AI Tutor
                                            </DialogTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-cyan-300 uppercase tracking-widest">
                                                    Interactive
                                                </span>
                                                {listening && (
                                                    <span className="text-xs text-red-400 font-medium animate-pulse flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                        LIVE INPUT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleMute}
                                            className="w-10 h-10 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                                        >
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onClose}
                                            className="w-10 h-10 rounded-full border border-white/5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all hover:scale-105 hover:rotate-90"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 overflow-hidden relative flex flex-col">
                                    <ScrollArea
                                        className="flex-1 px-8 py-6"
                                        viewportRef={viewportRef as React.RefObject<HTMLDivElement>}
                                        onScroll={handleScroll}
                                    >
                                        <div className="space-y-8 pb-4">
                                            {messages.length === 0 && (
                                                <div className="h-full flex flex-col items-center justify-center py-20 opacity-0 animate-in fade-in zoom-in duration-700">
                                                    <div className="relative mb-8">
                                                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                                                        <div className="relative w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                                                            <Sparkles className="w-12 h-12 text-white" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-white mb-3 text-center">
                                                        Ready when you are
                                                    </h3>
                                                    <p className="text-gray-400 text-center max-w-sm leading-relaxed">
                                                        I&apos;m analyzing your learning patterns. Ask me anything about your coursework or upload an image to get started.
                                                    </p>
                                                </div>
                                            )}

                                            {messages.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden relative ${msg.role === 'user'
                                                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
                                                        : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                                        }`}>
                                                        {msg.role === 'user' ? (
                                                            <User className="w-5 h-5 text-white" />
                                                        ) : (
                                                            <Image
                                                                src="/assets/mr5-logo-neon.png"
                                                                alt="AI"
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className={`group relative max-w-[75%] space-y-2`}>
                                                        <div className={`rounded-3xl px-6 py-4 shadow-xl backdrop-blur-md ${msg.role === 'user'
                                                            ? 'bg-violet-600/10 border border-violet-500/20 text-white rounded-tr-sm'
                                                            : 'bg-white/5 border border-white/5 text-gray-100 rounded-tl-sm'
                                                            }`}>
                                                            {msg.type === 'image' && msg.content ? (
                                                                <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={msg.content}
                                                                        alt="Uploaded content"
                                                                        className="max-w-xs max-h-60 object-contain bg-black/20"
                                                                    />
                                                                </div>
                                                            ) : null}
                                                            <div className="prose prose-invert prose-sm leading-relaxed max-w-none">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {msg.content}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                        <div className={`text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'text-right pr-2' : 'pl-2'}`}>
                                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Real-time Transcript (User Speaking) */}
                                            {listening && transcript && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex gap-5 flex-row-reverse items-end"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                                                        <Mic className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <div className="rounded-3xl rounded-tr-sm px-6 py-4 max-w-[75%] bg-red-500/5 border border-red-500/10 text-gray-300">
                                                        <div className="flex space-x-1 items-center mb-1">
                                                            <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                            <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                                            <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                                        </div>
                                                        <p className="italic">{transcript}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* AI Processing/Speaking Indicator */}
                                            {(isProcessing || isSpeaking || isSending) && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex gap-5"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 overflow-hidden relative">
                                                        <Image
                                                            src="/assets/mr5-logo-neon.png"
                                                            alt="AI Processing"
                                                            fill
                                                            sizes="40px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 h-10 px-4 rounded-full bg-white/5 border border-white/5">
                                                        <span className="text-xs text-cyan-300 font-medium tracking-wide">AI IS THINKING</span>
                                                        <div className="flex gap-1">
                                                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms]" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>

                                    {/* Scroll to Bottom Button */}
                                    <AnimatePresence>
                                        {showScrollButton && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                onClick={scrollToBottom}
                                                className="absolute bottom-4 right-8 z-30 p-2 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 transition-colors"
                                            >
                                                <ArrowDown className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>

                                    {/* Image Preview Area */}
                                    <AnimatePresence>
                                        {imagePreview && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="px-8 pb-2"
                                            >
                                                <div className="relative inline-block group">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-md rounded-xl" />
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={imagePreview}
                                                        alt="User uploaded preview"
                                                        className="relative rounded-xl max-h-40 object-contain border border-white/20 shadow-xl"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setImagePreview(null)}
                                                        className="absolute -top-3 -right-3 h-8 w-8 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Input Area */}
                                    <div
                                        className="p-6 bg-gradient-to-t from-[#030712] to-transparent"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {/* Drag and drop overlay */}
                                        <AnimatePresence>
                                            {isDragging && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-6 bg-cyan-500/10 border-2 border-dashed border-cyan-500 rounded-2xl flex items-center justify-center z-20 backdrop-blur-sm"
                                                >
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                                                            <ImageIcon className="w-8 h-8 text-cyan-400" />
                                                        </div>
                                                        <p className="text-cyan-400 font-bold text-lg">Drop image to upload</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="relative max-w-4xl mx-auto flex items-end gap-2 p-1.5 rounded-[24px] bg-white/5 border border-white/10 shadow-2xl focus-within:border-cyan-500/50 focus-within:bg-white/[0.07] transition-all duration-300">

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={triggerFileInput}
                                                className="h-12 w-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10 flex-shrink-0"
                                                disabled={isSending}
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                            </Button>

                                            <div className="flex-1 py-1">
                                                <input
                                                    type="text"
                                                    value={inputMessage}
                                                    onChange={(e) => setInputMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                    placeholder={listening ? "Listening..." : "Ask me anything about your studies..."}
                                                    className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-base py-2.5 px-2"
                                                    disabled={isSending}
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Hidden file input */}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileInputChange}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <div className="flex items-center gap-1 pr-1 pb-1">
                                                {browserSupportsSpeechRecognition ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={listening ? stopListening : startListening}
                                                        className={`h-11 w-11 rounded-full transition-all duration-300 ${listening
                                                            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                                            }`}
                                                        disabled={isSending}
                                                    >
                                                        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                                    </Button>
                                                ) : null}

                                                <Button
                                                    size="icon"
                                                    onClick={isSending ? cancelRequest : () => handleSendMessage()}
                                                    className={`h-11 w-11 rounded-full transition-all duration-300 shadow-lg ${isSending
                                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                                        : inputMessage.trim() || imagePreview
                                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/25'
                                                            : 'bg-white/10 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    disabled={(!inputMessage.trim() && !imagePreview) && !isSending}
                                                >
                                                    {isSending ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Send className="w-5 h-5 ml-0.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-center text-[10px] text-gray-600 mt-4 tracking-wide uppercase">
                                            AI-Powered Study Assistant • Mr5 School
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

export default TeachingAIModal;