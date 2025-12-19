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
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MoodDetector } from '@/components/classroom/MoodDetector';
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
    const abortControllerRef = useRef<AbortController | null>(null);

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
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/gemini`, {
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
                    <DialogContent className="sm:max-w-[1100px] p-0 border-0 bg-transparent shadow-none overflow-hidden">
                        <DialogDescription className="sr-only">
                            Interactive AI Tutor session where you can ask questions and get real-time feedback.
                        </DialogDescription>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex h-[700px]"
                        >
                            {/* Sidebar - Student View */}
                            <div className="w-80 border-r border-white/10 bg-black/20 p-6 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Student View</h3>
                                    <p className="text-xs text-gray-400">Real-time engagement analysis</p>
                                </div>

                                {/* 
                                    TODO: Switch between MoodDetector (Local Prototype) and ClassroomRoom (LiveKit Production)
                                    For now, we keep MoodDetector as the default for the prototype demo.
                                    Uncomment the below line to enable LiveKit when keys are configured.
                                */}
                                <MoodDetector />
                                {/* <ClassroomRoom roomName="math-101" participantName="Student" /> */}

                                <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h4 className="text-sm font-medium text-white mb-2">Emotional Insights</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-red-400" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-300">Engagement</span>
                                                    <span className="text-white font-medium">{emotionalState.engagement}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className="bg-red-500 h-1.5 rounded-full"
                                                        style={{
                                                            width: emotionalState.engagement === 'High' ? '90%' :
                                                                emotionalState.engagement === 'Medium' ? '60%' : '30%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-yellow-400" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-300">Confidence</span>
                                                    <span className="text-white font-medium">{emotionalState.confidence}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className="bg-yellow-500 h-1.5 rounded-full"
                                                        style={{
                                                            width: emotionalState.confidence === 'High' ? '90%' :
                                                                emotionalState.confidence === 'Medium' ? '60%' : '30%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-cyan-400" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-300">Curiosity</span>
                                                    <span className="text-white font-medium">{emotionalState.curiosity}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className="bg-cyan-500 h-1.5 rounded-full"
                                                        style={{
                                                            width: emotionalState.curiosity === 'High' ? '90%' :
                                                                emotionalState.curiosity === 'Medium' ? '60%' : '30%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content - AI Chat */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                            <Bot className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-lg font-bold text-white">AI Tutor</DialogTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-xs text-cyan-400">Online & Listening</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleMute}
                                            className="text-gray-400 hover:text-white hover:bg-white/10"
                                        >
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10">
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 overflow-hidden relative flex flex-col">
                                    <ScrollArea className="flex-1 px-6 py-6">
                                        <div className="space-y-6">
                                            {messages.length === 0 && (
                                                <div className="text-center py-12">
                                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                        <Sparkles className="w-10 h-10 text-cyan-400" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-white mb-2">How can I help you today?</h3>
                                                    <p className="text-gray-400 max-w-md mx-auto">
                                                        Ask me anything about your studies. I can help with math, science, history, and more.
                                                    </p>
                                                </div>
                                            )}

                                            {messages.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                                        ? 'bg-purple-600'
                                                        : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                                        }`}>
                                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className={`rounded-2xl px-5 py-3 max-w-[80%] ${msg.role === 'user'
                                                        ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                                                        : 'bg-white/10 border border-white/10 text-gray-100'
                                                        }`}>
                                                        {msg.type === 'image' && msg.content ? (
                                                            <div className="mb-2">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={msg.content}
                                                                    alt="Uploaded content"
                                                                    className="rounded-lg max-w-xs max-h-40 object-contain"
                                                                />
                                                            </div>
                                                        ) : null}
                                                        <p className="leading-relaxed">{msg.content}</p>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Real-time Transcript (User Speaking) */}
                                            {listening && transcript && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex gap-4 flex-row-reverse"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-purple-600/50 flex items-center justify-center flex-shrink-0 animate-pulse">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="rounded-2xl px-5 py-3 max-w-[80%] bg-purple-600/10 border border-purple-500/20 text-gray-300 italic">
                                                        <p>{transcript}...</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* AI Processing/Speaking Indicator */}
                                            {(isProcessing || isSpeaking || isSending) && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex gap-4"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="flex items-center gap-2 h-10">
                                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="px-6 pb-4">
                                            <div className="relative inline-block">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imagePreview}
                                                    alt="User uploaded preview"
                                                    className="rounded-lg max-h-32 object-contain border border-white/20"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setImagePreview(null)}
                                                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Input Area */}
                                    <div
                                        className="p-6 bg-black/20 border-t border-white/10"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {/* Drag and drop indicator */}
                                        {isDragging && (
                                            <div className="absolute inset-0 bg-cyan-500/10 border-2 border-dashed border-cyan-500 rounded-lg flex items-center justify-center z-10">
                                                <div className="text-center">
                                                    <ImageIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                                    <p className="text-cyan-400 font-medium">Drop your image here</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative max-w-3xl mx-auto">
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
                                                placeholder="Type your question or drop an image..."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pr-24 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                                disabled={isSending}
                                            />

                                            {/* Hidden file input */}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileInputChange}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={triggerFileInput}
                                                    className="h-8 w-8 hover:bg-white/10 text-gray-400 hover:text-white"
                                                    disabled={isSending}
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </Button>

                                                {browserSupportsSpeechRecognition ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={listening ? stopListening : startListening}
                                                        className={`h-8 w-8 rounded-lg transition-all ${listening
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                                            }`}
                                                        disabled={isSending}
                                                    >
                                                        {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                    </Button>
                                                ) : null}

                                                <Button
                                                    size="icon"
                                                    onClick={isSending ? cancelRequest : () => handleSendMessage()}
                                                    className={`h-8 w-8 rounded-lg transition-all ${isSending
                                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                                        }`}
                                                    disabled={!inputMessage.trim() && !imagePreview}
                                                >
                                                    {isSending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-gray-500 mt-3">
                                            AI can make mistakes. Consider checking important information.
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