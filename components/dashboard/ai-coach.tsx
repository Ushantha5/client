"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { aiService } from "@/services/ai.service";
import { ChatMessage } from "@/types/ai";
import { Send, X, Loader2, Mic, Video, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AICoach() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAvatar, setShowAvatar] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);




    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await aiService.chat({
                messages: [
                    { role: "system", content: "You are an advanced AI Tutor. You are helpful, professional, and knowledgeable. You use the student's name and context to provide personalized learning assistance." },
                    ...messages,
                    userMessage
                ]
            });

            const aiMessage = response.choices[0].message as ChatMessage;
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat failed", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "I'm encountering some network turbulence. Please try again in a moment." } as ChatMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto mb-4 w-96 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200 ring-1 ring-white/5 resize-y min-h-[500px]">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex justify-between items-center text-white relative overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            <Avatar className="h-8 w-8 border-2 border-white/20">
                                <AvatarImage src="/assets/dashboard/ai-avatar.png" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-bold tracking-tight block text-sm">AI Tutor</span>
                                <span className="text-[10px] opacity-70 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    Online • Gemini 1.5
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 relative z-10">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setShowAvatar(!showAvatar)}>
                                <Video size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:bg-white/10 hover:text-white">
                                <SettingsIcon size={14} />
                            </Button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full text-white/80 hover:text-white transition-colors ml-1">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* 3D Avatar Pane (Simulated LiveKit / Ready Player Me) */}
                    {showAvatar && (
                        <div className="h-48 bg-black/40 relative border-b border-white/5">
                            {/* In a real implementation with LiveKit / Visemes, this would be a <Canvas> or WebRTC Player */}
                            <Image
                                src="https://render.readyplayer.me/64b73b5b5c98d6001a1c6a2e.png?camera=portrait&background=778899"
                                alt="AI Avatar"
                                fill
                                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                                unoptimized
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/70 backdrop-blur-sm">
                                Live Connection
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent relative min-h-[200px]">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm mt-8 flex flex-col items-center gap-3">
                                <div>
                                    <p className="font-medium text-foreground">Hello! I&apos;m your AI Tutor.</p>
                                    <p className="text-xs opacity-70">I can help you with your courses, quizzes, and assignments.</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground self-end ml-auto rounded-tr-sm"
                                        : "bg-muted/50 text-foreground self-start mr-auto rounded-tl-sm border border-border/50"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start bg-muted/50 p-3 rounded-2xl rounded-tl-sm border border-border/50">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-background/50 border-t border-border/50 flex gap-2 backdrop-blur-md">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 rounded-xl"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Mic size={18} />
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 p-0 rounded-xl shadow-[0_0_15px_rgba(var(--primary-channel),0.3)]"
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto relative w-16 h-16 cursor-pointer group hover:scale-105 transition-transform duration-300"
            >
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-[2px] shadow-lg shadow-purple-500/30">
                    <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center overflow-hidden border-2 border-transparent">
                        <Image
                            src="https://render.readyplayer.me/64b73b5b5c98d6001a1c6a2e.png?camera=portrait&size=200"
                            alt="AI"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}