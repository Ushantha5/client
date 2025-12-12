"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTimeBasedGreeting } from "@/lib/time-utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Menu, ShoppingCart, BookOpen, Bell, Search } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationSection } from "@/data/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
    title: string;
    navigation?: NavigationSection[];
}

export function DashboardHeader({ title, navigation }: DashboardHeaderProps) {
    const { user, logout } = useAuth();
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        if (user) {
            setGreeting(getTimeBasedGreeting());
        }
        // Update greeting every minute
        const interval = setInterval(() => {
            if (user) {
                setGreeting(getTimeBasedGreeting());
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 gap-4">
                {/* Mobile Menu */}
                {navigation && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0 w-64">
                            <DashboardSidebar navigation={navigation} className="border-0" />
                        </SheetContent>
                    </Sheet>
                )}

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold truncate">{title}</h1>
                    {user && (
                        <p className="text-sm text-muted-foreground truncate">
                            {greeting}, {user.name}
                        </p>
                    )}
                </div>

                {/* Student-specific quick actions */}
                {user?.role === "student" && (
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/courses">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Browse Courses
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/student/courses">
                                <BookOpen className="h-4 w-4 mr-2" />
                                My Courses
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                3
                            </Badge>
                        </Button>
                    </div>
                )}

                {/* Search (for all users) */}
                <div className="hidden lg:flex items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 bg-background"
                        />
                    </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                    <ThemeCustomizer />
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                                            Role: {user.role}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/${user.role}/settings`}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
