"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationSection } from "@/data/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DashboardSidebarProps {
    navigation: NavigationSection[];
    className?: string;
}

export function DashboardSidebar({
    navigation,
    className,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<string[]>([]);

    const toggleSection = (title: string) => {
        setOpenSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    return (
        <div className={cn("pb-12 w-64 border-r bg-card", className)}>
            <ScrollArea className="h-full px-3 py-4">
                <div className="space-y-4">
                    {navigation.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                                {section.title}
                            </h2>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    if (item.items && item.items.length > 0) {
                                        const isOpen = openSections.includes(item.title);
                                        return (
                                            <Collapsible
                                                key={item.title}
                                                open={isOpen}
                                                onOpenChange={() => toggleSection(item.title)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between"
                                                    >
                                                        <div className="flex items-center">
                                                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                                                            <span>{item.title}</span>
                                                        </div>
                                                        <ChevronDown
                                                            className={cn(
                                                                "h-4 w-4 transition-transform",
                                                                isOpen && "rotate-180"
                                                            )}
                                                        />
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="pl-6 space-y-1">
                                                    {item.items.map((subItem) => (
                                                        <Button
                                                            key={subItem.href}
                                                            variant={
                                                                pathname === subItem.href ? "secondary" : "ghost"
                                                            }
                                                            className="w-full justify-start"
                                                            asChild
                                                        >
                                                            <Link href={subItem.href || "#"}>
                                                                {subItem.title}
                                                                {subItem.label && (
                                                                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                                        {subItem.label}
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </Button>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        );
                                    }

                                    return (
                                        <Button
                                            key={item.href}
                                            variant={isActive ? "secondary" : "ghost"}
                                            className="w-full justify-start"
                                            asChild
                                        >
                                            <Link href={item.href || "#"}>
                                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                                {item.label && (
                                                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                        {item.label}
                                                    </span>
                                                )}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
