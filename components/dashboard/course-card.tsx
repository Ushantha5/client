"use client";

import Image from "next/image";
import { SpotlightCard } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface CourseCardProps {
    title: string;
    progress: number;
    iconPath?: string;
    className?: string;
}

export function CourseCard({ title, progress, iconPath = "/assets/dashboard/course-icon-1.png", className }: CourseCardProps) {
    // Determine button text based on progress
    const getButtonText = () => {
        if (progress > 0) {
            return "Continue Learning";
        }
        return "Start Learning";
    };

    return (
        <SpotlightCard className={`group/card h-full ${className}`} spotlightColor="rgba(var(--primary-channel), 0.15)">
            <div className="flex flex-col h-full bg-surface/50 p-4 relative z-10 transition-colors hover:bg-surface/80">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-white/5">
                    <Image
                        src={iconPath}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transform transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2 group-hover/card:text-primary transition-colors">
                        {title}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            <span>Progress</span>
                            <span className={progress === 100 ? "text-green-400" : "text-primary"}>{progress}%</span>
                        </div>
                        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary-channel),0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Button className="w-full bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 hover:border-primary transition-all duration-300" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        {getButtonText()}
                    </Button>
                </div>
            </div>
        </SpotlightCard>
    );
}