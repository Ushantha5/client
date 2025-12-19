"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ContextService, { LocationContextData } from '@/services/context.service';
import LocationService from '@/services/location.service';

interface ContextState {
    context: LocationContextData | null;
    loading: boolean;
    error: string | null;
    refreshContext: () => Promise<void>;
}

const DashboardContext = createContext<ContextState | undefined>(undefined);

export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [context, setContext] = useState<LocationContextData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshContext = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Detect location
            const loc = await LocationService.getLocation();

            // 2. Sync with backend (which fetches weather)
            const result = await ContextService.syncContext(loc || {});

            if (result.success) {
                setContext(result.data);
            }
        } catch (err: any) {
            console.error("Dashboard context error:", err);
            setError(err.message);

            // Fallback: try to get existing context if sync fails
            try {
                const existing = await ContextService.getMyContext();
                if (existing.success) setContext(existing.data);
            } catch (e) {
                console.warn("Failed to retrieve cached context:", e);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshContext();

        // Refresh weather every 15 minutes
        const interval = setInterval(refreshContext, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [refreshContext]);

    return (
        <DashboardContext.Provider value={{ context, loading, error, refreshContext }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardContext must be used within a DashboardContextProvider');
    }
    return context;
};
