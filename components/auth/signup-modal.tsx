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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock } from "lucide-react";

interface SignupModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
	const { register } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "student",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await register(
				formData.name,
				formData.email,
				formData.password,
				formData.role as "student" | "AI-TEACHER"
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
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
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
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									required
									className="pl-9 bg-background/50"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">I want to join as a</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}
							>
								<SelectTrigger className="bg-background/50">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student">Student</SelectItem>
									<SelectItem value="AI-TEACHER">AI-TEACHER</SelectItem>
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
