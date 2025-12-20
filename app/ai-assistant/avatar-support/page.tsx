"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { AvatarSupportAgent } from "@/components/ai/avatar-support-agent";
import { Navbar } from "@/components/layout/navbar";

export default function AvatarSupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AI Avatar Support Agent</h1>
          <p className="text-muted-foreground mb-8">
            Interact with our AI-powered avatar support agent. You can control LiveKit sessions,
            manage avatar expressions, and handle support tickets.
          </p>
          
          <AvatarSupportAgent />
        </div>
      </main>
    </div>
  );
}