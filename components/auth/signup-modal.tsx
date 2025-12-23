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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "@/lib/schemas";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SignupModalProps {
	_open: boolean;
	onOpenChange: (_open: boolean) => void;
}

export function SignupModal({ _open: isOpen, onOpenChange }: SignupModalProps) {
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
			onOpenChange(false);
		} catch (err: any) {
			if (err instanceof ZodError) {
				const fieldErrors: Record<string, string> = {};
				err.errors.forEach((e) => {
					if (e.path[0]) {
						fieldErrors[e.path[0]] = e.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				// Extract error message from backend response if available
				const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
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
						Join MR5 School
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground">
						Create your account to start learning
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
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Mr Ushantha"
									value={formData.name}
									onChange={handleChange}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
							{errors.name && (
								<p className="text-destructive text-sm">{errors.name}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="ushanthamr@gmail.com"
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
									placeholder="hgufv^_^1234"
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
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="hgufv^_^1234"
									value={formData.confirmPassword}
									onChange={handleChange}
									required
									className="pl-9 bg-background/50 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-2.5 text-muted-foreground hover:text-white transition-colors"
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-destructive text-sm">
									{errors.confirmPassword}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">I want to join as a</Label>
							<Select value={formData.role} onValueChange={handleRoleChange}>
								<SelectTrigger className="bg-background/50">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student">Student</SelectItem>
								</SelectContent>
							</Select>
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
								Creating Account...
							</div>
						) : (
							"Create Account"
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}