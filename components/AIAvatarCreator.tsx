"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Upload, Image as ImageIcon, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/services/cloudinary.service';
import Image from 'next/image';

const AIAvatarCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [mode, setMode] = useState<'generate' | 'upload'>('generate');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt first");
            return;
        }

        setLoading(true);
        // Simulate AI Image Generation delay
        setTimeout(() => {
            // Mocking a futuristic avatar image
            // In a real app, this would call a backend endpoint that uses DALL-E, Midjourney or stable diffusion
            setGeneratedImage('https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop');
            setLoading(false);
            toast.success("AI Avatar generated successfully!");
        }, 3000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const result = await uploadToCloudinary(file, { folder: 'student_avatars' });
            if (result) {
                setUploadedImage(result.secure_url);
                toast.success("Photo uploaded to cloud!");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                    AI Avatar Studio
                </h2>
                <p className="text-muted-foreground text-lg">
                    Create your digital twin using advanced generative AI or upload your own photo.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Controls */}
                <div className="space-y-6">
                    <Card className="bg-surface border-white/10 overflow-hidden">
                        <div className="flex border-b border-white/5">
                            <button
                                onClick={() => setMode('generate')}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${mode === 'generate' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-white/5'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Generate via AI
                                </div>
                            </button>
                            <button
                                onClick={() => setMode('upload')}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${mode === 'upload' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-white/5'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload Photo
                                </div>
                            </button>
                        </div>

                        <CardContent className="p-6">
                            <AnimatePresence mode="wait">
                                {mode === 'generate' ? (
                                    <motion.div
                                        key="generate-mode"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Prompt Your Avatar</label>
                                            <Input
                                                placeholder="Describe your futuristic avatar... e.g. 'Cyberpunk student with neon accents, cinematic lighting'"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                className="bg-black/20 border-white/10 h-14"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={loading}
                                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                <div className="flex items-center gap-2">
                                                    <Wand2 className="w-5 h-5" />
                                                    Generate Avatar
                                                </div>
                                            )}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload-mode"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-black/10 hover:bg-black/20 transition-colors group cursor-pointer relative">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileUpload}
                                                accept="image/*"
                                            />
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <h4 className="font-bold text-lg">Click or Drop Image</h4>
                                            <p className="text-sm text-muted-foreground">PNG, JPG or WebP (Max 5MB)</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 p-6">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <h4 className="font-bold text-primary">Class Activity</h4>
                                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                                    Your personal avatar is used in the **Classroom VR Room**. Ensure it reflects your professional identity in the Real AI Avatar School.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Preview */}
                <div className="flex items-center justify-center">
                    <div className="relative w-full aspect-square max-w-[450px]">
                        {/* Futuristic Frame Decorations */}
                        <div className="absolute -inset-4 border border-primary/20 rounded-3xl pointer-events-none" />
                        <div className="absolute -inset-1 border border-primary/30 rounded-[2.5rem] pointer-events-none animate-pulse" />

                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-surface border border-white/10 shadow-2xl flex items-center justify-center">
                            {loading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    <p className="text-sm font-mono text-primary animate-pulse">PROCESSING DATA...</p>
                                </div>
                            ) : (generatedImage || uploadedImage) ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={generatedImage || uploadedImage || ""}
                                        alt="Avatar Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* HUD Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Subject ID</p>
                                            <p className="font-mono text-xs text-white">#USER-{Math.floor(Math.random() * 9000) + 1000}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Status</p>
                                            <p className="font-mono text-xs text-green-400">SYNCED_OK</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center p-8">
                                    <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-medium">No Avatar Data</p>
                                    <p className="text-xs text-muted-foreground/60 mt-2">Generate or upload to see preview</p>
                                </div>
                            )}
                        </div>

                        {/* Interactive HUD corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl shadow-[0_0_10px_rgba(120,110,255,0.5)]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl shadow-[0_0_10px_rgba(120,110,255,0.5)]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl shadow-[0_0_10px_rgba(120,110,255,0.5)]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl shadow-[0_0_10px_rgba(120,110,255,0.5)]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAvatarCreator;
