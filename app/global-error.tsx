"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global Error:", error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
					<div className="max-w-md w-full text-center space-y-8">
						{/* Error Icon */}
						<div className="flex justify-center">
							<svg
								className="h-20 w-20 text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>

						{/* Message */}
						<div className="space-y-4">
							<h1 className="text-4xl font-bold text-white">Critical Error</h1>
							<p className="text-slate-300 text-lg">
								We&apos;re experiencing a critical issue. Please try refreshing
								the page.
							</p>
						</div>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={reset}
								className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
							>
								Reload Application
							</button>
							<a
								href="/"
								className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
							>
								Go to Homepage
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
