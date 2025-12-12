"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AvanthorRegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		skillName: "",
		description: "",
		category: "",
		contactEmail: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

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
			// For now, just show success message
			// In production, this would create a RegistrationRequest with type "avathor_skill"
			alert(
				"Thank you for your interest! Your Avathor AI skill submission has been received and will be reviewed by our team.",
			);
			router.push("/");
		} catch (error: unknown) {
			setErrors({ general: (error as Error).message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">Join as Avathor AI</h1>
					<p className="text-muted-foreground mb-8">
						Submit your AI skill to be integrated into our platform. Our team
						will review your submission.
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
							<Label htmlFor="skillName">Skill Name *</Label>
							<Input
								id="skillName"
								name="skillName"
								value={formData.skillName}
								onChange={handleChange}
								placeholder="e.g., Math Tutor AI"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<textarea
								id="description"
								name="description"
								rows={4}
								className="w-full px-3 py-2 border rounded-md"
								value={formData.description}
								onChange={handleChange}
								placeholder="Describe what your AI skill does..."
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Category *</Label>
							<Input
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								placeholder="e.g., Education, Language, Science"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="contactEmail">Contact Email *</Label>
							<Input
								id="contactEmail"
								name="contactEmail"
								type="email"
								value={formData.contactEmail}
								onChange={handleChange}
								placeholder="your@email.com"
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Submitting..." : "Submit Skill"}
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
