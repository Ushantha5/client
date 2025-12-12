"use client";

import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
	return (
		<div className="min-h-screen w-full bg-[#0b1226] overflow-hidden relative selection:bg-cyan-500/30 font-sans">
			{/* Deep Space Gradient Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#0b1226] via-[#0f172a] to-[#06383a]" />

			{/* Floating Background Particles/Orbs */}
			<div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
			<div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite_delay-1000]" />

			{/* Floating Glass Shards (Decorative) */}
			<div className="absolute top-[20%] right-[15%] w-24 h-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transform rotate-12 animate-[float_10s_ease-in-out_infinite]" />
			<div className="absolute bottom-[30%] left-[10%] w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg transform -rotate-12 animate-[float_12s_ease-in-out_infinite_delay-500]" />

			<main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

				{/* Main Content Container */}
				<div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

					{/* Text Content (Left) */}
					<div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
						<div className="space-y-4">
							<h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-white drop-shadow-[0_0_15px_rgba(0,184,255,0.5)]">
								Oops!
							</h1>
							<p className="text-3xl md:text-4xl font-bold text-white/90">
								You're off the learning path.
							</p>
							<p className="text-lg text-blue-200/60 max-w-lg mx-auto lg:mx-0 font-medium">
								This page doesn't exist — let's get you back on track to your space odyssey.
							</p>
						</div>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
							<Link href="/dashboard" className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300 animate-pulse" />
								<div className="relative px-8 py-4 rounded-full bg-[#0b1226] ring-1 ring-white/10 flex items-center justify-center text-white font-bold tracking-wide shadow-2xl transition-transform transform group-hover:scale-105 active:scale-95">
									<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent group-hover:text-white transition-colors">Return to Dashboard</span>
								</div>
							</Link>

							<Link href="/courses" className="group">
								<div className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-1">
									Browse Courses
								</div>
							</Link>
						</div>
					</div>

					{/* 3D Hero Element (Right) */}
					<div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center order-1 lg:order-2 animate-[float_6s_ease-in-out_infinite]">
						{/* Background Glow Ring */}
						<div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl" />

						{/* Image */}
						<div className="relative w-full h-full max-w-[500px] drop-shadow-[0_20px_50px_rgba(0,184,255,0.2)]">
							<Image
								src="/assets/404-robot.png"
								alt="Lost AI Robot 404"
								fill
								className="object-contain"
								priority
							/>
						</div>
					</div>
				</div>

			</main>

			{/* Floating Footer */}
			<div className="absolute bottom-0 w-full z-20">
				<Footer />
			</div>
		</div>
	);
}
