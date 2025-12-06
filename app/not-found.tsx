"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
			<div className="max-w-md w-full text-center space-y-8 p-8 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-xl">
				{/* 404 */}
				<h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse">
					404
				</h1>

				{/* Message */}
				<div className="space-y-4">
					<h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
					<p className="text-muted-foreground text-lg">
						The page you&apos;re looking for doesn&apos;t exist or has been
						moved.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg" className="bg-primary hover:bg-primary/90">
						<Link href="/">
							<Home className="mr-2 h-5 w-5" />
							Go Home
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={() => router.back()}
						className="border-primary/20 hover:bg-primary/5 hover:text-primary"
					>
						<ArrowLeft className="mr-2 h-5 w-5" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
}
