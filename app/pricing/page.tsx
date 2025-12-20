"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PricingCard, PricingTier } from "@/components/pricing/PricingCard";
import { motion } from "framer-motion";

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true);

    const tiers: PricingTier[] = [
        {
            name: "Starter",
            description: "Perfect for exploring AI-powered learning.",
            price: {
                monthly: 0,
                annual: 0,
            },
            ctaText: "Start Learning Free",
            features: [
                { text: "Access to basic courses", included: true },
                { text: "5 AI Tutor queries / day", included: true },
                { text: "Community support", included: true },
                { text: "Basic progress tracking", included: true },
                { text: "Personalized learning path", included: false },
                { text: "Unlimited AI interactions", included: false },
                { text: "Certificate of completion", included: false },
            ],
        },
        {
            name: "Pro Learner",
            description: "Unlock your full potential with unlimited AI.",
            price: {
                monthly: 19,
                annual: 190, // 2 months free
            },
            popular: true,
            ctaText: "Upgrade to Pro",
            features: [
                { text: "Access to all courses", included: true },
                { text: "Unlimited AI Tutor queries", included: true },
                { text: "Priority support", included: true },
                { text: "Advanced analytics", included: true },
                { text: "Personalized learning path", included: true },
                { text: "Certificate of completion", included: true },
                { text: "1-on-1 Mentorship", included: false },
            ],
        },
        {
            name: "Team & School",
            description: "For classrooms and collaborative learning.",
            price: {
                monthly: 99,
                annual: 990,
            },
            ctaText: "Contact Sales",
            features: [
                { text: "Everything in Pro", included: true },
                { text: "Admin dashboard", included: true },
                { text: "Student management", included: true },
                { text: "Custom curriculum", included: true },
                { text: "Bulk enrollment", included: true },
                { text: "API Access", included: true },
                { text: "Dedicated account manager", included: true },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
            <Navbar />

            <main className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                    <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto container">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
                        >
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Learning Potential</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/60"
                        >
                            Choose the plan that fits your journey. Upgrade anytime as you grow.
                        </motion.p>
                    </div>

                    <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {tiers.map((tier, index) => (
                            <PricingCard
                                key={index}
                                tier={tier}
                                isAnnual={isAnnual}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* FAQ or Trust Section could go here */}
                    <div className="mt-24 text-center">
                        <p className="text-white/40 text-sm">
                            All plans include a 14-day money-back guarantee. No questions asked.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
