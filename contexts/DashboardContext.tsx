"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ContextService, { LocationContextData } from '@/services/context.service';
import LocationService from '@/services/location.service';
import { useEnhancedUser } from './EnhancedUserContext';

interface ContextState {
    context: LocationContextData | null;
    loading: boolean;
    error: string | null;
    refreshContext: () => Promise<void>;
}

const DashboardContext = createContext<ContextState | undefined>(undefined);

export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [context, setContext] = useState<LocationContextData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, loading: authLoading } = useEnhancedUser();

    const refreshContext = useCallback(async () => {
        // Only sync context if user is authenticated
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Detect location
            const loc = await LocationService.getLocation();

            // 2. Sync with backend (which fetches weather)
            const result = await ContextService.syncContext(loc || {});

            if (result.success) {
                setContext(result.data);
                setError(null);
            }
        } catch (err: any) {
            // Only log errors if we're authenticated (expected to fail if not)
            if (isAuthenticated) {
                console.error("Dashboard context error:", err);
                setError(err.message);

                // Fallback: try to get existing context if sync fails
                try {
                    const existing = await ContextService.getMyContext();
                    if (existing.success) {
                        setContext(existing.data);
                        setError(null);
                    }
                } catch (e) {
                    console.warn("Failed to retrieve cached context:", e);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Wait for auth to finish loading before attempting to sync
        if (authLoading) return;

        refreshContext();

        // Refresh weather every 15 minutes (only if authenticated)
        if (isAuthenticated) {
            const interval = setInterval(refreshContext, 15 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [refreshContext, authLoading, isAuthenticated]);

    return (
        <DashboardContext.Provider value={{ context, loading, error, refreshContext }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    // During SSR/build, return a default value to prevent build failures
    if (!context) {
        return {
            context: null,
            loading: true,
            error: null,
            refreshContext: async () => { console.warn("useDashboardContext called outside of DashboardContextProvider"); }
        };
    }
    return context;
};
