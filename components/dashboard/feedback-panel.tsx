"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackPanelProps {
    suggestion: string;
}

export function FeedbackPanel({ suggestion }: FeedbackPanelProps) {
    return (
        <div className="relative group w-full">
            {/* Glowing backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

            {/* Glassmorphic Panel */}
            <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-between gap-6 overflow-hidden">

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />

                <div className="flex items-center gap-4 z-10">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
                            AI Learning Coach
                        </h4>
                        <p className="text-white font-medium text-lg leading-snug">
                            {suggestion}
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-white border border-white/20 rounded-xl px-4 py-6 group/btn z-10 transition-all duration-300"
                >
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
