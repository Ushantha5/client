"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroVideoProps {
    onComplete: () => void;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play().then(() => {
                setShowStartButton(false);
                setIsMuted(false);
            }).catch((err) => {
                console.error("Video play failed", err);
                // Fallback if play with sound fails
                videoRef.current!.muted = true;
                videoRef.current!.play();
                setShowStartButton(false);
                setIsMuted(true);
            });
        }
    };

    const handleSkip = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        completeIntro();
    };

    const handleVideoEnded = () => {
        completeIntro();
    };

    const completeIntro = () => {
        // Add a small delay for exit animation if needed
        localStorage.setItem("hasSeenIntro_v1", "true");
        onComplete();
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/assets/videos/intro-reveal.mp4"
                playsInline
                onEnded={handleVideoEnded}
            />

            <AnimatePresence>
                {showStartButton && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
                    >
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Welcome to MR5
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-md mx-auto">
                                Experience the next generation of learning.
                            </p>
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group overflow-hidden bg-white text-black text-lg px-10 py-6 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <div className="relative flex items-center gap-3">
                                    <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent group-hover:from-black group-hover:to-black transition-all">
                                        Enter Experience
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showStartButton && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 right-8 flex gap-4 z-20"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="bg-black/20 hover:bg-black/40 text-white border border-white/10 rounded-full backdrop-blur-md"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="bg-black/20 hover:bg-black/40 text-white border border-white/10 rounded-full backdrop-blur-md px-6"
                    >
                        Skip
                        <SkipForward className="ml-2 w-4 h-4" />
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
