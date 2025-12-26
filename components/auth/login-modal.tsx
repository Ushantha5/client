"use client";

import React, { useState } from "react";
import { ZodError } from "zod";
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
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { loginSchema } from "@/lib/schemas";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordModal } from "./forgot-password-modal";

interface LoginModalProps {
	_open: boolean;
	onOpenChange: (_open: boolean) => void;
}

export function LoginModal({ _open: isOpen, onOpenChange }: LoginModalProps) {
	const { login } = useEnhancedUser();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);

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
			onOpenChange(false);
		} catch (err: any) {
			console.error("Login Error:", err);
			if (err instanceof ZodError) {
				const fieldErrors: Record<string, string> = {};
				err.errors.forEach((e) => {
					if (e.path[0]) {
						fieldErrors[e.path[0]] = e.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				// Enhanced error extraction
				let errorMessage = "Login failed. Please check your credentials.";

				if (err.response) {
					// Server responded with a status code outside 2xx
					const data = err.response.data;
					if (typeof data === 'string') {
						errorMessage = data; // HTML error page or raw string
					} else if (typeof data === 'object') {
						errorMessage = data.message || data.error || JSON.stringify(data);
					} else {
						errorMessage = err.response.statusText || "Server Error";
					}
				} else if (err.message) {
					// Network error or other client-side error
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
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px] bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
				<DialogHeader className="space-y-3">
					<DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
						Welcome Back
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground">
						Access your personalized learning dashboard
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{errors.general && (
						<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-destructive" />
							{errors.general}
						</div>
					)}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="ushanthamr@gmail.com..."
									value={formData.email}
									onChange={handleChange}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
							{errors.email && (
								<p className="text-destructive text-sm">{errors.email}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="hgufv^_^9494..."
									value={formData.password}
									onChange={handleChange}
									required
									className="pl-9 bg-background/50 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-2.5 text-muted-foreground hover:text-white transition-colors"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-destructive text-sm">
									{errors.password}
								</p>
							)}
							<button
								type="button"
								onClick={() => {
									onOpenChange(false);
									setShowForgotPassword(true);
								}}
								className="text-sm text-primary hover:underline mt-1"
							>
								Forgot password?
							</button>
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
								Signing in...
							</div>
						) : (
							"Sign In"
						)}
					</Button>

					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full flex items-center gap-2 h-11 border-white/10 hover:bg-white/5"
						onClick={() => {
							window.location.href = '/api/auth/google';
						}}
					>
						<svg className="h-5 w-5" viewBox="0 0 24 24">
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
			</DialogContent>
			<ForgotPasswordModal _open={showForgotPassword} onOpenChange={setShowForgotPassword} />
		</Dialog>
	);
}