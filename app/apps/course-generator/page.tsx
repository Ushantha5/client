"use client";

import AICourseGenerator from "@/components/AICourseGenerator";
import { Navbar } from "@/components/layout/navbar";

export default function CourseGeneratorPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-12">
                <AICourseGenerator />
            </div>
        </div>
    );
}
