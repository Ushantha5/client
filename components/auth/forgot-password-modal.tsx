"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ForgotPasswordModalProps {
    _open: boolean;
    onOpenChange: (_open: boolean) => void;
}

export function ForgotPasswordModal({ _open: isOpen, onOpenChange }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setEmailSent(true);
            toast.success("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to send reset email";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setEmailSent(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px] bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {emailSent ? "Check Your Email" : "Forgot Password?"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        {emailSent
                            ? "We've sent you a password reset link. Please check your email inbox."
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </DialogDescription>
                </DialogHeader>

                {!emailSent ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="reset-email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-9 bg-background/50"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 h-11"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={handleClose}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm text-center">
                            Password reset link sent to <strong>{email}</strong>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleClose}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
