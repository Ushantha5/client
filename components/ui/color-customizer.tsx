"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUIPreferences } from "@/contexts/UIPreferencesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Palette,
    Sun,
    Moon,
    Monitor,
    RotateCcw,
    Check,
    Type,
    Zap,
    LayoutGrid,
    Sparkles,
} from "lucide-react";

/**
 * Color Customizer Panel
 * 
 * Provides full UI customization including:
 * - 8 premium color themes
 * - Custom color picker
 * - Dark/light mode toggle
 * - Font size slider
 * - Reduce motion toggle
 * - Compact mode toggle
 */
export function ColorCustomizer() {
    const {
        preferences,
        themes,
        activeTheme,
        setTheme,
        setCustomColor,
        updatePreferences,
        resetToDefaults,
    } = useUIPreferences();

    const [customHex, setCustomHex] = useState("#3B82F6");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCustomColorChange = (hex: string) => {
        setCustomHex(hex);
        if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
            setCustomColor(hex);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Appearance</h3>
                        <p className="text-sm text-muted-foreground">Customize your experience</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToDefaults}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                </Button>
            </div>

            {/* Theme Grid */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Color Theme</Label>
                <div className="grid grid-cols-4 gap-3">
                    {themes.map((theme) => (
                        <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(theme.id)}
                            className={`
                relative p-3 rounded-xl border-2 transition-all
                ${activeTheme?.id === theme.id
                                    ? "border-primary shadow-lg shadow-primary/20"
                                    : "border-transparent hover:border-primary/30"
                                }
              `}
                            style={{
                                background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`
                            }}
                        >
                            {activeTheme?.id === theme.id && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                            )}
                            <div className="sr-only">{theme.name}</div>
                        </motion.button>
                    ))}
                </div>

                {/* Theme name display */}
                <p className="text-sm text-center text-muted-foreground">
                    {activeTheme ? activeTheme.name : "Custom Color"}
                </p>
            </div>

            {/* Custom Color Picker */}
            <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Custom Color
                </Label>
                <div className="flex gap-3">
                    <div
                        className="w-12 h-10 rounded-lg border border-border overflow-hidden cursor-pointer"
                        style={{ backgroundColor: customHex }}
                    >
                        <input
                            type="color"
                            value={customHex}
                            onChange={(e) => handleCustomColorChange(e.target.value)}
                            className="w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <Input
                        value={customHex}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        placeholder="#3B82F6"
                        className="flex-1 font-mono text-sm"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomColor(customHex)}
                    >
                        Apply
                    </Button>
                </div>
            </div>

            {/* Expand/Collapse for more options */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full justify-center text-muted-foreground"
            >
                {isExpanded ? "Show Less" : "More Options"}
            </Button>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                >
                    {/* Dark Mode Toggle */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Dark Mode</Label>
                        <div className="flex gap-2">
                            {[
                                { value: "system" as const, icon: Monitor, label: "System" },
                                { value: "light" as const, icon: Sun, label: "Light" },
                                { value: "dark" as const, icon: Moon, label: "Dark" },
                            ].map((option) => (
                                <Button
                                    key={option.value}
                                    variant={preferences.darkMode === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updatePreferences({ darkMode: option.value })}
                                    className="flex-1"
                                >
                                    <option.icon className="w-4 h-4 mr-1" />
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size Slider */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Font Size ({Math.round(preferences.fontScale * 100)}%)
                        </Label>
                        <input
                            type="range"
                            min="0.8"
                            max="1.4"
                            step="0.1"
                            value={preferences.fontScale}
                            onChange={(e) => updatePreferences({ fontScale: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Small</span>
                            <span>Default</span>
                            <span>Large</span>
                        </div>
                    </div>

                    {/* Reduce Motion */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                            />
                        </button>
                    </div>

                    {/* Compact Mode */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                            />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default ColorCustomizer;
