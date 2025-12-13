"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { SchoolScene } from "@/components/3d/school-scene";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CreditCard, LogIn, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CoursePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [hasAccess, setHasAccess] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [courseData, setCourseData] = useState<any>(null);

    // Fetch Course Data & Verify Access
    useEffect(() => {
        const init = async () => {
            if (authLoading) return;

            try {
                // 1. Fetch Course Info (Public)
                // Using a mock if API fails for demo reliability
                try {
                    const cRes = await apiClient.get(`/courses/${courseId}`);
                    setCourseData(cRes.data.data);
                } catch (e) {
                    setCourseData({ title: "Course Details", price: 99.99, description: "Loading failed or course not found." });
                }

                // 2. If User is Logged In, Check Access
                if (user) {
                    if (courseId === '123') {
                        console.log("Demo mode for course 123");
                    } else {
                        try {
                            const accessRes = await apiClient.get(`/enrollments/check/${courseId}`);
                            if (accessRes.data.access) {
                                setHasAccess(true);
                            }
                        } catch (e) {
                            console.log("Not enrolled");
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setVerifying(false);
            }
        };

        init();
    }, [user, authLoading, courseId]);

    const handleEnroll = async () => {
        // Simulate payment/enrollment for now
        // In real app: router.push(`/payment/${courseId}`)
        if (!user) return router.push("/login?redirect=/course/" + courseId);

        alert("Redirecting to payment gateway... (Simulated Success)");
        // After payment success:
        setHasAccess(true);
    };

    if (authLoading || verifying) {
        return (
            <div className="min-h-screen bg-[#0b1226] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/20 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-lg">{courseData?.title || "Course"}</h1>
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <Link href="/login">
                                <Button variant="ghost" className="text-white hover:text-blue-400">
                                    <LogIn className="mr-2 h-4 w-4" /> Login
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">{user.name[0]}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Course Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                {courseData?.title}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {courseData?.description || "Master the concepts of this subject through our immersive 3D campus."}
                            </p>
                        </div>

                        {/* Action Area */}
                        {!user ? (
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold mb-2">Join the Class</h3>
                                <p className="text-slate-400 mb-4">Login to access the 3D campus and start learning.</p>
                                <Link href={`/login?redirect=/course/${courseId}`}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-500">
                                        <LogIn className="mr-2 h-4 w-4" /> Login to Enroll
                                    </Button>
                                </Link>
                            </div>
                        ) : !hasAccess ? (
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-purple-400" />
                                    Enrollment Required
                                </h3>
                                <p className="text-slate-300 mb-6">Purchase this course to unlock the 3D Virtual School.</p>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-3xl font-bold">${courseData?.price || "49.99"}</span>
                                    <span className="text-sm text-slate-400">One-time payment</span>
                                </div>
                                <Button onClick={handleEnroll} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12">
                                    <CreditCard className="mr-2 h-4 w-4" /> Enroll Now
                                </Button>
                            </div>
                        ) : (
                            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30">
                                <h3 className="text-xl font-bold mb-2 text-green-400">Ready to Learn!</h3>
                                <p className="text-slate-300 mb-4">You have full access to the campus.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href={`/course/${courseId}/room/mensa`}>
                                        <Button variant="outline" className="w-full justify-between">
                                            Mensa <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/course/${courseId}/room/principal`}>
                                        <Button variant="outline" className="w-full justify-between">
                                            Principal&apos;s Office <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/course/${courseId}/room/bathroom`}>
                                        <Button variant="outline" className="w-full justify-between">
                                            Restroom <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/course/${courseId}/room/classroom`}>
                                        <Button variant="outline" className="w-full justify-between hover:bg-yellow-500/20 hover:border-yellow-500/50">
                                            History Classroom <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: 3D Experience (Conditional) */}
                    <div className="relative min-h-[500px]">
                        {!user ? (
                            <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-col text-center p-8">
                                <Lock className="h-16 w-16 text-slate-600 mb-4" />
                                <h3 className="text-2xl font-bold text-slate-500">Campus Locked</h3>
                                <p className="text-slate-600">Please login to view</p>
                            </div>
                        ) : !hasAccess ? (
                            <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-col text-center p-8">
                                <CreditCard className="h-16 w-16 text-slate-600 mb-4" />
                                <h3 className="text-2xl font-bold text-slate-500">Payment Required</h3>
                                <p className="text-slate-600">Enroll to enter the 3D school</p>
                            </div>
                        ) : (
                            <SchoolScene />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
