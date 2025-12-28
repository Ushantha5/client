"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html as ThreeHtml, useProgress, PerspectiveCamera } from "@react-three/drei";

function Loader() {
    const { progress } = useProgress();
    return (
        <ThreeHtml center>
            <div className="flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-xl border border-blue-500/30 w-64">
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-blue-200 font-mono text-xs animate-pulse">
                    Loading School Environment: {progress.toFixed(0)}%
                </p>
            </div>
        </ThreeHtml>
    );
}

function FBXModel({ url }: { url: string }) {
    const [fbx, setFbx] = useState<any>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const { FBXLoader } = await import("three-stdlib");
                const loader = new FBXLoader();
                loader.load(
                    url,
                    (loadedFbx: any) => setFbx(loadedFbx),
                    undefined,
                    (error) => console.error("Error loading FBX:", error)
                );
            } catch (err) {
                console.error("Failed to initialize FBX loader:", err);
            }
        };
        loadModel();
    }, [url]);

    if (!fbx) return null;

    return <primitive object={fbx} scale={0.01} position={[0, -5, 0]} />;
}

export function SchoolScene() {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsNight(hour < 6 || hour > 18);

        if (typeof Audio !== "undefined") {
            const a = new Audio('/assets/school_ambience.mp3');
            a.loop = true;
            a.volume = 0.3;
            setAudio(a);
        }
    }, []);

    useEffect(() => {
        if (audio) {
            // User interaction usually required to play audio
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play failed (user interaction needed):", error);
                });
            }
        }
    }, [audio]);

    return (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[50, 50, 50]} />
                <Suspense fallback={<Loader />}>
                    <Environment preset={isNight ? "night" : "city"} />
                    <ambientLight intensity={isNight ? 0.2 : 0.6} />
                    <directionalLight
                        position={isNight ? [5, 5, 5] : [10, 10, 5]}
                        intensity={isNight ? 0.5 : 1.5}
                        color={isNight ? "#ccdaff" : "#ffffff"}
                        castShadow
                    />

                    <FBXModel url="/assets/3d/school.fbx" />

                    <OrbitControls
                        enablePan={true}
                        minDistance={10}
                        maxDistance={200}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Suspense>
            </Canvas>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 border border-white/20">
                <span className={isNight ? "text-blue-300" : "text-yellow-300"}>●</span>
                {isNight ? "Night Mode" : "Day Mode"}
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-white text-xs">
                Controls: Left Click Rotate • Right Click Pan • Scroll Zoom
            </div>
        </div>
    );
}