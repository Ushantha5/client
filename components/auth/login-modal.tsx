"use client";

import { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface LoginModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(email, password);
			onOpenChange(false);
		} catch (err: any) {
			setError(err.message || "Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const fillDemoCredentials = (role: "admin" | "teacher" | "student") => {
		const credentials = {
			admin: { email: "admin@mr5school.com", password: "Admin@123456" },
			teacher: { email: "teacher@mr5school.com", password: "Teacher@123456" },
			student: { email: "student@mr5school.com", password: "Student@123456" },
		};
		setEmail(credentials[role].email);
		setPassword(credentials[role].password);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-white dark:bg-white">
				<DialogHeader>
					<DialogTitle>Sign In to MR5 School</DialogTitle>
					<DialogDescription>
						Enter your email and password to access your account.
					</DialogDescription>
				</DialogHeader>

				{/* Demo Credentials */}
				<Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
					<CardContent className="pt-4">
						<div className="flex items-start gap-2 mb-3">
							<Info className="h-4 w-4 text-blue-600 mt-0.5" />
							<p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
								Demo Credentials:
							</p>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemoCredentials("admin")}
								className="text-xs"
							>
								Admin
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemoCredentials("teacher")}
								className="text-xs"
							>
								Teacher
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemoCredentials("student")}
								className="text-xs"
							>
								Student
							</Button>
						</div>
					</CardContent>
				</Card>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
