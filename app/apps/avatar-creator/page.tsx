"use client";

import React from 'react';
import AIAvatarCreator from "@/components/AIAvatarCreator";
import { Navbar } from "@/components/layout/navbar";

export default function AvatarCreatorPage() {
    return (
        <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <Navbar />
            <div className="container mx-auto py-12 px-4">
                <AIAvatarCreator />
            </div>
        </div>
    );
}
