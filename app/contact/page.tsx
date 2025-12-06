"use client";

import { Navbar } from "@/components/layout/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">Have questions? Reach out to support@mr5school.local or use the contact form (coming soon).</p>
      </main>
    </div>
  );
}
