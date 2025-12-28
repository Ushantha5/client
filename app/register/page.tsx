"use client";

import React, { useState, Suspense } from "react";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "@/lib/schemas";
import { User, Mail, Lock, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function RegisterForm() {
    const { register } = useEnhancedUser();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            registerSchema.parse(formData);

            await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role as "student" | "AI-TEACHER",
            );
        } catch (err: any) {
            console.error("Register Error:", err);
            if (err instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach((e) => {
                    if (e.path[0]) {
                        fieldErrors[e.path[0]] = e.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                let errorMessage = "Registration failed. Please try again.";

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

                if (errorMessage === "{}") errorMessage = "Server returned an empty error. Please contact support.";

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
            className="w-full max-w-lg bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl overflow-hidden relative"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/20">
                    <Sparkles className="w-3 h-3" />
                    New Era of Learning
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Join MR5 School</h1>
                <p className="text-slate-400 text-sm">Create your futuristic learning account today</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Mr Ushantha"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-white"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-destructive text-[10px] uppercase font-bold tracking-tighter ml-1">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="studen@mr5.com"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Password</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Confirm</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-destructive text-[10px] uppercase font-bold tracking-tighter ml-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Role</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl text-white">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="AI-TEACHER">Instructor (AI Teacher)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 px-2 py-4 text-[10px] text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    aria-label="Create Account"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            Enrolling...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 uppercase tracking-widest italic font-black">
                            Create Account
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </div>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
                Already an explorer?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-bold uppercase tracking-wider ml-1 hover:underline underline-offset-4">
                    Login
                </Link>
            </div>
        </motion.div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Visual enhancements for a futuristic feel */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(147,51,234,0.05)_0%,_transparent_50%)]" />

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
