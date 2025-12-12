"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { AI-TEACHERService } from "@/services/AI-TEACHER.service";
import { AI-TEACHER } from "@/types/AI-TEACHER";
import { handleApiError } from "@/lib/errorHandler";

export default function AvathorListPage() {
	const [AI-TEACHERs, setAI - TEACHERs] = useState < AI - TEACHER[] > ([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadAI - TEACHERs();
	}, []);

	const loadAI-TEACHERs = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await AI - TEACHERService.getAllAI - TEACHERs();
			if (response.success) {
				setAI - TEACHERs(response.data || []);
			}
		} catch (err: unknown) {
			setError(handleApiError(err, "Fetch AI-TEACHERs"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold mb-6">Avathor AI AI-TEACHERs</h1>

				{loading && <p>Loading...</p>}
				{error && <div className="text-destructive">{error}</div>}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{AI - TEACHERs.map((t) => (
						<Card key={t._id} className="p-4">
							<h3 className="text-xl font-semibold">
								{t.user?.name || "Avathor AI"}
							</h3>
							<p className="text-sm text-muted-foreground">{t.user?.email}</p>
							<p className="mt-2">{t.specialization}</p>
							<p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
						</Card>
					))}

					{!loading && AI - TEACHERs.length === 0 && !error && (
						<div className="text-muted-foreground">
							No Avathor AI AI-TEACHERs found.
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
