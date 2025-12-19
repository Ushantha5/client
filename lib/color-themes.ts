/**
 * Color Customization System
 * 
 * Provides 8 premium color themes with RGB values
 * and user customization capabilities
 */

export interface ColorTheme {
    id: string;
    name: string;
    /** Primary color in HSL format for CSS variables */
    primaryH: number;
    primaryS: number;
    primaryL: number;
    /** RGB values for reference */
    primaryRGB: string;
    /** Gradient colors */
    gradientFrom: string;
    gradientTo: string;
    /** Preview colors */
    preview: {
        primary: string;
        secondary: string;
    };
}

/**
 * 8 Premium Color Themes
 */
export const COLOR_THEMES: ColorTheme[] = [
    {
        id: "ocean-blue",
        name: "Ocean Blue",
        primaryH: 221.2,
        primaryS: 83.2,
        primaryL: 53.3,
        primaryRGB: "rgb(59, 130, 246)",
        gradientFrom: "#3B82F6",
        gradientTo: "#06B6D4",
        preview: {
            primary: "#3B82F6",
            secondary: "#0EA5E9",
        },
    },
    {
        id: "forest-green",
        name: "Forest Green",
        primaryH: 142.1,
        primaryS: 76.2,
        primaryL: 36.3,
        primaryRGB: "rgb(34, 197, 94)",
        gradientFrom: "#22C55E",
        gradientTo: "#14B8A6",
        preview: {
            primary: "#22C55E",
            secondary: "#10B981",
        },
    },
    {
        id: "royal-purple",
        name: "Royal Purple",
        primaryH: 262.1,
        primaryS: 83.3,
        primaryL: 57.8,
        primaryRGB: "rgb(139, 92, 246)",
        gradientFrom: "#8B5CF6",
        gradientTo: "#EC4899",
        preview: {
            primary: "#8B5CF6",
            secondary: "#A855F7",
        },
    },
    {
        id: "sunset-orange",
        name: "Sunset Orange",
        primaryH: 24.6,
        primaryS: 95,
        primaryL: 53.1,
        primaryRGB: "rgb(249, 115, 22)",
        gradientFrom: "#F97316",
        gradientTo: "#EF4444",
        preview: {
            primary: "#F97316",
            secondary: "#FB923C",
        },
    },
    {
        id: "rose-pink",
        name: "Rose Pink",
        primaryH: 346.8,
        primaryS: 77.2,
        primaryL: 49.8,
        primaryRGB: "rgb(244, 63, 94)",
        gradientFrom: "#F43F5E",
        gradientTo: "#EC4899",
        preview: {
            primary: "#F43F5E",
            secondary: "#FB7185",
        },
    },
    {
        id: "midnight",
        name: "Midnight",
        primaryH: 222,
        primaryS: 47,
        primaryL: 40,
        primaryRGB: "rgb(55, 65, 81)",
        gradientFrom: "#374151",
        gradientTo: "#1F2937",
        preview: {
            primary: "#374151",
            secondary: "#4B5563",
        },
    },
    {
        id: "amber-gold",
        name: "Amber Gold",
        primaryH: 43,
        primaryS: 96,
        primaryL: 50,
        primaryRGB: "rgb(245, 158, 11)",
        gradientFrom: "#F59E0B",
        gradientTo: "#FBBF24",
        preview: {
            primary: "#F59E0B",
            secondary: "#D97706",
        },
    },
    {
        id: "emerald",
        name: "Emerald",
        primaryH: 160,
        primaryS: 84,
        primaryL: 39,
        primaryRGB: "rgb(16, 185, 129)",
        gradientFrom: "#10B981",
        gradientTo: "#06B6D4",
        preview: {
            primary: "#10B981",
            secondary: "#34D399",
        },
    },
];

/**
 * User UI Preferences
 */
export interface UserUIPreferences {
    /** Selected theme ID or 'custom' */
    themeId: string;
    /** Custom primary color (HSL values) */
    customPrimary?: {
        h: number;
        s: number;
        l: number;
    };
    /** Dark mode preference */
    darkMode: "system" | "light" | "dark";
    /** Custom accent color (hex) */
    accentColor?: string;
    /** Font size scale (0.8 = 80%, 1.0 = 100%, 1.2 = 120%) */
    fontScale: number;
    /** Reduce motion preference */
    reduceMotion: boolean;
    /** Compact mode for denser UI */
    compactMode: boolean;
}

/**
 * Default preferences
 */
export const DEFAULT_UI_PREFERENCES: UserUIPreferences = {
    themeId: "ocean-blue",
    darkMode: "system",
    fontScale: 1.0,
    reduceMotion: false,
    compactMode: false,
};

/**
 * Get theme by ID
 */
export function getThemeById(id: string): ColorTheme | undefined {
    return COLOR_THEMES.find((theme) => theme.id === id);
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ColorTheme): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.style.setProperty("--primary", `${theme.primaryH} ${theme.primaryS}% ${theme.primaryL}%`);
    root.setAttribute("data-theme-id", theme.id);
}

/**
 * Apply custom color
 */
export function applyCustomColor(h: number, s: number, l: number): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.style.setProperty("--primary", `${h} ${s}% ${l}%`);
    root.setAttribute("data-theme-id", "custom");
}

/**
 * Apply font scale
 */
export function applyFontScale(scale: number): void {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--font-scale", scale.toString());
    document.documentElement.style.fontSize = `${scale * 100}%`;
}

/**
 * Apply reduce motion preference
 */
export function applyReduceMotion(reduce: boolean): void {
    if (typeof document === "undefined") return;
    if (reduce) {
        document.documentElement.classList.add("reduce-motion");
    } else {
        document.documentElement.classList.remove("reduce-motion");
    }
}

/**
 * Apply compact mode
 */
export function applyCompactMode(compact: boolean): void {
    if (typeof document === "undefined") return;
    if (compact) {
        document.documentElement.classList.add("compact-mode");
    } else {
        document.documentElement.classList.remove("compact-mode");
    }
}

/**
 * Convert hex to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace("#", "");

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Storage key for user preferences
 */
export const UI_PREFERENCES_STORAGE_KEY = "mr5-ui-preferences";

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: UserUIPreferences): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): UserUIPreferences {
    if (typeof window === "undefined") return DEFAULT_UI_PREFERENCES;

    const stored = localStorage.getItem(UI_PREFERENCES_STORAGE_KEY);
    if (!stored) return DEFAULT_UI_PREFERENCES;

    try {
        return { ...DEFAULT_UI_PREFERENCES, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_UI_PREFERENCES;
    }
}

/**
 * Apply all preferences
 */
export function applyAllPreferences(preferences: UserUIPreferences): void {
    // Apply theme or custom color
    if (preferences.themeId === "custom" && preferences.customPrimary) {
        applyCustomColor(
            preferences.customPrimary.h,
            preferences.customPrimary.s,
            preferences.customPrimary.l
        );
    } else {
        const theme = getThemeById(preferences.themeId);
        if (theme) {
            applyTheme(theme);
        }
    }

    // Apply other preferences
    applyFontScale(preferences.fontScale);
    applyReduceMotion(preferences.reduceMotion);
    applyCompactMode(preferences.compactMode);
}
