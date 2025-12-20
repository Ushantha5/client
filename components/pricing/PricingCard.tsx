"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, ArrowRight, Zap } from "lucide-react";
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
    // Calculate display price
    // If annual, show the monthly breakdown (annual / 12)
    const rawPrice = isAnnual ? tier.price.annual / 12 : tier.price.monthly;
    // Format to 2 decimals if it's not a whole number, or 0 precision if it is
    const displayPrice = rawPrice % 1 === 0 ? rawPrice.toFixed(0) : rawPrice.toFixed(2);
    const isFree = parseFloat(displayPrice) === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 group h-full",
                "backdrop-blur-xl border-2",
                tier.popular
                    ? "bg-gradient-to-b from-white/10 via-white/5 to-transparent border-primary/50 shadow-[0_0_50px_rgba(var(--primary-channel),0.15)]"
                    : "bg-surface border-white/5 hover:border-white/10 hover:bg-white/5"
            )}
        >
            {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-md opacity-50 rounded-full" />
                        <span className="relative bg-gradient-to-r from-primary to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap border border-white/20">
                            <Sparkles className="w-3 h-3 fill-current" /> Most Popular
                        </span>
                    </div>
                </div>
            )}

            {/* Background Glow for Popular Tier */}
            {tier.popular && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
            )}

            <div className="mb-8 relative">
                <h3 className={cn("text-xl font-bold mb-2", tier.popular ? "text-primary-foreground" : "text-white")}>
                    {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">
                    {tier.description}
                </p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white tracking-tight">
                        {isFree ? "Free" : `$${displayPrice}`}
                    </span>
                    {!isFree && (
                        <span className="text-muted-foreground text-sm font-medium">
                            /mo{isAnnual && "*"}
                        </span>
                    )}
                </div>
                {!isFree && isAnnual && (
                    <p className="text-xs text-muted-foreground mt-2 font-medium bg-white/5 inline-block px-2 py-1 rounded">
                        *Billed ${tier.price.annual} yearly
                    </p>
                )}
            </div>

            <Button
                className={cn(
                    "w-full mb-8 rounded-xl h-14 text-base font-semibold transition-all duration-300 shadow-lg",
                    tier.popular
                        ? "bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-primary/20"
                        : "bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20 backdrop-blur-sm"
                )}
            >
                {tier.ctaText || "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            <div className="space-y-6 flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <Zap className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>What&apos;s included:</span>
                </div>
                <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.05) }}
                            className="flex items-start gap-3 text-sm group/item"
                        >
                            <div className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300",
                                feature.included
                                    ? "bg-primary/20 border-primary/30 text-primary group-hover/item:bg-primary group-hover/item:text-white"
                                    : "bg-white/5 border-white/10 text-muted-foreground"
                            )}>
                                {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </div>
                            <span className={cn(
                                "leading-6 transition-colors duration-300",
                                feature.included ? "text-white/80 group-hover/item:text-white" : "text-muted-foreground/50 line-through decoration-white/10"
                            )}>
                                {feature.text}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};
