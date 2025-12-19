"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/loading/LoadingScreen";

/**
 * Dashboard Redirect Page
 * 
 * Redirects users to their role-specific dashboard:
 * - Students → /student
 * - Admins → /admin
 * - Others → /courses
 */
export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            // Not logged in, redirect to home
            router.replace("/");
            return;
        }

        // Redirect based on role
        switch (user.role) {
            case "admin":
                router.replace("/admin");
                break;
            case "student":
                router.replace("/student");
                break;
            default:
                router.replace("/courses");
        }
    }, [user, loading, router]);

    return <LoadingScreen onComplete={() => { }} />;
}
