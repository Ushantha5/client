"use client";

import { Navbar } from "@/components/layout/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">About MR5 School</h1>
        <p className="text-muted-foreground">MR5 School is an AI-powered learning platform that blends human expertise with intelligent avatars to deliver personalized education at scale.</p>
      </main>
    </div>
  );
}
