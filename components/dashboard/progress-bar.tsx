"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress?: number; // 0 to 100
    className?: string;
}

export function LiquidProgressBar({ progress = 0, className }: ProgressBarProps) {
    return (
        <div className={cn("w-full relative", className)}>
            <Progress 
                value={progress} 
                className="h-4 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-blue-500 [&>div]:to-purple-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-foreground">
                    {progress}% Completed
                </span>
            </div>
        </div>
    );
}