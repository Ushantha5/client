"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
    type UserUIPreferences,
    type ColorTheme,
    DEFAULT_UI_PREFERENCES,
    COLOR_THEMES,
    getThemeById,
    loadPreferences,
    savePreferences,
    applyAllPreferences,
    applyTheme,
    applyCustomColor,
    hexToHSL,
} from "@/lib/color-themes";

interface UIPreferencesContextValue {
    /** Current user preferences */
    preferences: UserUIPreferences;
    /** All available themes */
    themes: ColorTheme[];
    /** Current active theme (or undefined if custom) */
    activeTheme: ColorTheme | undefined;
    /** Update preferences */
    updatePreferences: (updates: Partial<UserUIPreferences>) => void;
    /** Set theme by ID */
    setTheme: (themeId: string) => void;
    /** Set custom color from hex */
    setCustomColor: (hex: string) => void;
    /** Reset to defaults */
    resetToDefaults: () => void;
    /** Is loading preferences */
    isLoading: boolean;
}

const UIPreferencesContext = createContext<UIPreferencesContextValue | null>(null);

/**
 * Hook to access UI preferences
 */
export function useUIPreferences(): UIPreferencesContextValue {
    const context = useContext(UIPreferencesContext);
    if (!context) {
        throw new Error("useUIPreferences must be used within UIPreferencesProvider");
    }
    return context;
}

interface UIPreferencesProviderProps {
    children: React.ReactNode;
}

/**
 * Provider for UI preferences and color customization
 */
export function UIPreferencesProvider({ children }: UIPreferencesProviderProps) {
    const [preferences, setPreferences] = useState<UserUIPreferences>(DEFAULT_UI_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);

    // Load preferences on mount
    useEffect(() => {
        const stored = loadPreferences();
        setPreferences(stored);
        applyAllPreferences(stored);
        setIsLoading(false);
    }, []);

    // Update preferences
    const updatePreferences = useCallback((updates: Partial<UserUIPreferences>) => {
        setPreferences((prev) => {
            const next = { ...prev, ...updates };
            savePreferences(next);
            applyAllPreferences(next);
            return next;
        });
    }, []);

    // Set theme by ID
    const setTheme = useCallback((themeId: string) => {
        const theme = getThemeById(themeId);
        if (theme) {
            applyTheme(theme);
            updatePreferences({ themeId, customPrimary: undefined });
        }
    }, [updatePreferences]);

    // Set custom color from hex
    const setCustomColor = useCallback((hex: string) => {
        const hsl = hexToHSL(hex);
        applyCustomColor(hsl.h, hsl.s, hsl.l);
        updatePreferences({
            themeId: "custom",
            customPrimary: hsl,
        });
    }, [updatePreferences]);

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
        setPreferences(DEFAULT_UI_PREFERENCES);
        savePreferences(DEFAULT_UI_PREFERENCES);
        applyAllPreferences(DEFAULT_UI_PREFERENCES);
    }, []);

    // Get active theme
    const activeTheme = preferences.themeId === "custom"
        ? undefined
        : getThemeById(preferences.themeId);

    const value: UIPreferencesContextValue = {
        preferences,
        themes: COLOR_THEMES,
        activeTheme,
        updatePreferences,
        setTheme,
        setCustomColor,
        resetToDefaults,
        isLoading,
    };

    return (
        <UIPreferencesContext.Provider value={value}>
            {children}
        </UIPreferencesContext.Provider>
    );
}

export default UIPreferencesProvider;
