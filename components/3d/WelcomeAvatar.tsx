"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  getTamilGreeting,
  type TamilGreeting,
  type AvatarGestureState
} from "@/lib/tamil-greetings";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { Volume2, VolumeX, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationData } from "@/services/location.service";





interface WelcomeAvatarProps {
  /** Override the Spline scene URL */
  sceneUrl?: string;
  /** Show greeting text overlay */
  showGreetingText?: boolean;
  /** Enable voice greeting */
  enableVoice?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when avatar is clicked */
  onAvatarClick?: () => void;
  /** Compact mode for smaller displays */
  compact?: boolean;
  /** User location data for personalized greetings */
  location?: LocationData;
}

/**
 * WelcomeAvatar - Tamil greeting 3D avatar
 * 
 * Features:
 * - Time-based Tamil greetings (Kalai/Madiya/Maalai Vanakkam)
 * - Hand-clasping gesture animation
 * - Voice greeting with TTS (conditionally enabled)
 * - Personalized greeting with user name
 */
export function WelcomeAvatar({
  showGreetingText = true,
  enableVoice = false, // Default to false to respect the requirement
  className = "",
  onAvatarClick,
  compact = false,
  location,
}: WelcomeAvatarProps) {
  const { user } = useEnhancedUser();
  const [greeting, setGreeting] = useState<TamilGreeting | null>(null);
  const [gestureState, setGestureState] = useState<AvatarGestureState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get current greeting on mount
  useEffect(() => {
    const currentGreeting = getTamilGreeting(new Date(), location || false);
    setGreeting(currentGreeting);

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getTamilGreeting(new Date(), location || false));
    }, 60000);

    return () => clearInterval(interval);
  }, [location]);

  // Speak greeting using Web Speech API
  const speakGreeting = useCallback(() => {
    // Only speak if voice is enabled
    if (!enableVoice || isMuted || typeof window === "undefined") return;

    // Cancel any ongoing speech
    window.speechSynthesis?.cancel();

    const greetingText = `${greeting?.transliteration || "Vanakkam"}! Welcome to MR5 School. I am your AI learning assistant.`;
    const utterance = new SpeechSynthesisUtterance(greetingText);

    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher for female voice
    utterance.volume = 0.8;

    // Try to find a female voice
    const voices = window.speechSynthesis?.getVoices() || [];
    const femaleVoice = voices.find(
      (v) => v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("victoria")
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Animation sync
    utterance.onstart = () => setGestureState("speaking");
    utterance.onend = () => setGestureState("idle");
    utterance.onerror = () => setGestureState("idle");

    speechSynthRef.current = utterance;
    window.speechSynthesis?.speak(utterance);
  }, [isMuted, enableVoice, greeting]);

  // Trigger greeting animation on first view
  useEffect(() => {
    if (!hasGreeted && greeting && enableVoice) {
      // Start greeting gesture sequence
      setGestureState("greeting_start");

      const sequence = [
        { state: "greeting_hold" as const, delay: 500 },
        { state: "speaking" as const, delay: 1500 },
      ];

      sequence.forEach(({ state, delay }) => {
        setTimeout(() => setGestureState(state), delay);
      });

      // Speak after animation starts
      setTimeout(() => {
        speakGreeting();
        setHasGreeted(true);
      }, 1000);
    }
  }, [hasGreeted, greeting, speakGreeting, enableVoice]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);



  const toggleMute = () => {
    if (!enableVoice) return; // Don't toggle mute if voice is disabled

    if (!isMuted) {
      window.speechSynthesis?.cancel();
    }
    setIsMuted(!isMuted);
  };

  const handleReplayGreeting = () => {
    if (!enableVoice) return; // Don't replay if voice is disabled

    setGestureState("greeting_start");
    setTimeout(() => setGestureState("greeting_hold"), 500);
    setTimeout(() => {
      setGestureState("speaking");
      speakGreeting();
    }, 1000);
  };

  if (!greeting) return null;

  return (
    <div
      className={`relative group ${compact ? "h-[300px]" : "h-[500px]"} ${className}`}
      onClick={onAvatarClick}
    >
      {/* 3D Avatar Scene */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-b from-card/50 to-background/50 border border-primary/10 backdrop-blur-xl shadow-2xl">
        {/* 
            Safe fallback for 3D Scene to prevent crashes due to 403 Forbidden errors 
            when the external Spline URL is inaccessible.
            TODO: Restore this when valid .splinecode file is hosted locally.
          */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
          <div className="text-center p-8">
            <div className="relative w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <Image
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
              alt="AI Assistant"
              width={128}
              height={128}
              className="relative w-32 h-32 mx-auto rounded-full object-cover border-4 border-white/10 shadow-xl"
            />
          </div>
        </div>

        {/*
        <SplineScene
          scene={actualSceneUrl}
          className="w-full h-full"
          onError={handleError}
        /> 
        */}

        {/* Glassmorphism overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Greeting Text Overlay */}
      <AnimatePresence>
        {showGreetingText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <div className="bg-background/60 backdrop-blur-md border border-primary/10 rounded-2xl p-4 space-y-2">
              {/* Primary language text (Tamil script, Sinhala script, etc.) */}
              <p className="text-2xl font-bold text-primary">
                {greeting.primary}
              </p>

              {/* Transliteration */}
              <p className="text-lg text-foreground">
                {greeting.transliteration}
                {user?.name && <span className="text-muted-foreground">, {user.name}</span>}!
              </p>

              {/* English translation */}
              <p className="text-sm text-muted-foreground">
                {greeting.english}
              </p>

              {/* Time indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>AI Avatar Online</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons - only show if voice is enabled */}
      {enableVoice && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleReplayGreeting();
            }}
            className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Gesture state indicator (for debugging - can be removed in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {gestureState}
        </div>
      )}
    </div>
  );
}

export default WelcomeAvatar;