import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/lib/suppress-auth-errors";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = genMeta({
	title: "MR5 School - Learn with AI",
	description:
		"Advanced online learning platform with AI-powered avatars, interactive courses, and personalized education. Learn programming, data science, web development, and more with expert instructors.",
	keywords: [
		"online learning",
		"AI education",
		"online courses",
		"programming courses",
		"web development",
		"data science",
		"machine learning",
		"interactive learning",
		"virtual classroom",
		"e-learning platform",
	],
	url: "/",
	type: "website",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const organizationData = generateStructuredData("Organization");
	const websiteData = generateStructuredData("WebSite");

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<StructuredData data={[organizationData, websiteData]} />
				<link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com"} />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
				<meta name="theme-color" content="#3b82f6" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			</head>
			<body className="bg-background text-foreground" suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ThemeColorProvider>
						<AuthProvider>
							{children}
							<Toaster />
						</AuthProvider>
					</ThemeColorProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
