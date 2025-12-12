"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/ai.service";
import { ChatMessage } from "@/types/ai";
import { Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
            // Include conversation history context
            const response = await aiService.chat({
                messages: [
                    { role: "system", content: "You are a friendly AI Learning Coach. Keep responses concise and encouraging." },
                    ...messages,
                    userMessage
                ]
            });

            const aiMessage = response.choices[0].message;
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat failed", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting to the network right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-bold">AI Coach</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                        {messages.length === 0 && (
                            <div className="text-center text-blue-200/50 text-sm mt-20">
                                <p>Hi! I&apos;m here to help you learn.</p>
                                <p>Ask me anything!</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white self-end ml-auto rounded-tr-none"
                                        : "bg-white/10 text-blue-100 self-start mr-auto rounded-tl-none border border-white/5"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-300" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your question..."
                            className="flex-1 bg-black/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm border border-white/5 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Avatar Toggle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-32 h-32 animate-[float_6s_ease-in-out_infinite] hover:animate-[float_3s_ease-in-out_infinite] cursor-pointer group"
            >
                <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full transform scale-75 animate-pulse" />
                <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src="/assets/dashboard/ai-coach.png"
                        alt="AI Coach"
                        fill
                        className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                        priority
                    />
                </div>

                {/* Notification Bubble if closed */}
                {!isOpen && messages.length === 0 && (
                    <div className="absolute top-0 right-4 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0b1226] animate-bounce" />
                )}
            </div>
        </div>
    );
}
