"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import axios from "axios";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { avatarSkillSchema } from "@/lib/schemas";
import { registrationService } from "@/services/registration.service";

export default function AvatarRegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		skillName: "",
		description: "",
		category: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setSuccessMessage("");
		setLoading(true);

		try {
			avatarSkillSchema.parse(formData);

			const result = await registrationService.submitAvatarSkill(formData);

			setSuccessMessage(result.message || "Your skill submission has been received and will be reviewed.");

			setFormData({
				name: "",
				skillName: "",
				description: "",
				category: "",
				email: "",
			});

			setTimeout(() => {
				router.push("/");
			}, 3000);

		} catch (error: unknown) {
			if (error instanceof ZodError) {
				const fieldErrors: Record<string, string> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						fieldErrors[err.path[0]] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else if (axios.isAxiosError(error) && error.response) {
				setErrors({ general: error.response.data.message || "An API error occurred." });
			} else if (error instanceof Error) {
				setErrors({ general: error.message });
			} else {
				setErrors({ general: "An unexpected error occurred." });
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
					<h1 className="text-3xl font-bold mb-2">Join as Avatar AI</h1>
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
						{successMessage && (
							<div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-md text-sm">
								{successMessage}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">Your Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="e.g., Jane Doe"
								required
							/>
							{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
						</div>

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
							{errors.skillName && <p className="text-sm text-destructive">{errors.skillName}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								name="description"
								rows={4}
								value={formData.description}
								onChange={handleChange}
								placeholder="Describe what your AI skill does..."
								required
							/>
							{errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
							{errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Contact Email *</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="your@email.com"
								required
							/>
							{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Submitting..." : "Submit Skill"}
						</Button>
					</form>
				</div>
			</main>
			<Footer />
		</div>
	);
}