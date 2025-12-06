"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		    <div className="min-h-screen flex items-center justify-center bg-white p-4">
			    <div className="max-w-md w-full text-center space-y-8">
				{/* 404 */}
				<h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					404
				</h1>

				{/* Message */}
				<div className="space-y-4">
					<h2 className="text-3xl font-semibold">Page Not Found</h2>
					<p className="text-muted-foreground text-lg">
						The page you&apos;re looking for doesn&apos;t exist or has been
						moved.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg">
						<Link href="/">
							<Home className="mr-2 h-5 w-5" />
							Go Home
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="javascript:history.back()">
							<ArrowLeft className="mr-2 h-5 w-5" />
							Go Back
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
