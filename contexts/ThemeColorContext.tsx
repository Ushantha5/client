"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "blue" | "green" | "purple" | "orange" | "rose";

interface ThemeColorContextType {
    themeColor: ThemeColor;
    setThemeColor: (color: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
    const [themeColor, setThemeColor] = useState<ThemeColor>("blue");

    useEffect(() => {
        const savedTheme = localStorage.getItem("themeColor") as ThemeColor;
        if (savedTheme) {
            setThemeColor(savedTheme);
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove previous theme attributes if any
        root.setAttribute("data-theme", themeColor);
        localStorage.setItem("themeColor", themeColor);
    }, [themeColor]);

    return (
        <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeColorContext.Provider>
    );
}

export function useThemeColor() {
    const context = useContext(ThemeColorContext);
    if (!context) {
        throw new Error("useThemeColor must be used within a ThemeColorProvider");
    }
    return context;
}
