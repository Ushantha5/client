import type { Metadata } from "next";
import "./globals.css";
import { EnhancedUserProvider } from "@/contexts/EnhancedUserContext";
import "@/lib/suppress-auth-errors";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import { UIPreferencesProvider } from "@/contexts/UIPreferencesContext";
import { RegionalSettingsProvider } from "@/contexts/RegionalSettingsContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import ErrorBoundary from "@/components/ErrorBoundary";
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

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
				<link rel="manifest" href="/manifest.webmanifest" />
				<link rel="apple-touch-icon" href="/icon.png" />
				<meta name="apple-mobile-web-app-title" content="MR5 School" />
				<meta name="application-name" content="MR5 School" />
				<meta name="msapplication-TileColor" content="#18181b" />
				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="format-detection" content="telephone=no" />

				{/* 
					FIXED: Aggressive Kill Switch for Service Worker (fixing 503 errors).
					We place this in <head> to run as early as possible.
				*/}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								if ('serviceWorker' in navigator) {
									navigator.serviceWorker.getRegistrations().then(function(registrations) {
										if (registrations.length > 0) {
											for(let registration of registrations) {
												console.log('Antigravity: Killing Service Worker', registration.scope);
												registration.unregister();
											}
											// Clear caches as well
											if ('caches' in window) {
												caches.keys().then(function(names) {
													for (let name of names) caches.delete(name);
												});
											}
											// Force a clean reload to bypass the intercept
											if (!sessionStorage.getItem('sw_killed')) {
												sessionStorage.setItem('sw_killed', 'true');
												window.location.reload();
											}
										}
									});
								}
							})();
						`,
					}}
				/>
			</head>
			<body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary`} suppressHydrationWarning>
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
								<ErrorBoundary>
									<EnhancedUserProvider>
										<DashboardContextProvider>
											{children}
											<Toaster />
											<PerformanceMonitor />
										</DashboardContextProvider>
									</EnhancedUserProvider>
								</ErrorBoundary>
							</RegionalSettingsProvider>
						</UIPreferencesProvider>
					</ThemeColorProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

