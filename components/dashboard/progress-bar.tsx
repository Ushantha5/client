"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress?: number; // 0 to 100
    className?: string;
}

export function LiquidProgressBar({ progress = 0, className }: ProgressBarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={cn("w-full relative h-[60px] flex items-center", className)}>
            {/* Background Track - Glassmorphic */}
            <div className="absolute inset-x-0 h-4 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* Liquid Flow Animation */}
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-[liquid_3s_linear_infinite]"
                    style={{
                        width: `${progress}%`,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
                    }}
                >
                    {/* Wave effect overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <div className="h-2 w-2 bg-white rounded-full animate-ping" />
                    </div>
                </div>
            </div>

            {/* Floating Labels */}
            <div
                className="absolute -top-6 transform -translate-x-1/2 transition-all duration-700 ease-out z-20"
                style={{ left: `${progress}%` }}
            >
                <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-lg border border-white/40">
                    {progress}% Completed
                </div>
            </div>
        </div>
    );
}
