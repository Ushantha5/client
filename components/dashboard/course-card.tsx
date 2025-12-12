"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    title: string;
    progress: number;
    iconPath?: string;
    className?: string;
}

export function CourseCard({ title, progress, iconPath = "/assets/dashboard/course-icon-1.png", className }: CourseCardProps) {
    return (
        <div className={cn(
            "relative w-full aspect-[4/5] rounded-[40px] bg-gradient-to-br from-[#e0e5ec] to-[#ffffff] p-6 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2",
            "shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]", // Neumorphism shadow
            "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]", // Blue glow on hover
            className
        )}>
            {/* Inner inset shadow container for depth feeling */}
            <div className="absolute inset-0 rounded-[40px] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ring-blue-400/20" />

            {/* 3D Icon Container */}
            <div className="relative w-32 h-32 mt-4 transform hover:scale-105 transition-transform duration-500">
                <Image
                    src={iconPath}
                    alt={title}
                    fill
                    className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)]"
                />
            </div>

            {/* Content */}
            <div className="w-full space-y-4 z-10">
                <h3 className="text-xl font-bold text-slate-800 text-center leading-tight">
                    {title}
                </h3>

                {/* Custom Neumorphic Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-[#e0e5ec] rounded-full shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff] overflow-hidden p-[2px]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <button className="w-full py-3 rounded-2xl bg-[#e0e5ec] text-blue-600 font-bold shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all duration-200 hover:text-blue-500">
                    Continue
                </button>
            </div>
        </div>
    );
}
