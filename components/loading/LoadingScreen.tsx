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
		<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center z-[100]">
			{/* Logo */}
			<div className="mb-8 relative w-24 h-24">
				<Image
					src="/images/mr5-logo.png"
					alt="MR5 School Logo"
					fill
					sizes="96px"
					className="object-contain animate-pulse"
					priority
				/>
			</div>

			{/* School Name */}
			<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
				MR5 SCHOOL
			</h1>
			<p className="text-lg text-slate-300 mb-8 italic">
				The Smart Way to Grow
			</p>

			{/* Loading Spinner */}
			<Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-6" />

			{/* Progress Bar */}
			<div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<p className="text-slate-400 mt-4 text-sm">Loading... {progress}%</p>
		</div>
	);
}
