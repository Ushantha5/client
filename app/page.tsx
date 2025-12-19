"use client";

import { useState, useEffect } from "react";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Sparkles,
  BookOpen,
  Users,
  Zap,
  Brain,
  Calendar,
  Search
} from "lucide-react";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TeachingAIModal from "@/components/ai/TeachingAIModal";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { getTamilGreeting } from "@/lib/tamil-greetings";

// Dynamically import 3D Avatar
const WelcomeAvatar = dynamic(() => import("@/components/3d/WelcomeAvatar").then(m => ({ default: m.WelcomeAvatar })), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  // We use 'any' here to bypass the strict type mismatch if the type definitions are outdated
  // in a real scenario we should update the Greeting type definition
  const [greeting, setGreeting] = useState<any>(null);

  const voiceInteraction = useVoiceInteraction("gemini");

  useEffect(() => {
    setMounted(true);
    setGreeting(getTamilGreeting());
    const interval = setInterval(() => setGreeting(getTamilGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 pb-20">

        {/* Header / Command Bar Area */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Huly-style Search Bar */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground/50 shadow-inner">
              <Search className="w-4 h-4 mr-3" />
              <span>Search courses, students, or ask AI...</span>
              <span className="ml-auto text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted-foreground">⌘K</span>
            </div>
          </div>
        </div>

        <BentoGrid>
          {/* [Row 1] Hero Module: Avatar & Greeting */}
          <BentoItem colSpan={8} rowSpan={2} className="relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row h-full">
              <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 self-start">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-primary-foreground">System Online</span>
                </div>

                <div>
                  <h2 className="text-5xl font-bold leading-tight mb-2">
                    {greeting?.transliteration || greeting?.english || "Vanakkam"}
                  </h2>
                  <p className="text-2xl text-muted-foreground font-light mb-4 text-glow">
                    {greeting?.primary || "Welcome"}
                  </p>
                  <p className="text-foreground/80 max-w-md leading-relaxed">
                    Welcome to your AI-powered learning OS. Your personal tutor is ready to assist you with real-time feedback.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setIsAIModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-[0_0_20px_rgba(120,110,255,0.3)] border border-white/10"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Open Workspace
                  </Button>
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10" asChild>
                    <Link href="/courses">Browse Library</Link>
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative min-h-[300px] md:min-h-auto">
                <WelcomeAvatar
                  showGreetingText={false}
                  enableVoice={true}
                  className="w-full h-full absolute inset-0"
                  onAvatarClick={() => setIsAIModalOpen(true)}
                />
                {/* Status Badge floating */}
                <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${voiceInteraction.isSpeaking ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {voiceInteraction.isSpeaking ? "Voice Active" : "Standby"}
                  </span>
                </div>
              </div>
            </div>
          </BentoItem>

          {/* [Row 1] Right Column Stats */}
          <BentoItem colSpan={4} title="Study Streak" subtitle="Constructive flow state maintained." icon={<Zap className="w-5 h-5" />}>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-6xl font-bold text-foreground">12</span>
              <span className="text-xl text-muted-foreground mb-2">days</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[65%]" />
            </div>
          </BentoItem>

          <BentoItem colSpan={4} title="Knowledge Graph" subtitle="72 concepts mastered this week." icon={<Brain className="w-5 h-5" />}>
            <div className="mt-4 grid grid-cols-5 gap-1 h-16 items-end">
              {[40, 70, 45, 90, 60].map((h, i) => (
                <div key={i} className="bg-white/10 hover:bg-primary/50 transition-colors rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </BentoItem>

          {/* [Row 2] Modules */}
          <BentoItem colSpan={4} title="Recent Courses" icon={<BookOpen className="w-5 h-5" />}>
            <div className="space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer group/item">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-mono text-muted-foreground">0{i}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">Advanced React Patterns</p>
                    <p className="text-xs text-muted-foreground">Module {i} • 15m remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoItem>

          <BentoItem colSpan={4} title="Community" icon={<Users className="w-5 h-5" />}>
            <div className="space-y-4 text-sm mt-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Learners</span>
                <span className="font-mono text-foreground">1,248</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Global Rank</span>
                <span className="font-mono text-green-400">#42</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <p className="text-xs text-muted-foreground">&quot;The AI tutor helped me solve the recursion problem in minutes!&quot;</p>
                <p className="text-xs text-foreground mt-2 font-medium">- Sarah J.</p>
              </div>
            </div>
          </BentoItem>

          <BentoItem colSpan={4} title="Upcoming" icon={<Calendar className="w-5 h-5" />}>
            <div className="relative pl-4 border-l border-white/10 space-y-6 mt-2">
              {[
                { time: "10:00 AM", event: "Live Session: Next.js 14" },
                { time: "02:00 PM", event: "Code Review with AI" },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface border border-primary/50 ring-4 ring-background" />
                  <p className="text-xs text-primary font-mono">{item.time}</p>
                  <p className="text-sm text-foreground">{item.event}</p>
                </div>
              ))}
            </div>
          </BentoItem>

        </BentoGrid>
      </main>

      {/* AI Modal Integration */}
      <TeachingAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        voiceInteraction={voiceInteraction}
      />
    </div>
  );
}