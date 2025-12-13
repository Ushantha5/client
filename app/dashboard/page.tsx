"use client";

import { AICoach } from "@/components/dashboard/ai-coach";
import { CourseCard } from "@/components/dashboard/course-card";
import { FeedbackPanel } from "@/components/dashboard/feedback-panel";
import { LiquidProgressBar } from "@/components/dashboard/progress-bar";

export default function DashboardPage() {
    return (
        <div className="min-h-screen w-full bg-[#eef1f6] relative overflow-hidden font-sans selection:bg-blue-200">
            {/* Anti-Gravity Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-100/40 rounded-full blur-[80px]" />

            <main className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center min-h-screen">

                {/* Header Area */}
                <header className="w-full flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                            Hello, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Student</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Ready to continue your space odyssey?</p>
                    </div>

                    {/* Profile Avatar Placeholder for now - minimal neumorphic circle */}
                    <div className="h-12 w-12 rounded-full bg-[#e0e5ec] shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <span className="font-bold text-slate-600">S</span>
                    </div>
                </header>

                {/* Progress Section */}
                <section className="w-full max-w-5xl mb-16 space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-lg font-bold text-slate-700">Overall Progress</h2>
                    </div>
                    <LiquidProgressBar progress={68} />
                </section>

                {/* Cards Grid - Anti Gravity Float Effect applied to container or individual cards */}
                <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-[1000px]">
                    <div className="animate-[float_8s_ease-in-out_infinite] delay-0">
                        <CourseCard
                            title="Cosmic Mathematics"
                            progress={45}
                            className="transform rotate-y-2 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                    <div className="animate-[float_8s_ease-in-out_infinite] delay-[700ms]">
                        <CourseCard
                            title="Quantum Physics 101"
                            progress={78}
                            className="transform -rotate-y-1 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                    <div className="animate-[float_8s_ease-in-out_infinite] delay-[1500ms]">
                        <CourseCard
                            title="Astro-Biology"
                            progress={12}
                            className="transform rotate-y-3 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                </section>

                {/* Feedback Panel - Fixed Bottom Center or just below grid? Layout asked for it "displayed" */}
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                    <FeedbackPanel suggestion="Your next best step is to complete the Quiz on Quantum Entanglement." />
                </div>

                {/* AI Coach - Fixed Bottom Right */}
                <AICoach />
            </main>
        </div>
    );
}
