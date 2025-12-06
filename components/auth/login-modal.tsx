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
import { Info, Lock, Mail } from "lucide-react";

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
			<DialogContent className="sm:max-w-[450px] bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
				<DialogHeader className="space-y-3">
					<DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
						Welcome Back
					</DialogTitle>
					<DialogDescription className="text-center text-muted-foreground">
						Access your personalized learning dashboard
					</DialogDescription>
				</DialogHeader>

				{/* Demo Credentials */}
				<Card className="bg-primary/5 border-primary/10 shadow-none mb-4">
					<CardContent className="pt-4 pb-4">
						<div className="flex items-start gap-2 mb-3">
							<Info className="h-4 w-4 text-primary mt-0.5" />
							<p className="text-sm font-semibold text-primary">
								Try Demo Accounts:
							</p>
						</div>
						<div className="grid grid-cols-3 gap-2">
							{["Admin", "Teacher", "Student"].map((role) => (
								<Button
									key={role}
									type="button"
									variant="outline"
									size="sm"
									onClick={() => fillDemoCredentials(role.toLowerCase() as any)}
									className="text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
								>
									{role}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-destructive" />
							{error}
						</div>
					)}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
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
				</form>
			</DialogContent>
		</Dialog>
	);
}
