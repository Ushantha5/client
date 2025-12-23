"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
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
    const { user, loading } = useEnhancedUser();

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
                router.replace("/student/portal");
                break;
            default:
                router.replace("/courses");
        }
    }, [user, loading, router]);

    return <LoadingScreen onComplete={() => { }} />;
}
