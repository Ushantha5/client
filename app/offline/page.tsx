"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto bg-muted/20 p-6 rounded-full w-24 h-24 flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            It seems you&apos;ve lost your internet connection. Please check your network settings and try again.
          </p>
        </div>
        
        <div className="pt-4 space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Retry Connection</Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>You can still access cached content when available.</p>
          </div>
        </div>
      </div>
    </div>
  );
}