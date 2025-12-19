"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoadingScreen({
	onComplete,
}: { onComplete?: () => void }) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					if (onComplete) setTimeout(onComplete, 500);
					return 100;
				}
				return prev + 5;
			});
		}, 100);

		return () => clearInterval(interval);
	}, [onComplete]);

	return (
		<div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
			{/* Global Noise Overlay for Loading */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22/%3E%3C/svg%3E')] opacity-20" />

			{/* Logo */}
			<div className="mb-8 relative w-24 h-24">
				<Image
					src="/images/mr5-logo.png"
					alt="MR5 School Logo"
					fill
					sizes="96px"
					className="object-contain drop-shadow-[0_0_15px_rgba(var(--primary-channel),0.5)]"
					priority
				/>
			</div>

			{/* School Name */}
			<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
				MR5 SCHOOL
			</h1>
			<p className="text-lg text-muted-foreground mb-8 italic">
				The Smart Way to Grow
			</p>

			{/* Loading Spinner */}
			<Loader2 className="h-8 w-8 text-primary animate-spin mb-6" />

			{/* Progress Bar */}
			<div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
				<div
					className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(var(--primary-channel),0.8)]"
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<p className="text-muted-foreground mt-4 text-xs font-mono uppercase tracking-widest">
				Initializing System... {progress}%
			</p>
		</div>
	);
}
