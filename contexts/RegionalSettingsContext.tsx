"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { aiService } from "@/services/ai.service";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";

export interface RegionalPreferences {
    schoolHours: string;
    academicCalendar: string;
    holidays: string;
    additionalInfo: string;
}

export interface RegionalSettings {
    location: string;
    language: string;
    timezone: string;
    gradingSystem: string;
    regionalPreferences: RegionalPreferences;
}

interface RegionalSettingsContextValue {
    settings: RegionalSettings | null;
    isLoading: boolean;
    error: string | null;
    refreshSettings: () => Promise<void>;
}

const RegionalSettingsContext = createContext<RegionalSettingsContextValue | null>(null);

export function useRegionalSettings() {
    const context = useContext(RegionalSettingsContext);
    if (!context) {
        throw new Error("useRegionalSettings must be used within RegionalSettingsProvider");
    }
    return context;
}

const DEFAULT_REGIONAL_SETTINGS: RegionalSettings = {
    location: "Unknown",
    language: "English",
    timezone: "UTC",
    gradingSystem: "Standard (A-F)",
    regionalPreferences: {
        schoolHours: "8:00 AM - 3:00 PM",
        academicCalendar: "August - June",
        holidays: "Standard International Holidays",
        additionalInfo: "No additional info available"
    }
};

export const RegionalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [settings, setSettings] = useState<RegionalSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const detectLocation = async () => {
        try {
            // Priority 1: ipapi.co (Geographic location from IP)
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
                const data = await res.json();
                return `${data.city}, ${data.region}, ${data.country_name}`;
            }
        } catch (e) {
            console.warn("IP Geolocation failed, falling back to browser settings", e);
        }

        // Priority 2: Browser settings
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        return `Browser Location (TZ: ${timeZone}, Lang: ${language})`;
    };

    const fetchRegionalInfo = useCallback(async (forcedUser?: any) => {
        const currentUser = forcedUser || user;

        setIsLoading(true);
        setError(null);
        try {
            // 1. Detect location
            const location = await detectLocation();

            // 2. Fetch AI-powered regional info
            const aiData = await aiService.detectRegionalInfo(location);

            const processedSettings: RegionalSettings = {
                location,
                language: aiData.language || navigator.language,
                timezone: aiData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                gradingSystem: aiData.gradingSystem || "Standard",
                regionalPreferences: aiData.regionalPreferences || DEFAULT_REGIONAL_SETTINGS.regionalPreferences
            };

            setSettings(processedSettings);

            // 3. Apply settings to the system
            if (typeof document !== 'undefined') {
                document.documentElement.lang = processedSettings.language.split(',')[0].trim().substring(0, 2).toLowerCase();
            }

            // 4. Sync to profile if logged in and settings differ
            if (currentUser) {
                // Only sync if missing or significantly different (simplified check)
                const shouldSync = !currentUser.timezone || currentUser.timezone === 'UTC';

                if (shouldSync) {
                    await authService.updateProfile({
                        language: processedSettings.language.split(',')[0].trim(),
                        timezone: processedSettings.timezone,
                        gradingSystem: processedSettings.gradingSystem,
                        regionalPreferences: processedSettings.regionalPreferences
                    });
                }
            }

            // Store in localStorage for persistence
            localStorage.setItem("mr5-regional-settings", JSON.stringify(processedSettings));

        } catch (err) {
            console.error("Failed to detect regional settings:", err);
            setError("Failed to automatically detect regional settings.");

            // Fallback to stored or default
            const stored = localStorage.getItem("mr5-regional-settings");
            if (stored) {
                setSettings(JSON.parse(stored));
            } else {
                setSettings(DEFAULT_REGIONAL_SETTINGS);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Initial detection logic
    useEffect(() => {
        const stored = localStorage.getItem("mr5-regional-settings");

        if (stored) {
            const parsed = JSON.parse(stored);
            setSettings(parsed);
            setIsLoading(false);

            // Still check if we need to sync with user profile if they just logged in
            if (user && (!user.timezone || user.timezone === 'UTC')) {
                fetchRegionalInfo(user);
            }
        } else {
            fetchRegionalInfo();
        }
    }, [isAuthenticated, user, fetchRegionalInfo]); // Re-run when auth state changes to ensure sync

    const value: RegionalSettingsContextValue = {
        settings,
        isLoading,
        error,
        refreshSettings: () => fetchRegionalInfo()
    };

    return (
        <RegionalSettingsContext.Provider value={value}>
            {children}
        </RegionalSettingsContext.Provider>
    );
};
