"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useThemeColor } from "@/contexts/ThemeColorContext";
import { useUIPreferences } from "@/contexts/UIPreferencesContext";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Moon,
    Sun,
    Paintbrush,
    Check,
    Laptop,
    Sparkles,
    Type,
    Zap,
    LayoutGrid,
    RotateCcw,
    Palette,
    Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeCustomizer() {
    const { setTheme, theme } = useTheme();
    const { themeColor, setThemeColor } = useThemeColor();
    const {
        preferences,
        themes,
        activeTheme,
        setTheme: setUITheme,
        setCustomColor,
        resetToDefaults,
        updatePreferences
    } = useUIPreferences();

    const [open, setOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customHex, setCustomHex] = useState("#3B82F6");
    const [mounted, setMounted] = useState(false);
    const [themeTransition, setThemeTransition] = useState<{ from: string, to: string } | null>(null);

    // For SSR
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync custom color with current theme when it's custom
    useEffect(() => {
        if (preferences.themeId === "custom" && preferences.customPrimary) {
            const hsl = preferences.customPrimary;
            // Convert HSL to hex approximation
            const hex = hslToHex(hsl.h, hsl.s, hsl.l);
            setCustomHex(hex);
        }
    }, [preferences.themeId, preferences.customPrimary]);

    // Convert HSL to Hex (simplified)
    const hslToHex = (h: number, s: number, l: number) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const handleCustomColorChange = (hex: string) => {
        setCustomHex(hex);
        if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
            setCustomColor(hex);
        }
    };

    // Handle theme mode change with 3D-like animation
    const handleThemeChange = (newTheme: string) => {
        setThemeTransition({ from: theme || 'system', to: newTheme });
        setTimeout(() => {
            setTheme(newTheme);
            setThemeTransition(null);
        }, 300);
    };

    // Handle theme color change with 3D-like animation
    const handleThemeColorChange = (colorName: string) => {
        setThemeTransition({ from: themeColor, to: colorName });
        setTimeout(() => {
            setThemeColor(colorName as any);
            setThemeTransition(null);
        }, 300);
    };

    const colors = [
        { name: "blue", class: "bg-blue-600", label: "Ocean Blue" },
        { name: "green", class: "bg-green-600", label: "Emerald" },
        { name: "purple", class: "bg-purple-600", label: "Royal" },
        { name: "orange", class: "bg-orange-600", label: "Sunset" },
        { name: "rose", class: "bg-rose-600", label: "Rose" },
    ];

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
                <Paintbrush className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 data-[state=open]:bg-muted data-[state=open]:text-muted-foreground transition-colors"
                >
                    <motion.div
                        whileHover={{
                            rotate: [0, -10, 10, -10, 0],
                            scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paintbrush className="h-4 w-4" />
                    </motion.div>
                    <span className="sr-only">Customize theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-[380px] p-6 backdrop-blur-xl bg-background/90 border-border/50 shadow-2xl rounded-3xl max-h-[80vh] overflow-y-auto"
            >
                <div className="space-y-6">
                    {/* Header with 3D animation */}
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <motion.h4
                                className="font-semibold leading-none text-foreground tracking-tight flex items-center gap-2"
                                whileHover={{
                                    scale: 1.05,
                                    rotateX: 10
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Palette className="w-4 h-4" />
                                Appearance
                            </motion.h4>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetToDefaults}
                                    className="text-muted-foreground hover:text-foreground h-8 px-2"
                                >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    Reset
                                </Button>
                            </motion.div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Customize the interface to match your preference.
                        </p>
                    </motion.div>

                    {/* Theme Mode with 3D animations */}
                    <div className="space-y-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Monitor className="w-3 h-3" />
                            Theme Mode
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {([
                                { value: "light", icon: Sun, label: "Light" },
                                { value: "dark", icon: Moon, label: "Dark" },
                                { value: "system", icon: Laptop, label: "System" }
                            ] as const).map((mode) => (
                                <motion.div
                                    key={mode.value}
                                    whileHover={{
                                        y: -5,
                                        rotateX: 15,
                                        scale: 1.03
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                        rotateX: -10
                                    }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="perspective-1000"
                                    style={{ perspective: "1000px" }}
                                >
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "flex flex-col items-center justify-center h-20 space-y-2 border-2 rounded-2xl hover:bg-muted/50 transition-all duration-300 w-full",
                                            theme === mode.value ? "border-primary bg-primary/5 text-primary" : "border-border/50"
                                        )}
                                        onClick={() => handleThemeChange(mode.value)}
                                    >
                                        <motion.div
                                            animate={themeTransition?.to === mode.value ? {
                                                rotateY: [0, 360],
                                                scale: [1, 1.2, 1]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <mode.icon className="h-5 w-5" />
                                        </motion.div>
                                        <span className="text-xs font-medium">{mode.label}</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Accent Colors with 3D animations */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Accent Color
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold border-primary/20 text-primary bg-primary/5">
                                {colors.find(c => c.name === themeColor)?.label || activeTheme?.name || "Custom"}
                            </Badge>
                        </div>

                        {/* Preset Themes with 3D animations */}
                        <div className="grid grid-cols-5 gap-3">
                            {themes.slice(0, 5).map((themeOption, index) => (
                                <motion.button
                                    key={themeOption.id}
                                    whileHover={{
                                        y: -8,
                                        rotateY: 20,
                                        scale: 1.1,
                                        zIndex: 10
                                    }}
                                    whileTap={{
                                        scale: 0.9,
                                        rotateY: -10
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    onClick={() => {
                                        setThemeTransition({ from: activeTheme?.id || '', to: themeOption.id });
                                        setTimeout(() => {
                                            setUITheme(themeOption.id);
                                            setThemeTransition(null);
                                        }, 300);
                                    }}
                                    className={cn(
                                        "h-12 w-12 rounded-2xl p-0 border-2 transition-all duration-300 relative overflow-hidden",
                                        activeTheme?.id === themeOption.id
                                            ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                                            : "border-transparent bg-muted/30 hover:bg-muted/50"
                                    )}
                                    style={{
                                        background: `linear-gradient(135deg, ${themeOption.gradientFrom}, ${themeOption.gradientTo})`,
                                        transformStyle: "preserve-3d"
                                    }}
                                >
                                    {activeTheme?.id === themeOption.id && (
                                        <motion.span
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                                        </motion.span>
                                    )}
                                    <span className="sr-only">{themeOption.name}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Legacy Colors for backward compatibility with 3D animations */}
                        <div className="grid grid-cols-5 gap-3 mt-3">
                            {colors.map((color, index) => (
                                <motion.div
                                    key={color.name}
                                    whileHover={{
                                        y: -8,
                                        rotateY: 20,
                                        scale: 1.1,
                                        zIndex: 10
                                    }}
                                    whileTap={{
                                        scale: 0.9,
                                        rotateY: -10
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05 + 0.25,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "h-12 w-12 rounded-2xl p-0 border-2 transition-all duration-300",
                                            themeColor === color.name
                                                ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                                                : "border-transparent bg-muted/30 hover:bg-muted/50"
                                        )}
                                        onClick={() => handleThemeColorChange(color.name)}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        <motion.span
                                            className={cn(
                                                "h-6 w-6 rounded-full shadow-sm",
                                                color.class
                                            )}
                                            animate={themeTransition?.to === color.name ? {
                                                rotate: [0, 360],
                                                scale: [1, 1.3, 1]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                        />
                                        {themeColor === color.name && (
                                            <motion.span
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                <Check className="h-3 w-3 text-white drop-shadow-md" />
                                            </motion.span>
                                        )}
                                        <span className="sr-only">{color.name}</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Options Toggle with 3D effect */}
                    <motion.div
                        whileHover={{
                            scale: 1.02,
                            rotateZ: 2
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full justify-center text-muted-foreground hover:text-foreground"
                        >
                            {showAdvanced ? "Show Less" : "Advanced Options"}
                        </Button>
                    </motion.div>

                    {/* Advanced Options with 3D animations */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, rotateX: -15 }}
                                animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                                exit={{ opacity: 0, height: 0, rotateX: -15 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="space-y-6 origin-top"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Custom Color Picker */}
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Palette className="w-3 h-3" />
                                        Custom Color
                                    </div>
                                    <div className="flex gap-3">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-12 h-10 rounded-lg border border-border overflow-hidden cursor-pointer"
                                            style={{ backgroundColor: customHex }}
                                        >
                                            <input
                                                type="color"
                                                value={customHex}
                                                onChange={(e) => handleCustomColorChange(e.target.value)}
                                                className="w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </motion.div>
                                        <div className="flex-1 relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <span className="text-muted-foreground text-sm">#</span>
                                            </div>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                value={customHex.replace("#", "")}
                                                onChange={(e) => handleCustomColorChange(`#${e.target.value}`)}
                                                placeholder="3B82F6"
                                                className="w-full pl-8 pr-3 h-10 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                            />
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCustomColor(customHex)}
                                                className="h-10"
                                            >
                                                Apply
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Font Size Slider */}
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Type className="w-3 h-3" />
                                        Font Size ({Math.round(preferences.fontScale * 100)}%)
                                    </div>
                                    <motion.input
                                        type="range"
                                        min="0.8"
                                        max="1.4"
                                        step="0.1"
                                        value={preferences.fontScale}
                                        onChange={(e) => updatePreferences({ fontScale: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        whileHover={{ scaleY: 1.2 }}
                                        whileTap={{ scaleY: 0.8 }}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Small</span>
                                        <span>Default</span>
                                        <span>Large</span>
                                    </div>
                                </motion.div>

                                {/* Accessibility Options */}
                                <div className="space-y-4">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Accessibility
                                    </div>

                                    {/* Reduce Motion */}
                                    <motion.div
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Reduce Motion</p>
                                                <p className="text-xs text-muted-foreground">Disable animations</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updatePreferences({ reduceMotion: !preferences.reduceMotion })}
                                            className={`
                                                w-12 h-6 rounded-full transition-colors
                                                ${preferences.reduceMotion ? "bg-primary" : "bg-muted-foreground/30"}
                                            `}
                                        >
                                            <motion.div
                                                animate={{ x: preferences.reduceMotion ? 24 : 2 }}
                                                className="w-5 h-5 rounded-full bg-white shadow-sm"
                                                transition={{ type: "spring", stiffness: 500 }}
                                            />
                                        </button>
                                    </motion.div>

                                    {/* Compact Mode */}
                                    <motion.div
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Compact Mode</p>
                                                <p className="text-xs text-muted-foreground">Denser UI layout</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updatePreferences({ compactMode: !preferences.compactMode })}
                                            className={`
                                                w-12 h-6 rounded-full transition-colors
                                                ${preferences.compactMode ? "bg-primary" : "bg-muted-foreground/30"}
                                            `}
                                        >
                                            <motion.div
                                                animate={{ x: preferences.compactMode ? 24 : 2 }}
                                                className="w-5 h-5 rounded-full bg-white shadow-sm"
                                                transition={{ type: "spring", stiffness: 500 }}
                                            />
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PopoverContent>
        </Popover>
    );
}