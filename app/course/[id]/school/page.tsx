"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { SchoolScene } from "@/components/3d/school-scene";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

export default function SchoolPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [accessGranted, setAccessGranted] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Wait for Auth to initialize
        if (authLoading) return;

        // 2. Check if logged in
        if (!user) {
            router.replace(`/login?redirect=/course/${courseId}/school`);
            return;
        }

        // 3. Verify Payment/Enrollment
        const verifyAccess = async () => {
            try {
                const response = await apiClient.get(`/enrollments/check/${courseId}`);
                if (response.data.access) {
                    setAccessGranted(true);
                } else {
                    setError("Enrollment required");
                }
            } catch (err: any) {
                console.error("Access check failed", err);
                if (err.response?.status === 401) {
                    router.replace("/login");
                } else if (err.response?.status === 403) {
                    setError("You do not have access to this course. Please enroll first.");
                } else {
                    setError("Unable to verify access. Please try again.");
                }
            } finally {
                setCheckingAccess(false);
            }
        };

        verifyAccess();
    }, [user, authLoading, courseId, router]);

    // Loading State
    if (authLoading || checkingAccess) {
        return (
            <div className="min-h-screen bg-[#0b1226] flex flex-col items-center justify-center text-white space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="animate-pulse text-blue-200">Verifying security credentials...</p>
            </div>
        );
    }

    // Error / Access Denied State
    if (error || !accessGranted) {
        return (
            <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Restricted Area</h1>
                    <p className="text-slate-300 mb-8">{error || "Access denied."}</p>

                    <div className="flex flex-col gap-3">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push(`/course/${courseId}`)}
                        >
                            View Course Details
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-slate-400 hover:text-white"
                            onClick={() => router.push("/dashboard")}
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Success State - Render 3D Scene
    return <SchoolScene />;
}
