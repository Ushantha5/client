"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/loading/LoadingScreen";

export default function StudentDashboard() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            // Not logged in, redirect to home
            router.replace("/");
            return;
        }

        // Redirect to the new student portal
        router.replace("/student/portal");
    }, [user, loading, router]);

    return <LoadingScreen onComplete={() => { }} />;
}