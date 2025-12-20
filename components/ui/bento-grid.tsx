"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
type BentoGridProps = {
    children: React.ReactNode;
    className?: string;
};

type BentoItemProps = {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    rowSpan?: number;
    title?: string;
    subtitle?: string;
    header?: React.ReactNode;
    icon?: React.ReactNode;
};

// --- Spotlight Card (The Core Huly Component) ---
export const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(120, 110, 255, 0.2)",
}: {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-white/5 bg-surface overflow-hidden rounded-xl",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Effect Layer */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            {/* Content Container */}
            <div className="relative h-full">{children}</div>
        </div>
    );
};

// --- Bento Grid Container ---
export const BentoGrid = ({ children, className }: BentoGridProps) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[minmax(180px,auto)] grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
};

// --- Bento Item ---
export const BentoItem = ({
    children,
    className,
    colSpan = 3,
    rowSpan = 1,
    title,
    subtitle,
    header,
    icon,
}: BentoItemProps) => {
    // Map our 12-column logic to Tailwind classes
    const colSpanClass = {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3", // Standard module
        4: "col-span-1 md:col-span-2 lg:col-span-4", // Wide module
        6: "col-span-1 md:col-span-2 lg:col-span-6", // Macro module
        8: "col-span-1 md:col-span-4 lg:col-span-8", // Hero module
        12: "col-span-1 md:col-span-4 lg:col-span-12",
    };

    const rowSpanClass = rowSpan > 1 ? `row-span-${rowSpan}` : "";

    return (
        <div
            className={cn(
                colSpanClass[colSpan],
                rowSpanClass,
                "group/bento",
                className
            )}
        >
            <SpotlightCard className="h-full w-full spotlight-card">
                <div className="flex flex-col h-full p-4 md:p-8 transition-all duration-300">
                    {header && <div className="mb-4 md:mb-6 flex-1">{header}</div>}

                    <div className="group-hover/bento:translate-x-1.5 transition duration-500 ease-in-out h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-2 md:mb-3">
                            {icon && <div className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">{icon}</div>}
                            {title && <h3 className="font-bold text-neutral-100 tracking-tight text-lg">{title}</h3>}
                        </div>
                        {subtitle && (
                            <p className="text-muted-foreground/80 text-sm leading-relaxed font-light mb-4">
                                {subtitle}
                            </p>
                        )}
                        <div className="relative z-10 flex-1">{children}</div>
                    </div>
                </div>
            </SpotlightCard>
        </div>
    );
};
