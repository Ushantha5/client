"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingFeature {
    text: string;
    included: boolean;
}

export interface PricingTier {
    name: string;
    description: string;
    price: {
        monthly: number;
        annual: number;
    };
    features: PricingFeature[];
    highlight?: boolean;
    ctaText?: string;
    popular?: boolean;
}

interface PricingCardProps {
    tier: PricingTier;
    isAnnual: boolean;
    index: number;
}

export const PricingCard = ({ tier, isAnnual, index }: PricingCardProps) => {
    // Calculate monthly equivalent for annual price display if needed, 
    // but usually we just show the full annual price or the monthly breakdown.
    // Standard pattern: Show monthly cost even for annual billing
    const displayPrice = isAnnual ? (tier.price.annual / 12).toFixed(0) : tier.price.monthly;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
                "relative flex flex-col p-6 rounded-3xl transition-all duration-300 group",
                "backdrop-blur-xl border border-white/5",
                tier.popular
                    ? "bg-gradient-to-b from-white/10 to-transparent border-primary/50 shadow-2xl shadow-primary/20"
                    : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
            )}
        >
            {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-lg shadow-primary/50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                </div>
            )}

            {/* Decorative Glow */}
            {tier.popular && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 blur-3xl rounded-3xl" />
            )}

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white/90 mb-2">{tier.name}</h3>
                <p className="text-sm text-white/50 min-h-[40px]">{tier.description}</p>
            </div>

            <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-white tracking-tight">${displayPrice}</span>
                <span className="text-white/40 ml-2 text-sm">{isAnnual ? "/mo (billed annually)" : "/mo"}</span>
            </div>

            <Button
                className={cn(
                    "w-full mb-8 rounded-xl h-12 font-medium transition-all duration-300",
                    tier.popular
                        ? "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 hover:shadow-white/20"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                )}
            >
                {tier.ctaText || "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="space-y-4 flex-1">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Features</p>
                <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <div className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                feature.included ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20"
                            )}>
                                {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </div>
                            <span className={cn("leading-5", feature.included ? "text-white/80" : "text-white/30")}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};
