"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function LoginForm() {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const expired = searchParams.get("expired");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (expired === "true") {
            toast.error("Your session has expired. Please log in again.", {
                id: "session-expired",
            });
        }
    }, [expired]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            // Redirect handled by AuthContext
        } catch (error: any) {
            toast.error(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-background/40 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]" />

            <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground">Log in to continue your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-background/50 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary pl-10 h-12 rounded-xl transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-foreground/80">Password</label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline transition-all">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background/50 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary pl-10 h-12 rounded-xl transition-all"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold h-12 rounded-xl mt-4 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LogIn className="h-5 w-5" />
                            <span>Sign In</span>
                        </div>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline transition-all">
                    Register Now
                </Link>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            {/* Logo Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <Link href="/" className="flex flex-col items-center gap-2 group">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                        MR5 School
                    </span>
                    <span className="text-xs text-muted-foreground tracking-widest uppercase">The Smart Way to Grow</span>
                </Link>
            </motion.div>

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Initializing Secure Portal...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>

            {/* Footer Background Decoration */}
            <div className="mt-12 text-center text-xs text-muted-foreground/50">
                &copy; 2025 MR5 School AI-Powered LMS. All connections are encrypted.
            </div>
        </div>
    );
}
