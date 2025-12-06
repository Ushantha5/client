"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { Mic, Sparkles, ArrowRight, BookOpen, Users, Trophy, Play } from "lucide-react";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { TeachingAIModal } from "@/components/ai/TeachingAIModal";
import { motion } from "framer-motion";

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("@/components/avatar/Scene"), {
	ssr: false,
});

export default function HomePage() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isAIModalOpen, setIsAIModalOpen] = useState(false);
	const [aiProvider] = useState<"openai" | "gemini" | "mock">("openai");

	const voiceInteraction = useVoiceInteraction(aiProvider);
	const { isSpeaking } = voiceInteraction;

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Prevent hydration mismatch
	}

	return (
		<div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
			{loading && <LoadingScreen onComplete={() => setLoading(false)} />}
			<Navbar />

			<main className="flex-1 relative">
				{/* Background Elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
					<div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />
				</div>

				{/* Hero Section */}
				<section className="container mx-auto px-4 pt-20 pb-32 relative z-10">
					<div className="flex flex-col lg:flex-row items-center gap-12">
						{/* Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="lg:w-1/2 text-left space-y-8"
						>
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
								<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
								<span className="text-sm font-medium text-gray-300">AI Tutor Online</span>
							</div>

							<h1 className="text-5xl lg:text-7xl font-bold leading-tight">
								Master Any Subject with <br />
								<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
									AI Intelligence
								</span>
							</h1>

							<p className="text-xl text-gray-400 max-w-xl leading-relaxed">
								Experience the future of education with our advanced AI avatars.
								Personalized tutoring, real-time feedback, and interactive learning
								sessions available 24/7.
							</p>

							<div className="flex flex-wrap gap-4">
								<Button
									size="lg"
									onClick={() => setIsAIModalOpen(true)}
									className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-8 h-14 text-lg shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
								>
									<Sparkles className="mr-2 h-5 w-5" />
									Start AI Session
								</Button>
								<Button
									size="lg"
									variant="outline"
									asChild
									className="border-white/10 hover:bg-white/5 text-white rounded-full px-8 h-14 text-lg backdrop-blur-sm"
								>
									<Link href="/courses">
										Explore Courses
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
							</div>

							<div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4" />
									<span>10k+ Students</span>
								</div>
								<div className="flex items-center gap-2">
									<Trophy className="w-4 h-4" />
									<span>#1 AI Platform</span>
								</div>
								<div className="flex items-center gap-2">
									<Play className="w-4 h-4" />
									<span>Live Demo</span>
								</div>
							</div>
						</motion.div>

						{/* Avatar Section */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="lg:w-1/2 w-full relative"
						>
							<div className="relative z-10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
								<div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px]" />
								<Scene isSpeaking={isSpeaking} />

								{/* Floating Badge */}
								<motion.div
									animate={{ y: [0, -10, 0] }}
									transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
									className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3"
								>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
										<Mic className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-400">Status</p>
										<p className="text-sm font-bold text-white">
											{isSpeaking ? "Speaking..." : "Listening..."}
										</p>
									</div>
								</motion.div>
							</div>

							{/* Decorative Elements behind avatar */}
							<div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl" />
							<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl" />
						</motion.div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 bg-slate-900/50 border-t border-white/5">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
								Why Choose MR5 School?
							</h2>
							<p className="text-gray-400 max-w-2xl mx-auto">
								Unlock your potential with our cutting-edge learning platform designed for the modern era.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									icon: Sparkles,
									title: "AI-Powered Learning",
									desc: "Interact with intelligent AI avatars that adapt to your learning style and pace.",
									color: "from-cyan-500 to-blue-500"
								},
								{
									icon: BookOpen,
									title: "Expert Curriculum",
									desc: "Access world-class content curated by industry professionals and certified teachers.",
									color: "from-purple-500 to-pink-500"
								},
								{
									icon: Trophy,
									title: "Personalized Path",
									desc: "Get a customized learning journey tailored to your specific goals and achievements.",
									color: "from-amber-500 to-orange-500"
								}
							].map((feature, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: idx * 0.1 }}
									className="group p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-white/10 transition-all hover:bg-slate-900"
								>
									<div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity`}>
										<feature.icon className="w-7 h-7 text-white" />
									</div>
									<h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
										{feature.title}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{feature.desc}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-white/5 py-12 bg-slate-950">
				<div className="container mx-auto px-4 text-center">
					<p className="text-gray-500">&copy; 2025 MR5 School. All rights reserved.</p>
				</div>
			</footer>

			{/* AI Modal */}
			<TeachingAIModal
				isOpen={isAIModalOpen}
				onClose={() => setIsAIModalOpen(false)}
				voiceInteraction={voiceInteraction}
			/>
		</div>
	);
}
