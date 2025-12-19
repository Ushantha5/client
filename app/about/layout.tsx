import { generateMetadata } from "@/lib/seo";
import { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = generateMetadata({
	title: "About MR5 School - AI-Powered Learning Platform",
	description:
		"Learn about MR5 School, an innovative online learning platform that combines AI-powered avatars, interactive courses, and expert instruction to revolutionize education.",
	keywords: [
		"about MR5 School",
		"online learning platform",
		"AI education",
		"educational technology",
		"e-learning",
	],
	url: "/about",
	type: "website",
});

export default function AboutLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}

