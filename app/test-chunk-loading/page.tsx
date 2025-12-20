"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestChunkLoading() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDynamicComponent = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dynamically import a component to test chunk loading
      const loadedModule = await import("@/components/3d/WelcomeAvatar");
      console.log("Successfully imported module:", loadedModule);
      setTestResult("Successfully loaded dynamic component!");
    } catch (err: any) {
      console.error("Failed to load dynamic component:", err);
      setError(`Failed to load dynamic component: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chunk Loading Test</h1>

        <div className="mb-6">
          <Button onClick={loadDynamicComponent} disabled={loading}>
            {loading ? "Loading..." : "Load Dynamic Component"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {testResult && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p>{testResult}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Instructions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click the &quot;Load Dynamic Component&quot; button</li>
            <li>If you see a success message, the chunk loading is working</li>
            <li>If you see an error, there may still be chunk loading issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}