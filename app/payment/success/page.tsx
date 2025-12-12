"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentService } from "@/services/payment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccessContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const sessionId = searchParams.get("session_id");
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [enrollment, setEnrollment] = useState<any>(null);

	useEffect(() => {
		if (!sessionId) {
			setError("No session ID provided");
			setLoading(false);
			return;
		}

		const verifyPayment = async () => {
			try {
				const response = await paymentService.verifyPayment(sessionId);
				if (response.success) {
					setSuccess(true);
					setEnrollment(response.data.enrollment);
				} else {
					setError("Payment verification failed");
				}
			} catch (err: any) {
				setError(err.response?.data?.error || "Failed to verify payment");
			} finally {
				setLoading(false);
			}
		};

		verifyPayment();
	}, [sessionId]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-center space-y-4">
							<Loader2 className="h-12 w-12 animate-spin text-primary" />
							<p className="text-muted-foreground">Verifying your payment...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-red-600">
							<XCircle className="h-6 w-6" />
							Payment Error
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">{error}</p>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => router.push("/courses")}>
								Back to Courses
							</Button>
							<Button onClick={() => router.push("/student")}>
								Go to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (success && enrollment) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-600">
							<CheckCircle2 className="h-6 w-6" />
							Payment Successful!
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							You have successfully enrolled in{" "}
							<span className="font-semibold text-foreground">
								{enrollment.course?.title}
							</span>
						</p>
						<div className="flex gap-2">
							<Button variant="outline" asChild>
								<Link href="/courses">Browse More Courses</Link>
							</Button>
							<Button asChild>
								<Link href="/student">Go to Dashboard</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return null;
};

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		}>
			<PaymentSuccessContent />
		</Suspense>
	);
}

