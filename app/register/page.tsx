"use client";

import React, { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function RegisterForm() {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"student" | "AI-TEACHER">("student");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password, role);
            toast.success("Registration successful!");
            // Redirect handled by AuthContext
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-slate-400">Join the AI-Powered Learning Platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <Input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <Input
                        type="email"
                        placeholder="student@mr5school.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500"
                        required
                        minLength={6}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">I want to join as</label>
                    <Select value={role} onValueChange={(val: "student" | "AI-TEACHER") => setRole(val)}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="AI-TEACHER">AI Teacher (Requires Approval)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 mt-2"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
