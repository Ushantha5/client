"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
    isAnnual: boolean;
    onToggle: (value: boolean) => void;
}

export const PricingToggle = ({ isAnnual, onToggle }: PricingToggleProps) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 mb-12">
            <div className="relative p-1 bg-white/5 border border-white/10 rounded-full flex items-center backdrop-blur-md">
                {/* Sliding Background */}
                <motion.div
                    className="absolute top-1 bottom-1 bg-primary rounded-full shadow-lg shadow-primary/25 z-0"
                    initial={false}
                    animate={{
                        left: isAnnual ? "50%" : "4px",
                        right: isAnnual ? "4px" : "50%",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />

                <button
                    onClick={() => onToggle(false)}
                    className={cn(
                        "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 min-w-[100px]",
                        !isAnnual ? "text-white" : "text-white/60 hover:text-white"
                    )}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onToggle(true)}
                    className={cn(
                        "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 min-w-[100px]",
                        isAnnual ? "text-white" : "text-white/60 hover:text-white"
                    )}
                >
                    Yearly
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                    Save up to 20% with yearly billing
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)] animate-pulse">
                    Best Value
                </span>
            </div>
        </div>
    );
};
