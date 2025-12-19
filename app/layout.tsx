import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/lib/suppress-auth-errors";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import { UIPreferencesProvider } from "@/contexts/UIPreferencesContext";
import { RegionalSettingsProvider } from "@/contexts/RegionalSettingsContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import type { ReactNode } from "react";

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
	children: ReactNode;
}>) {
	const organizationData = generateStructuredData("Organization");
	const websiteData = generateStructuredData("WebSite");

	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<head>
				<StructuredData data={[organizationData, websiteData]} />
				<link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com"} />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
				<meta name="theme-color" content="#18181b" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			</head>
			<body className="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary" suppressHydrationWarning>
				{/* Global Noise Texture */}
				<div className="noise-bg" />

				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<ThemeColorProvider>
						<UIPreferencesProvider>
							<RegionalSettingsProvider>
								<AuthProvider>
									<DashboardContextProvider>
										{children}
										<Toaster />
									</DashboardContextProvider>
								</AuthProvider>
							</RegionalSettingsProvider>
						</UIPreferencesProvider>
					</ThemeColorProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

