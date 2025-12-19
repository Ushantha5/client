"use client";

import React from "react";
import { useRegionalSettings } from "@/contexts/RegionalSettingsContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Globe,
    Languages,
    Clock,
    GraduationCap,
    Calendar,
    MapPin,
    RefreshCw,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const RegionalInsight: React.FC = () => {
    const { settings, isLoading, error, refreshSettings } = useRegionalSettings();

    if (isLoading) {
        return (
            <Card className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error || !settings) {
        return (
            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 text-center">
                    <Info className="mx-auto h-8 w-8 text-destructive mb-2" />
                    <p className="text-sm font-medium">{error || "Failed to load regional data"}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={refreshSettings}
                    >
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-background to-accent/5 group">
            <CardHeader className="pb-4 relative">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary animate-pulse" />
                            Regional Intelligence
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3 w-3" />
                            {settings.location}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={refreshSettings}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-5">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-500/10 p-2.5 rounded-xl">
                        <Languages className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Primary Language</p>
                        <p className="text-sm font-medium">{settings.language}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-purple-500/10 p-2.5 rounded-xl">
                        <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Time Zone</p>
                        <p className="text-sm font-medium">{settings.timezone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-2.5 rounded-xl">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Academic Standard</p>
                        <p className="text-sm font-medium mb-1">{settings.gradingSystem}</p>
                        <Badge variant="outline" className="text-[10px] font-normal py-0 px-2 h-5 bg-background/50">
                            Regionally Optimized
                        </Badge>
                    </div>
                </div>

                <div className="pt-2 border-t border-border/40 mt-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        Cultural Preferences
                    </p>
                    <div className="grid grid-cols-2 gap-3 pb-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-accent/30 rounded-lg p-2 cursor-help hover:bg-accent/50 transition-colors">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">School Hours</p>
                                        <p className="text-xs font-medium truncate">{settings.regionalPreferences.schoolHours}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Typical classroom hours in your region</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-accent/30 rounded-lg p-2 cursor-help hover:bg-accent/50 transition-colors">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Current Term</p>
                                        <p className="text-xs font-medium truncate">{settings.regionalPreferences.academicCalendar}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Standard academic cycle for your location</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic mt-2 line-clamp-2 leading-relaxed">
                        {settings.regionalPreferences.additionalInfo}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
