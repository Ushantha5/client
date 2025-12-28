"use client";

import React, { useState, Suspense } from "react";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { loginSchema } from "@/lib/schemas";
import { Mail, Lock, LogIn, Wand2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function LoginForm() {
    const { login } = useEnhancedUser();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            loginSchema.parse(formData);
            await login(formData.email, formData.password);
            // Redirection is handled by the context or page if needed.
            // But EnhancedUserContext already redirects to /dashboard based on role.
        } catch (err: any) {
            console.error("Login Page Error:", err);
            if (err instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach((e) => {
                    if (e.path[0]) {
                        fieldErrors[e.path[0]] = e.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                let errorMessage = "Invalid credentials. Please try again.";

                if (err.response) {
                    const data = err.response.data;
                    if (typeof data === 'string') {
                        errorMessage = data;
                    } else if (typeof data === 'object') {
                        errorMessage = data.message || data.error || JSON.stringify(data);
                    } else {
                        errorMessage = err.response.statusText || "Server Error";
                    }
                } else if (err.message) {
                    errorMessage = err.message;
                }

                if (errorMessage === "{}") errorMessage = "Server returned an empty error. Please try again.";

                setErrors({
                    general: errorMessage,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl overflow-hidden relative"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/20">
                    <Wand2 className="w-3 h-3" />
                    Student Access
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Welcome Back</h1>
                <p className="text-slate-400 text-sm">Enter your credentials to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                        {errors.general}
                    </motion.div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="student@mr5school.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-white"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-destructive text-[10px] uppercase font-bold tracking-tighter ml-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Password</Label>
                            <Link href="/forgot-password" className="text-[10px] uppercase font-bold text-primary hover:underline">Forgot?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-destructive text-[10px] uppercase font-bold tracking-tighter ml-1">{errors.password}</p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    aria-label="Sign In"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            Authenticating...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 uppercase tracking-widest italic font-black">
                            Sign In
                            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </Button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="bg-slate-900/50 px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-white/10 rounded-xl hover:bg-white/5 transition-all text-white flex items-center gap-2"
                    onClick={() => {
                        window.location.href = '/api/auth/google';
                    }}
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </Button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
                New to our galaxy?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-bold uppercase tracking-wider ml-1 hover:underline underline-offset-4">
                    Register
                </Link>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Visual enhancements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(147,51,234,0.05)_0%,_transparent_50%)]" />

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
