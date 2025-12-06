"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useThemeColor } from "@/contexts/ThemeColorContext";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Moon, Sun, Paintbrush, Check, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ThemeCustomizer() {
    const { setTheme, theme } = useTheme();
    const { themeColor, setThemeColor } = useThemeColor();
    const [open, setOpen] = useState(false);

    const colors = [
        { name: "blue", class: "bg-blue-600", label: "Ocean Blue" },
        { name: "green", class: "bg-green-600", label: "Emerald" },
        { name: "purple", class: "bg-purple-600", label: "Royal" },
        { name: "orange", class: "bg-orange-600", label: "Sunset" },
        { name: "rose", class: "bg-rose-600", label: "Rose" },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 data-[state=open]:bg-muted data-[state=open]:text-muted-foreground transition-colors">
                    <Paintbrush className="h-4 w-4" />
                    <span className="sr-only">Customize theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[340px] p-6 backdrop-blur-xl bg-background/80 border-border/50 shadow-2xl rounded-3xl">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold leading-none text-foreground tracking-tight">Appearance</h4>
                        <p className="text-sm text-muted-foreground">
                            Customize the interface to match your preference.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme Mode</div>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 space-y-2 border-2 rounded-2xl hover:bg-muted/50 transition-all duration-300",
                                    theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border/50"
                                )}
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-5 w-5" />
                                <span className="text-xs font-medium">Light</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 space-y-2 border-2 rounded-2xl hover:bg-muted/50 transition-all duration-300",
                                    theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border/50"
                                )}
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-5 w-5" />
                                <span className="text-xs font-medium">Dark</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 space-y-2 border-2 rounded-2xl hover:bg-muted/50 transition-all duration-300",
                                    theme === "system" ? "border-primary bg-primary/5 text-primary" : "border-border/50"
                                )}
                                onClick={() => setTheme("system")}
                            >
                                <Laptop className="h-5 w-5" />
                                <span className="text-xs font-medium">System</span>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accent Color</div>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold border-primary/20 text-primary bg-primary/5">
                                {colors.find(c => c.name === themeColor)?.label}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {colors.map((color) => (
                                <Button
                                    key={color.name}
                                    variant="outline"
                                    className={cn(
                                        "h-12 w-12 rounded-2xl p-0 border-2 transition-all duration-300 hover:scale-105",
                                        themeColor === color.name
                                            ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                                            : "border-transparent bg-muted/30 hover:bg-muted/50"
                                    )}
                                    onClick={() => {
                                        setThemeColor(color.name as any);
                                        // Optional: Don't close for color so they can try multiple
                                    }}
                                >
                                    <span
                                        className={cn(
                                            "h-6 w-6 rounded-full shadow-sm",
                                            color.class
                                        )}
                                    />
                                    {themeColor === color.name && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white drop-shadow-md" />
                                        </span>
                                    )}
                                    <span className="sr-only">{color.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
