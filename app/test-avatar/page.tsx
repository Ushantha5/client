"use client";

import { AvatarSupportAgent } from "@/components/ai/avatar-support-agent";
import { Navbar } from "@/components/layout/navbar";

export default function TestAvatarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Test Avatar Support Agent</h1>
          <AvatarSupportAgent />
        </div>
      </main>
    </div>
  );
}