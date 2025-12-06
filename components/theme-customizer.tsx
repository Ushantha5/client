"use client";

import { useTheme } from "next-themes";
import { useThemeColor } from "@/contexts/ThemeColorContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeCustomizer() {
    const { setTheme, theme } = useTheme();
    const { themeColor, setThemeColor } = useThemeColor();

    const colors = [
        { name: "blue", class: "bg-blue-600" },
        { name: "green", class: "bg-green-600" },
        { name: "purple", class: "bg-purple-600" },
        { name: "orange", class: "bg-orange-600" },
        { name: "rose", class: "bg-rose-600" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Paintbrush className="h-4 w-4" />
                    <span className="sr-only">Customize theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Theme Customizer</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Mode Toggle */}
                <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Mode</p>
                    <div className="flex gap-2">
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                        </Button>
                    </div>
                </div>

                <DropdownMenuSeparator />

                {/* Color Buttons */}
                <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
                    <div className="grid grid-cols-5 gap-1">
                        {colors.map((color) => (
                            <Button
                                key={color.name}
                                variant="outline"
                                className={cn(
                                    "h-8 w-8 rounded-full p-0 border-2",
                                    themeColor === color.name
                                        ? "border-primary"
                                        : "border-transparent hover:border-muted-foreground/50"
                                )}
                                onClick={() => setThemeColor(color.name as any)}
                            >
                                <span
                                    className={cn(
                                        "h-5 w-5 rounded-full",
                                        color.class
                                    )}
                                />
                                <span className="sr-only">{color.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
