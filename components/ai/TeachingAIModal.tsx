'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    X,
    Sparkles,
    Send,
    Bot,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MoodDetector } from '@/components/classroom/MoodDetector';
// import { cn } from '@/lib/utils';

interface TeachingAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    voiceInteraction: {
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
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        transcript,
        listening,
        startListening,
        stopListening,
        response,
        isSpeaking,
        isProcessing,
        browserSupportsSpeechRecognition,
    } = voiceInteraction;

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

    const handleSendMessage = (text?: string) => {
        const messageToSend = text || inputMessage;
        if (!messageToSend.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setInputMessage('');

        // TODO: Integrate text-based AI call
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
                                    <h4 className="text-sm font-medium text-white mb-2">Session Stats</h4>
                                    <div className="space-y-2 text-xs text-gray-400">
                                        <div className="flex justify-between">
                                            <span>Duration</span>
                                            <span className="text-white">00:12:45</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Topics</span>
                                            <span className="text-white">3 Covered</span>
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
                                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 overflow-hidden relative flex flex-col">
                                    <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
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
                                            {(isProcessing || isSpeaking) && (
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

                                    {/* Input Area */}
                                    <div className="p-6 bg-black/20 border-t border-white/10">
                                        <div className="relative max-w-3xl mx-auto">
                                            <input
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type your question..."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {browserSupportsSpeechRecognition ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={listening ? stopListening : startListening}
                                                        className={`h-8 w-8 rounded-lg transition-all ${listening
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                                            }`}
                                                    >
                                                        {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                    </Button>
                                                ) : null}
                                                <Button
                                                    size="icon"
                                                    onClick={() => handleSendMessage()}
                                                    className="h-8 w-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
                                                >
                                                    <Send className="w-4 h-4" />
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
