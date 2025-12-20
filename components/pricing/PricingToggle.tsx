"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
    isAnnual: boolean;
    onToggle: (value: boolean) => void;
}

export const PricingToggle = ({ isAnnual, onToggle }: PricingToggleProps) => {
    return (
        <div className="flex items-center justify-center space-x-4 mb-10">
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-white" : "text-white/50")}>
                Monthly
            </span>

            <button
                onClick={() => onToggle(!isAnnual)}
                className="relative h-8 w-14 rounded-full bg-white/10 border border-white/20 p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <motion.div
                    className="h-5 w-5 rounded-full bg-primary shadow-lg shadow-primary/50"
                    animate={{ x: isAnnual ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>

            <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", isAnnual ? "text-white" : "text-white/50")}>
                Annual
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full">
                    Save 20%
                </span>
            </span>
        </div>
    );
};
