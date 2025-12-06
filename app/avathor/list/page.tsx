"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";

type Teacher = {
	_id: string;
	specialization?: string;
	bio?: string;
	user?: { name?: string; email?: string };
};

export default function AvathorListPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTeachers = async () => {
			setLoading(true);
			setError(null);
			try {
				const API =
					(process.env.NEXT_PUBLIC_API_URL as string) ||
					"http://localhost:5000/api";
				const res = await fetch(`${API}/avathor/teachers`);
				if (!res.ok) throw new Error(`API error ${res.status}`);
				const json = await res.json();
				setTeachers(json.data || []);
			} catch (err: unknown) {
				setError((err as Error).message || "Failed to fetch teachers");
			} finally {
				setLoading(false);
			}
		};

		fetchTeachers();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 container mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold mb-6">Avathor AI Teachers</h1>

				{loading && <p>Loading...</p>}
				{error && <div className="text-destructive">{error}</div>}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{teachers.map((t) => (
						<Card key={t._id} className="p-4">
							<h3 className="text-xl font-semibold">
								{t.user?.name || "Avathor AI"}
							</h3>
							<p className="text-sm text-muted-foreground">{t.user?.email}</p>
							<p className="mt-2">{t.specialization}</p>
							<p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
						</Card>
					))}

					{!loading && teachers.length === 0 && !error && (
						<div className="text-muted-foreground">
							No Avathor AI teachers found.
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
