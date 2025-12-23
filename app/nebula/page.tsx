"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hand,
    MousePointer2,
    Settings,
    HelpCircle,
    Volume2,
    VolumeX,
    Camera,
    Maximize2,
    Heart,
    Circle,
    Zap,
    Star,

    X,
    Play
} from 'lucide-react';
import Script from 'next/script';

// Types for MediaPipe
declare global {
    interface Window {
        Hands: any;
        Camera: any;
        drawConnectors: any;
        drawLandmarks: any;
        HAND_CONNECTIONS: any;
    }
}

const PARTICLE_COUNT = 15000;
const SHAPES = ['Sphere', 'Heart', 'Flower', 'Saturn', 'Fireworks'] as const;
type ShapeType = typeof SHAPES[number];

export default function NebulaHandControl() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Three.js refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const pointsRef = useRef<THREE.Points | null>(null);
    const positionsRef = useRef<Float32Array | null>(null);
    const targetPositionsRef = useRef<Float32Array | null>(null);
    const colorsRef = useRef<Float32Array | null>(null);

    // State
    const [activeShape, setActiveShape] = useState<ShapeType>('Sphere');
    const [isStarted, setIsStarted] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [showHelp, setShowHelp] = useState(false);
    const [interactionPoint, setInteractionPoint] = useState({ x: 0, y: 0, z: 0 });
    const [isPinching, setIsPinching] = useState(false);

    // Audio refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const toneRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    // Use refs for animation loop to avoid dependency-related re-initializations
    const interactionPointRef = useRef({ x: 0, y: 0, z: 0 });
    const isPinchingRef = useRef(false);

    useEffect(() => {
        interactionPointRef.current = interactionPoint;
    }, [interactionPoint]);

    useEffect(() => {
        isPinchingRef.current = isPinching;
    }, [isPinching]);

    // Initialize Three.js
    useEffect(() => {
        if (!canvasRef.current || !isStarted) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        positionsRef.current = positions;
        targetPositionsRef.current = targetPositions;
        colorsRef.current = colors;

        // Initial positions (Sphere)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
            const r = 10;

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = r * Math.cos(phi);

            targetPositions[i * 3] = positions[i * 3];
            targetPositions[i * 3 + 1] = positions[i * 3 + 1];
            targetPositions[i * 3 + 2] = positions[i * 3 + 2];

            const color = new THREE.Color();
            color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        pointsRef.current = points;

        // Animation Loop
        let frame = 0;
        const animate = () => {
            frame = requestAnimationFrame(animate);

            const pos = positionsRef.current;
            const target = targetPositionsRef.current;
            if (!pos || !target) return;

            const currentPoint = interactionPointRef.current;
            const currentPinch = isPinchingRef.current;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                // Interpolate to target
                pos[i * 3] += (target[i * 3] - pos[i * 3]) * 0.05;
                pos[i * 3 + 1] += (target[i * 3 + 1] - pos[i * 3 + 1]) * 0.05;
                pos[i * 3 + 2] += (target[i * 3 + 2] - pos[i * 3 + 2]) * 0.05;

                // Interactive forces
                const dx = currentPoint.x - pos[i * 3];
                const dy = currentPoint.y - pos[i * 3 + 1];
                const dz = currentPoint.z - pos[i * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 10) {
                    const force = currentPinch ? 0.5 : -0.1;
                    pos[i * 3] += (dx / dist) * force;
                    pos[i * 3 + 1] += (dy / dist) * force;
                    pos[i * 3 + 2] += (dz / dist) * force;
                }

                // Color shift over time
                const colorAttr = points.geometry.attributes.color.array as Float32Array;
                const color = new THREE.Color();
                const hue = (0.5 + Math.sin(Date.now() * 0.001 + i * 0.0001) * 0.2) % 1;
                color.setHSL(hue, 0.8, 0.6);
                colorAttr[i * 3] = color.r;
                colorAttr[i * 3 + 1] = color.g;
                colorAttr[i * 3 + 2] = color.b;
            }

            points.geometry.attributes.position.needsUpdate = true;
            points.geometry.attributes.color.needsUpdate = true;
            points.rotation.y += 0.002;
            points.rotation.x += 0.001;

            renderer.render(scene, camera);

            // Update Audio based on interaction
            if (audioCtxRef.current && gainRef.current && filterRef.current) {
                const intensity = currentPinch ? 1.0 : 0.2;
                gainRef.current.gain.setTargetAtTime(intensity * 0.1, audioCtxRef.current.currentTime, 0.1);
                filterRef.current.frequency.setTargetAtTime(currentPinch ? 2000 : 400, audioCtxRef.current.currentTime, 0.1);
            }
        };

        animate();

        const handleResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            material.dispose();
            geometry.dispose();
        };
    }, [isStarted]);

    // Morph Logic
    const morphTo = useCallback((shape: ShapeType) => {
        const target = targetPositionsRef.current;
        if (!target) return;

        setActiveShape(shape);
        playWhoosh();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            let x = 0, y = 0, z = 0;

            if (shape === 'Sphere') {
                const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
                const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
                const r = 10;
                x = r * Math.cos(theta) * Math.sin(phi);
                y = r * Math.sin(theta) * Math.sin(phi);
                z = r * Math.cos(phi);
            } else if (shape === 'Heart') {
                const t = (i / PARTICLE_COUNT) * Math.PI * 2;
                x = 0.5 * (16 * Math.pow(Math.sin(t), 3));
                y = 0.5 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                z = (Math.random() - 0.5) * 2;
            } else if (shape === 'Flower') {
                const t = (i / PARTICLE_COUNT) * Math.PI * 20;
                const r = 10 * Math.cos(2.5 * (t / 10));
                x = r * Math.cos(t);
                y = r * Math.sin(t);
                z = (Math.random() - 0.5) * 5;
            } else if (shape === 'Saturn') {
                if (i < PARTICLE_COUNT * 0.6) {
                    // Central Sphere
                    const phi = Math.acos(-1 + (2 * i) / (PARTICLE_COUNT * 0.6));
                    const theta = Math.sqrt(PARTICLE_COUNT * 0.6 * Math.PI) * phi;
                    const r = 6;
                    x = r * Math.cos(theta) * Math.sin(phi);
                    y = r * Math.sin(theta) * Math.sin(phi);
                    z = r * Math.cos(phi);
                } else {
                    // Ring
                    const theta = Math.random() * Math.PI * 2;
                    const r = 9 + Math.random() * 4;
                    x = r * Math.cos(theta);
                    y = r * Math.sin(theta) * 0.5; // Tilted
                    z = r * Math.sin(theta) * 0.2;
                }
            } else if (shape === 'Fireworks') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const r = 5 + Math.random() * 15;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            }

            target[i * 3] = x;
            target[i * 3 + 1] = y;
            target[i * 3 + 2] = z;
        }
    }, []);

    // Audio Logic
    const initAudio = useCallback(() => {
        if (audioCtxRef.current) return;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        toneRef.current = osc;
        gainRef.current = gain;
        filterRef.current = filter;
    }, []);

    const playWhoosh = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // Whoosh sound using white noise
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.5);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
    };

    // Hand Tracking Logic
    const onResults = useCallback((results: any) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            
            setIsPinching(false);
            return;
        }

        const hand = results.multiHandLandmarks[0];

        // Tracking Point: Index Finger Tip (Landmark 8)
        const indexTip = hand[8];
        const thumbTip = hand[4];

        // Map normalized coordinates [0, 1] to Three.js space
        const x = (indexTip.x - 0.5) * 60;
        const y = -(indexTip.y - 0.5) * 40;
        const z = (indexTip.z - 0.5) * 20;

        setInteractionPoint({ x, y, z });

        // Pinch detection
        const dist = Math.sqrt(
            Math.pow(indexTip.x - thumbTip.x, 2) +
            Math.pow(indexTip.y - thumbTip.y, 2)
        );
        setIsPinching(dist < 0.05);

        // Gesture detection
        // Simple count of raised fingers
        const raisedFingers = [8, 12, 16, 20].filter(tipIdx => {
            const baseIdx = tipIdx - 2;
            return hand[tipIdx].y < hand[baseIdx].y;
        }).length + 1; // Thumb is hard to detect simply, assume always 1 hand base

        // Map fingers to shapes
        if (raisedFingers === 2) morphTo('Flower');
        else if (raisedFingers === 3) morphTo('Saturn');
        else if (raisedFingers === 4) morphTo('Heart');
        else if (raisedFingers === 5) morphTo('Fireworks');
        else morphTo('Sphere');


    }, [morphTo]);

    const initHandTracking = useCallback(() => {
        if (typeof window === 'undefined' || !window.Hands) return;

        const hands = new window.Hands({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        if (videoRef.current) {
            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {
                    await hands.send({ image: videoRef.current! });
                },
                width: 1280,
                height: 720
            });
            camera.start();
            setIsCameraActive(true);
        }
    }, [onResults]);

    const handleStart = () => {
        setIsStarted(true);
        initAudio();
        // Hand tracking will init after scripts load
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isCameraActive) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 60;
        const y = -(e.clientY / window.innerHeight - 0.5) * 40;
        setInteractionPoint({ x, y, z: 0 });
    };

    const handleMouseDown = () => setIsPinching(true);
    const handleMouseUp = () => setIsPinching(false);

    return (
        <div
            className="relative w-full h-screen bg-black overflow-hidden font-sans text-white select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
                strategy="lazyOnload"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
                strategy="lazyOnload"
                onLoad={() => {
                    if (isStarted) initHandTracking();
                }}
            />

            {/* 3D Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-none z-0"
            />

            {/* Camera Feed HUD */}
            <div className={`absolute bottom-6 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/10 bg-black/40 backdrop-blur-md transition-opacity duration-500 z-20 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}>
                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover transform -scale-x-100 transition-all duration-300 ${interactionPoint.x ? 'blur-sm grayscale' : ''}`}
                    autoPlay
                    playsInline
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold tracking-tighter uppercase opacity-80">
                    Realtime Tracking
                </div>
            </div>

            {/* HUD - Gesture Status */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3"
                >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isCameraActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-xs font-black tracking-widest uppercase opacity-80">
                        {isCameraActive ? `DETECTED: ${activeShape}` : 'MOUSE MODE ACTIVE'}
                    </span>
                </motion.div>

                <AnimatePresence>
                    {isPinching && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2"
                        >
                            <Zap className="w-4 h-4 fill-primary" />
                            Pinch Force Active
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Manual Control Footer */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {SHAPES.map((shape) => (
                    <button
                        key={shape}
                        onClick={() => morphTo(shape)}
                        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 group ${activeShape === shape ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/10'}`}
                    >
                        {shape === 'Sphere' && <Circle className="w-5 h-5" />}
                        {shape === 'Heart' && <Heart className="w-5 h-5" />}
                        {shape === 'Flower' && <Star className="w-5 h-5" />}
                        {shape === 'Saturn' && <Maximize2 className="w-5 h-5" />}
                        {shape === 'Fireworks' && <Zap className="w-5 h-5" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{shape}</span>
                    </button>
                ))}
            </div>

            {/* Left Menu / Info */}
            <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all active:scale-95 group"
                >
                    <HelpCircle className="w-6 h-6 opacity-60 group-hover:opacity-100" />
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all active:scale-95 group"
                >
                    {isMuted ? <VolumeX className="w-6 h-6 opacity-60 group-hover:opacity-100" /> : <Volume2 className="w-6 h-6 opacity-60 group-hover:opacity-100" />}
                </button>
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    >
                        <div className="max-w-xl w-full bg-slate-900/90 rounded-[40px] p-10 border border-white/10 shadow-2xl relative">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl font-black mb-2 tracking-tighter">NEBULA CONTROL</h2>
                            <p className="text-slate-400 mb-8 text-sm">Master the particle nebula with your hands or mouse.</p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase text-primary tracking-widest">Hand Gestures</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-[10px] font-bold">2</span>
                                            <span className="opacity-70 italic">Fingers Up:</span> Flower
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-[10px] font-bold">3</span>
                                            <span className="opacity-70 italic">Fingers Up:</span> Saturn
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-[10px] font-bold">4</span>
                                            <span className="opacity-70 italic">Fingers Up:</span> Heart
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-[10px] font-bold">5</span>
                                            <span className="opacity-70 italic">Open Hand:</span> Fireworks
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-6 h-6 flex items-center justify-center"><Hand className="w-4 h-4" /></div>
                                            <span className="opacity-70 italic">Pinch:</span> Attract Particles
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase text-purple-400 tracking-widest">Mouse Mode</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-6 h-6 flex items-center justify-center"><MousePointer2 className="w-4 h-4" /></div>
                                            <span className="opacity-70 italic">Hover:</span> Orbit Around Hub
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-6 h-6 flex items-center justify-center"><MousePointer2 className="w-4 h-4" /></div>
                                            <span className="opacity-70 italic">Click & Hold:</span> Gravity Pull
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-6 h-6 flex items-center justify-center"><Settings className="w-4 h-4" /></div>
                                            <span className="opacity-70 italic">Footer:</span> Manual Morph
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 font-bold hover:scale-[1.02] transition-transform active:scale-100"
                            >
                                I&apos;m Ready to Flow
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start Screen Layer */}
            <AnimatePresence>
                {!isStarted && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-black"
                    >
                        <div className="relative text-center max-w-2xl px-6">
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic">NEBULA</h1>
                                <p className="text-lg md:text-xl text-slate-400 mb-12 font-medium">An Interactive 3D Experience controlled by your hands.</p>

                                <button
                                    onClick={handleStart}
                                    className="group relative px-12 py-5 rounded-full bg-white text-black font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-6 flex items-center gap-3 mx-auto"
                                >
                                    <Play className="w-6 h-6 fill-black" />
                                    ENTER EXPERIENCE
                                </button>

                                <div className="flex flex-col items-center gap-6 opacity-40">
                                    <span className="h-px w-24 bg-white/20" />
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-center gap-1">
                                            <Camera className="w-5 h-5" />
                                            <span className="text-[8px] font-bold uppercase tracking-[2px]">Camera</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Hand className="w-5 h-5" />
                                            <span className="text-[8px] font-bold uppercase tracking-[2px]">Vision</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Volume2 className="w-5 h-5" />
                                            <span className="text-[8px] font-bold uppercase tracking-[2px]">Audio</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        body { margin: 0; background: black; }
        .canvas-container { width: 100vw; height: 100vh; }
      `}</style>
        </div>
    );
}
