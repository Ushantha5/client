"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { apiFetch } from "@/lib/api";
import { registerSchema } from "@/lib/schemas";
import { z } from "zod";

interface SignupModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setLoading(true);

		try {
			// Validate with Zod
			const validated = registerSchema.parse(formData);

			// Call API (don't send confirmPassword)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			await register(
				formData.name,
				formData.email,
				formData.password,
				formData.role as "student" | "teacher",
			);
			onOpenChange(false);
		} catch (err: any) {
			setError(err.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px] bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
				<DialogHeader className="space-y-3">
					<DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
						Join MR5 School
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground">
						Create your account to start learning or teaching
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-destructive" />
							{error}
						</div>
					)}
					className={errors.confirmPassword ? "border-destructive" : ""}
						/>
					{errors.confirmPassword && (
						<p className="text-sm text-destructive">
							{errors.confirmPassword}
						</p>
					)}
				</div>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? "Creating account..." : "Sign Up"}
				</Button>
			</form>
		</DialogContent>
		</Dialog >
	);
}
