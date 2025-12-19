"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ShortcutItem {
    id: string;
    label: string;
    icon: any;
    href?: string;
    onClick?: () => void;
}

interface ShortcutNavbarProps {
    shortcuts: ShortcutItem[];
    activeItem?: string;
}

export function ShortcutNavbar({ shortcuts, activeItem }: ShortcutNavbarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-2 py-2 shadow-2xl">
                <div className="flex items-center gap-1">
                    {shortcuts.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            asChild={!!item.href}
                            onClick={item.onClick}
                            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl transition-all ${
                                item.id === activeItem
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {item.href ? (
                                <Link href={item.href}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            ) : (
                                <>
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </>
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}