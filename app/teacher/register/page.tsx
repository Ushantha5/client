"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

import { z } from "zod";

export default function TeacherRegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		bio: "",
		qualifications: "",
		experience: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setLoading(true);

		try {
			// First register as user with teacher role
			 
			const {
				bio: _bio,
				qualifications: _q,
				experience: _e,
				confirmPassword: _cp,
				...userData
			} = formData;

			// Validate user data
			const userValidation = z
				.object({
					name: z.string().min(2),
					email: z.string().email(),
					password: z.string().min(6),
				})
				.parse(userData);

			// Register user
			const response = await apiFetch<{
				success: boolean;
				data: { user: { id: string; status: string } };
			}>("/auth/register", {
				method: "POST",
				body: JSON.stringify({ ...userValidation, role: "teacher" }),
			});

			if (response.success) {
				// Show success message
				alert(
					"Teacher registration submitted! Your account is pending admin approval. You will be notified once approved.",
				);
				router.push("/");
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
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">Become a Teacher</h1>
					<p className="text-muted-foreground mb-8">
						Join our community of expert educators. Your application will be
						reviewed by our admin team.
					</p>

					<form
						onSubmit={handleSubmit}
						className="space-y-6 bg-card p-8 rounded-lg shadow-sm"
					>
						{errors.general && (
							<div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
								{errors.general}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">Full Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={errors.name ? "border-destructive" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								className={errors.email ? "border-destructive" : ""}
							/>
							{errors.email && (
								<p className="text-sm text-destructive">{errors.email}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								className={errors.password ? "border-destructive" : ""}
							/>
							{errors.password && (
								<p className="text-sm text-destructive">{errors.password}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password *</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={formData.confirmPassword}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<textarea
								id="bio"
								name="bio"
								rows={4}
								className="w-full px-3 py-2 border rounded-md"
								value={formData.bio}
								onChange={handleChange}
								placeholder="Tell us about yourself..."
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="qualifications">Qualifications</Label>
							<Input
								id="qualifications"
								name="qualifications"
								value={formData.qualifications}
								onChange={handleChange}
								placeholder="e.g., PhD in Computer Science"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="experience">Experience (Optional)</Label>
							<Input
								id="experience"
								name="experience"
								value={formData.experience}
								onChange={handleChange}
								placeholder="e.g., 5 years teaching experience"
							/>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Submitting..." : "Submit Application"}
						</Button>
					</form>
				</div>
			</main>
			<footer className="border-t py-8 bg-background">
				<div className="container mx-auto px-4 text-center text-muted-foreground">
					<p>&copy; 2025 MR5 School. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
