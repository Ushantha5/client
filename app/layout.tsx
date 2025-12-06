import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/lib/suppress-auth-errors";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";

export const metadata: Metadata = {
  title: "MR5 School - Learn with AI",
  description: "Advanced learning platform with AI-powered avatars",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeColorProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
