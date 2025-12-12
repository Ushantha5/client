"use client";

import { useState, useEffect } from "react";
import { getTimeBasedGreeting } from "@/lib/time-utils";
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
	const [greeting, setGreeting] = useState("");

	const voiceInteraction = useVoiceInteraction(aiProvider);
	const { isSpeaking } = voiceInteraction;

	useEffect(() => {
		setMounted(true);
		setGreeting(getTimeBasedGreeting());
		// Update greeting every minute
		const interval = setInterval(() => {
			setGreeting(getTimeBasedGreeting());
		}, 60000);
		return () => clearInterval(interval);
	}, []);

	if (!mounted) {
		return null; // Prevent hydration mismatch
	}

	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden transition-colors duration-300">
			{loading && <LoadingScreen onComplete={() => setLoading(false)} />}
			<Navbar />

			<main className="flex-1 relative">
				{/* Background Elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
					<div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
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
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
								<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
								<span className="text-sm font-medium text-foreground/80">AI Tutor Online</span>
							</div>

							<h1 className="text-5xl lg:text-7xl font-bold leading-tight">
								{greeting}! Master Any Subject with <br />
								<span className="bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
									AI Intelligence
								</span>
							</h1>

							<p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
								Experience the future of education with our advanced AI avatars.
								Personalized tutoring, real-time feedback, and interactive learning
								sessions available 24/7.
							</p>

							<div className="flex flex-wrap gap-4">
								<Button
									size="lg"
									onClick={() => setIsAIModalOpen(true)}
									className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/25 transition-all hover:scale-105"
								>
									<Sparkles className="mr-2 h-5 w-5" />
									Start AI Session
								</Button>
								<Button
									size="lg"
									variant="outline"
									asChild
									className="border-primary/20 hover:bg-primary/5 text-foreground rounded-full px-8 h-14 text-lg backdrop-blur-sm"
								>
									<Link href="/courses">
										Explore Courses
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
							</div>

							<div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-primary" />
									<span>10k+ Students</span>
								</div>
								<div className="flex items-center gap-2">
									<Trophy className="w-4 h-4 text-primary" />
									<span>#1 AI Platform</span>
								</div>
								<div className="flex items-center gap-2">
									<Play className="w-4 h-4 text-primary" />
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
							<div className="relative z-10 bg-gradient-to-b from-card/50 to-background/50 rounded-3xl border border-primary/10 backdrop-blur-xl shadow-2xl overflow-hidden">
								<div className="absolute inset-0 bg-grid-primary/5 bg-[size:30px_30px]" />
								<Scene isSpeaking={isSpeaking} />

								{/* Floating Badge */}
								<motion.div
									animate={{ y: [0, -10, 0] }}
									transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
									className="absolute bottom-8 right-8 bg-background/60 backdrop-blur-md border border-primary/10 p-4 rounded-2xl flex items-center gap-3"
								>
									<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
										<Mic className="w-5 h-5 text-primary-foreground" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Status</p>
										<p className="text-sm font-bold text-foreground">
											{isSpeaking ? "Speaking..." : "Listening..."}
										</p>
									</div>
								</motion.div>
							</div>

							{/* Decorative Elements behind avatar */}
							<div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-50" />
							<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl opacity-50" />
						</motion.div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 bg-card/30 border-t border-border/50">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
								Why Choose MR5 School?
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Unlock your potential with our cutting-edge learning platform designed for the modern era.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									icon: Sparkles,
									title: "AI-Powered Learning",
									desc: "Interact with intelligent AI avatars that adapt to your learning style and pace.",
									color: "bg-primary/10 text-primary"
								},
								{
									icon: BookOpen,
									title: "Expert Curriculum",
									desc: "Access world-class content curated by industry professionals and certified AI-TEACHERs.",
									color: "bg-purple-500/10 text-purple-500"
								},
								{
									icon: Trophy,
									title: "Personalized Path",
									desc: "Get a customized learning journey tailored to your specific goals and achievements.",
									color: "bg-orange-500/10 text-orange-500"
								}
							].map((feature, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: idx * 0.1 }}
									className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 transition-all hover:bg-card/80 hover:shadow-lg"
								>
									<div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
										<feature.icon className="w-7 h-7" />
									</div>
									<h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
										{feature.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.desc}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-border/50 py-12 bg-card/50">
				<div className="container mx-auto px-4 text-center">
					<p className="text-muted-foreground">&copy; 2025 MR5 School. All rights reserved.</p>
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
