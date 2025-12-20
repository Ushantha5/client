"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Rocket } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
	return (
		<div className="min-h-screen w-full bg-[#030712] overflow-hidden relative selection:bg-cyan-500/30 font-sans flex flex-col">
			{/* Nebula Background */}
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
			<div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712]/50 to-[#030712]" />

			<main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
				<div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

					{/* Text Content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="space-y-8 text-center lg:text-left order-2 lg:order-1"
					>
						<div className="space-y-4">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono tracking-wider mb-2">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
								</span>
								ERROR 404: SECTOR NOT FOUND
							</div>

							<h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter drop-shadow-2xl">
								LOST IN <br /> SPACE?
							</h1>

							<p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
								The coordinates you entered led us to a black hole. Don&apos;t worry, even the best explorers get lost sometimes. Let&apos;s recalibrate your trajectory.
							</p>
						</div>

						{/* Action Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
							<Link href="/dashboard" className="group">
								<div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 flex items-center gap-4 group-hover:translate-x-1">
									<div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
										<Rocket className="w-6 h-6" />
									</div>
									<div className="text-left">
										<h3 className="text-white font-semibold">Mission Control</h3>
										<p className="text-xs text-gray-400">Return to Dashboard</p>
									</div>
								</div>
							</Link>

							<Link href="/courses" className="group">
								<div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 flex items-center gap-4 group-hover:translate-x-1">
									<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
										<Compass className="w-6 h-6" />
									</div>
									<div className="text-left">
										<h3 className="text-white font-semibold">Explore</h3>
										<p className="text-xs text-gray-400">Browse Courses</p>
									</div>
								</div>
							</Link>
						</div>

						<div className="pt-4 flex justify-center lg:justify-start">
							<Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
								<ArrowLeft className="w-4 h-4" />
								Back to Home Base
							</Link>
						</div>
					</motion.div>

					{/* 3D Visual */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.2 }}
						className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center order-1 lg:order-2"
					>
						<div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-[120px] animate-pulse" />

						{/* Static Image Fallback */}
						<div className="relative w-full h-full max-w-[600px] drop-shadow-2xl flex items-center justify-center">
							<div className="relative w-64 h-64 md:w-96 md:h-96 animate-float">
								<Image
									src="https://illustrations.popsy.co/amber/floating-in-space.svg"
									alt="Lost in Space"
									fill
									sizes="(max-width: 768px) 100vw, 600px"
									className="object-contain"
									unoptimized
								/>
							</div>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
