"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { paymentService } from "@/services/payment.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle, Rocket, Sparkles, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";

function PaymentSuccessContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [enrollment, setEnrollment] = useState<any>(null);

	useEffect(() => {
		if (!sessionId) {
			setError("No session authentication ID detected. Please contact support if you believe this is an error.");
			setLoading(false);
			return;
		}

		const verifyPayment = async () => {
			try {
				const response = await paymentService.verifyPayment(sessionId);
				if (response.success) {
					setEnrollment(response.data.enrollment);
				} else {
					setError("Payment synchronization failed. We are processing your request.");
				}
			} catch (err: any) {
				setError(err.response?.data?.error || "Failed to establish connection with payment gateway");
			} finally {
				setLoading(false);
			}
		};

		verifyPayment();
	}, [sessionId]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,110,255,0.15)_0%,_transparent_70%)]" />
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="relative z-10 flex flex-col items-center gap-6"
				>
					<div className="relative">
						<Loader2 className="h-20 w-20 animate-spin text-primary opacity-50" />
						<div className="absolute inset-0 flex items-center justify-center">
							<Sparkles className="h-8 w-8 text-primary animate-pulse" />
						</div>
					</div>
					<div className="text-center space-y-2">
						<h2 className="text-2xl font-bold text-white uppercase tracking-widest italic">Syncing Access</h2>
						<p className="text-muted-foreground font-mono text-xs">ESTABLISHING SECURE PROTOCOLS...</p>
					</div>
				</motion.div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="w-full max-w-md"
				>
					<Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-xl overflow-hidden relative">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600" />
						<CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
								<XCircle className="h-8 w-8 text-red-500" />
							</div>
							<h2 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-tight">Access Denied</h2>
							<p className="text-slate-400 text-sm mb-8 leading-relaxed">
								{error}
							</p>
							<div className="grid grid-cols-2 gap-3 w-full">
								<Button variant="outline" className="border-white/10 hover:bg-white/5" asChild>
									<Link href="/courses">Courses</Link>
								</Button>
								<Button variant="default" className="bg-red-600 hover:bg-red-500" asChild>
									<Link href="/contact">Support</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden">
			<Navbar />

			{/* High-end Visual Assets */}
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none" />

			<main className="flex-1 container mx-auto px-4 flex items-center justify-center relative z-10 py-20">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", stiffness: 100, damping: 15 }}
					className="w-full max-w-2xl"
				>
					<Card className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(120,110,255,0.15)]">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />

						<CardContent className="pt-16 pb-12 px-10 text-center">
							{/* Cinematic Success Icon */}
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3, type: "spring" }}
								className="relative w-24 h-24 mx-auto mb-10"
							>
								<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
								<div className="relative w-full h-full bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(120,110,255,0.4)] border border-white/20">
									<CheckCircle2 className="h-10 w-10 text-white" />
								</div>

								{/* Floating Particles */}
								{[...Array(5)].map((_, i) => (
									<motion.div
										key={i}
										animate={{
											y: [-20, 20],
											x: [-10, 10],
											opacity: [0, 1, 0]
										}}
										transition={{
											duration: 2 + i,
											repeat: Infinity,
											delay: i * 0.5
										}}
										className="absolute w-1 h-1 bg-white rounded-full opacity-0"
										style={{
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 100}%`
										}}
									/>
								))}
							</motion.div>

							<h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
								Enrollment Confirmed
							</h1>
							<p className="text-xl text-primary font-bold tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
								<Rocket className="h-5 w-5" /> Welcome to the Elite
							</p>

							<div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-10 text-left relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
								<p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Authenticated Subject</p>
								<h2 className="text-2xl font-bold text-white mb-4 line-clamp-1">{enrollment.course?.title}</h2>
								<p className="text-slate-400 text-sm leading-relaxed mb-0">
									Your credentials have been provisioned. The AI Classroom and dynamic curriculum are now unlocked for your account.
								</p>
							</div>

							<div className="flex flex-col md:flex-row gap-4 justify-center">
								<Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest shadow-[0_0_30px_rgba(120,110,255,0.3)] border border-white/10 group" asChild>
									<Link href={`/course/${enrollment.course?._id}/lesson/start`}>
										<Play className="mr-3 h-5 w-5 fill-current" />
										Enter Classroom
										<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" className="h-16 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest" asChild>
									<Link href="/student/portal">Student Portal</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<p className="text-center mt-8 text-slate-500 text-[10px] uppercase font-mono tracking-[0.3em]">
						PROTOCOL_VERIFIED // SESSION_ENCRYPTED // SYSTEM_OK
					</p>
				</motion.div>
			</main>
		</div>
	);
}

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-[#020617]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		}>
			<PaymentSuccessContent />
		</Suspense>
	);
}