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
			const { confirmPassword: _cp, ...registerData } = validated;
			const response = await apiFetch<{
				success: boolean;
				data: {
					user: {
						id: string;
						name: string;
						email: string;
						role: string;
						status: string;
					};
					token: string;
				};
			}>("/auth/register", {
				method: "POST",
				body: JSON.stringify({ ...registerData, role: "student" }),
			});

			if (response.success) {
				// Redirect to student dashboard
				router.push("/student");
				onOpenChange(false);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Record<string, string> = {};
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(error as any).errors.forEach((err: any) => {
					if (err.path[0]) {
						fieldErrors[err.path[0]] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else if (error instanceof Error) {
				setErrors({ general: error.message });
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-white">
				<DialogHeader>
					<DialogTitle>Join MR5 School</DialogTitle>
					<DialogDescription>
						Create an account to get started. Be careful to select the correct role if applicable.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					{errors.general && (
						<div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
							{errors.general}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							name="name"
							placeholder="John Doe"
							value={formData.name}
							onChange={handleChange}
							className={errors.name ? "border-destructive" : ""}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							className={errors.email ? "border-destructive" : ""}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone (Optional)</Label>
						<Input
							id="phone"
							name="phone"
							placeholder="+1234567890"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							className={errors.password ? "border-destructive" : ""}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">{errors.password}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="••••••••"
							value={formData.confirmPassword}
							onChange={handleChange}
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
		</Dialog>
	);
}
