"use client";

import React, { Suspense, lazy, useState, useCallback } from "react";
import type { Application } from "@splinetool/runtime";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy load Spline for better performance
const Spline = lazy(() => import("@splinetool/react-spline"));

// Type for Spline events (simplified to match actual API)
interface SplineEventTarget {
    name: string;
    id: string;
}

interface SplineSceneProps {
    /** URL of the Spline scene (.splinecode file) */
    scene: string;
    /** Optional CSS class for the container */
    className?: string;
    /** Callback when scene loads */
    onLoad?: (_splineApp: Application) => void;
    /** Callback when an object is clicked */
    onMouseDown?: (_event: { target: SplineEventTarget }) => void;
    /** Callback on hover */
    onMouseHover?: (_event: { target: SplineEventTarget }) => void;
    /** Fallback UI while loading */
    fallback?: React.ReactNode;
    /** Callback when scene fails to load */
    onError?: (_error?: any) => void;
}

/**
 * SplineScene - Base wrapper for all Spline 3D scenes
 */
export function SplineScene({
    scene,
    className = "",
    onLoad,
    onMouseDown,
    onMouseHover,
    fallback,
    onError,
}: SplineSceneProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLoad = useCallback((splineApp: Application) => {
        // Wrap in setTimeout to avoid state updates during render phase
        setTimeout(() => {
            setIsLoading(false);
            onLoad?.(splineApp);
        }, 0);
    }, [onLoad]);

    const handleError = useCallback((err: any) => {
        // Suppress console logging in production - we handle errors gracefully with UI
        if (process.env.NODE_ENV === "development") {
            console.warn("Spline Load Error:", err?.message || err);
        }

        // Wrap in setTimeout to avoid state updates during render phase
        setTimeout(() => {
            setIsLoading(false);

            // Detailed error messages
            if (err?.message?.includes("end of buffer")) {
                setError("3D Model temporarily unavailable");
            } else if (err?.status === 403) {
                setError("Access to 3D scene was denied");
            } else {
                setError("Failed to load 3D scene");
            }

            onError?.(err);
        }, 0);
    }, [onError]);

    const defaultFallback = (
        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl border border-primary/10 backdrop-blur-sm">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <svg
                        className="w-8 h-8 text-primary animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
                <p className="text-sm font-medium text-muted-foreground tracking-tight">Initializing 3D World...</p>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className={`flex items-center justify-center h-full w-full bg-destructive/5 rounded-3xl border border-destructive/10 ${className}`}>
                <p className="text-destructive text-sm font-medium px-4 text-center">{error}</p>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className={`relative w-full h-full ${className}`}>
                {fallback || defaultFallback}
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 z-10 transition-opacity duration-500">
                    {fallback || defaultFallback}
                </div>
            )}
            <ErrorBoundary
                fallback={
                    <div className="flex items-center justify-center h-full w-full bg-destructive/5 rounded-3xl border border-destructive/10">
                        <p className="text-destructive text-sm font-medium px-4 text-center">3D View Crashed. Please refresh.</p>
                    </div>
                }
                onError={handleError}
            >
                <Suspense fallback={fallback || defaultFallback}>
                    <Spline
                        scene={scene}
                        onLoad={handleLoad}
                        onSplineMouseDown={onMouseDown}
                        onSplineMouseHover={onMouseHover}
                        onError={handleError}
                        style={{ width: "100%", height: "100%" }}
                    />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

export default SplineScene;