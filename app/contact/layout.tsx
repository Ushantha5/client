import { generateMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
	title: "Contact Us - Get in Touch with MR5 School",
	description:
		"Contact MR5 School for support, course inquiries, partnerships, or general questions. We're here to help you on your learning journey.",
	keywords: [
		"contact MR5 School",
		"support",
		"customer service",
		"help",
		"inquiries",
	],
	url: "/contact",
	type: "website",
});

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

