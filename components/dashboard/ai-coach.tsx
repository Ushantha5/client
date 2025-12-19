"use client";

import React from "react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/ai.service";
import { ChatMessage } from "@/types/ai";
import { Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AICoach() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
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
            // Use the default service (which now defaults to Gemini on backend)
            const response = await aiService.chat({
                messages: [
                    { role: "system", content: "You are a friendly AI Learning Coach named Cat Bot. You're helpful, creative, and love to teach. Keep responses concise and encouraging. You have a playful personality and sometimes make cat-related puns." },
                    ...messages,
                    userMessage
                ]
            });

            const aiMessage = response.choices[0].message as ChatMessage;
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat failed", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting to the network right now. Please try again later." } as ChatMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-surface/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200 ring-1 ring-white/5">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 flex justify-between items-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="flex items-center gap-2 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                            <span className="font-bold tracking-tight">Cat Bot</span>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/40 relative">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm mt-20 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <div className="text-3xl">🐱</div>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Meow! I&apos;m Cat Bot</p>
                                    <p className="text-xs opacity-70">Your feline learning companion!</p>
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
                                        : "bg-white/5 text-foreground self-start mr-auto rounded-tl-sm border border-white/10"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/10">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2 backdrop-blur-md">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 rounded-xl"
                        />
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

            {/* Avatar Toggle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-28 h-28 animate-[float_6s_ease-in-out_infinite] hover:animate-[float_3s_ease-in-out_infinite] cursor-pointer group"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/40 blur-[50px] rounded-full transform scale-75 animate-pulse group-hover:bg-primary/60 transition-colors" />

                <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src="/assets/dashboard/ai-coach.png"
                        alt="Cat Bot"
                        fill
                        sizes="112px"
                        className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        priority
                    />
                </div>

                {/* Notification Bubble if closed */}
                {!isOpen && messages.length === 0 && (
                    <div className="absolute top-2 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-bounce shadow-lg shadow-red-500/50" />
                )}
            </div>
        </div>
    );
}