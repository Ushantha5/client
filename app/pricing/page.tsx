"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PricingCard, PricingTier } from "@/components/pricing/PricingCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, absolutely. You can cancel your subscription at any time from your account settings. You'll retain access until the end of your current billing period."
    },
    {
        question: "Is there a student discount available?",
        answer: "We offer special pricing for students with a valid .edu email address. verification is automatic during signup."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay."
    },
    {
        question: "Do you offer team licenses?",
        answer: "Yes! Our Team plan supports bulk enrollment and centralized billing. Contact sales for organizations larger than 50 members."
    }
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col font-sans">
            <Navbar />

            <main className="relative flex-1 pt-24 pb-20 px-4 overflow-hidden">
                {/* Background Noise & Gradients */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px]  bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px]  bg-primary/10 blur-[100px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-4 backdrop-blur-sm"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Risk-free 14-day trial</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
                        >
                            Invest in your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">Future Self</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        >
                            Unlock the full power of AI-driven education. Simple pricing, no hidden fees.
                        </motion.p>
                    </div>

                    <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
                        {tiers.map((tier, index) => (
                            <PricingCard
                                key={index}
                                tier={tier}
                                isAnnual={isAnnual}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">Have questions? We&apos;re here to help.</p>
                        </div>

                        <div className="space-y-4">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
                                    >
                                        <span className="text-lg font-medium pr-8">{faq.question}</span>
                                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", openFaq === i ? "rotate-180" : "")} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support CTA */}
                    <div className="mt-24 text-center pb-8 border-t border-white/10 pt-16">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                            <HelpCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-6">Our support team is ready to assist you.</p>
                        <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
