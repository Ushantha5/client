"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { aiService } from "@/services/ai.service";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
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
    const { user, isAuthenticated } = useEnhancedUser();
    const [settings, setSettings] = useState<RegionalSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const detectLocation = async () => {
        try {
            // Priority 1: Browser geolocation API (most accurate)
            if (navigator.geolocation) {
                return new Promise<string>((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            try {
                                // Use nominatim for reverse geocoding (no CORS issues)
                                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                                if (res.ok) {
                                    const data = await res.json();
                                    const location = `${data.address.city || data.address.town || data.address.village || 'Unknown'}, ${data.address.state || data.address.region || 'Unknown'}, ${data.address.country || 'Unknown'}`;
                                    resolve(location);
                                } else {
                                    throw new Error('Reverse geocoding failed');
                                }
                            } catch (e) {
                                console.warn("Reverse geocoding failed, using coordinates", e);
                                resolve(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
                            }
                        },
                        () => {
                            // Geolocation denied, fall back to IP
                            resolve("Geolocation denied");
                        },
                        { timeout: 10000 }
                    );
                });
            }

            // Priority 2: IP-based location (fallback with better error handling)
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    return `${data.city || 'Unknown City'}, ${data.region || 'Unknown Region'}, ${data.country_name || 'Unknown Country'}`;
                }
            } catch (e) {
                console.warn("IP Geolocation failed, falling back to browser settings", e);
            }

            // Priority 3: Browser settings
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const language = navigator.language;
            return `Browser Location (TZ: ${timeZone}, Lang: ${language})`;
        } catch (error) {
            console.error("Location detection failed:", error);
            return "Location detection failed";
        }
    };

    const fetchRegionalInfo = useCallback(async (forcedUser?: any) => {
        const currentUser = forcedUser || user;

        setIsLoading(true);
        setError(null);
        try {
            // 1. Detect location with better error handling
            const location = await detectLocation();

            // 2. Fetch AI-powered regional info with error handling
            let aiData;
            try {
                // aiData = await aiService.detectRegionalInfo(location);
                throw new Error("AI Disabled for stability");
            } catch (aiError) {
                console.warn("AI regional detection failed, using defaults:", aiError);
                // Use fallback data if AI fails
                aiData = {
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    gradingSystem: "Standard",
                    regionalPreferences: DEFAULT_REGIONAL_SETTINGS.regionalPreferences
                };
            }

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
                    try {
                        await authService.updateProfile({
                            language: processedSettings.language.split(',')[0].trim(),
                            timezone: processedSettings.timezone,
                            gradingSystem: processedSettings.gradingSystem,
                            regionalPreferences: processedSettings.regionalPreferences
                        });
                    } catch (syncError) {
                        console.warn("Failed to sync regional settings to profile:", syncError);
                    }
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