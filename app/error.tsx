"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application Error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
			<div className="max-w-md w-full text-center space-y-8">
				{/* Error Icon */}
				<div className="flex justify-center">
					<div className="bg-red-500/20 rounded-full p-6 border border-red-500/50">
						<AlertTriangle className="h-16 w-16 text-red-500" />
					</div>
				</div>

				{/* Message */}
				<div className="space-y-4">
					<h1 className="text-4xl font-bold text-white">
						Something Went Wrong
					</h1>
					<p className="text-slate-300 text-lg">
						We encountered an unexpected error.
					</p>
					{process.env.NODE_ENV === "development" && (
						<div className="bg-slate-800 rounded-lg p-4 text-left">
							<p className="text-red-400 text-sm font-mono break-all">
								{error.message}
							</p>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button onClick={reset} size="lg">
						<RefreshCw className="mr-2 h-5 w-5" />
						Try Again
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/">
							<Home className="mr-2 h-5 w-5" />
							Go Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
