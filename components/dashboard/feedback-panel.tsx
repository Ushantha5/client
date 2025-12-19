"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackPanelProps {
    suggestion: string;
}

export function FeedbackPanel({ suggestion }: FeedbackPanelProps) {
    return (
        <Card className="relative overflow-hidden border-border/50 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
            <CardContent className="relative p-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                            AI Learning Coach
                        </h4>
                        <p className="text-foreground font-medium text-lg leading-snug">
                            {suggestion}
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="gap-2"
                >
                    Start Now
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}