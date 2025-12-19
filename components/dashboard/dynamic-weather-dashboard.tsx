"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { WeatherEnvironment } from '@/components/3d/WeatherEnvironment';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Thermometer,
    Wind,
    Droplets,
    Sun,
    CloudRain,
    Cloud,
    Moon,
    MapPin,
    RefreshCw
} from 'lucide-react';

export const DynamicWeatherDashboard = () => {
    const { context, loading, refreshContext } = useDashboardContext();

    if (loading && !context) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Detecting environment and weather...</p>
            </div>
        );
    }

    const { weather, uiPreferences, hometown } = context || {
        weather: { condition: 'Clear', temperature: 20, humidity: 50, windSpeed: 5 },
        uiPreferences: { theme: 'sunny', currentColors: ['#FFD700', '#FF8C00'], dayNightMode: 'day' },
        hometown: { city: 'Unknown', country: '' }
    };

    const isNight = uiPreferences.dayNightMode === 'night';
    const primaryColor = uiPreferences.currentColors[0];

    const WeatherIcon = () => {
        if (isNight) return <Moon className="w-8 h-8 text-indigo-300" />;
        switch (uiPreferences.theme) {
            case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
            case 'cloudy': return <Cloud className="w-8 h-8 text-slate-400" />;
            default: return <Sun className="w-8 h-8 text-yellow-400" />;
        }
    };

    return (
        <div className="relative w-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-1000 border border-white/10"
            style={{ background: `linear-gradient(135deg, ${uiPreferences.currentColors[0]}22, ${uiPreferences.currentColors[1]}22)` }}>

            {/* 3D Background */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
                    <Suspense fallback={null}>
                        <WeatherEnvironment
                            theme={uiPreferences.theme}
                            isNight={isNight}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-8 flex flex-col h-full justify-between pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={uiPreferences.theme}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="pointer-events-auto"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-70">
                                    <MapPin className="w-4 h-4" />
                                    {hometown.city}, {hometown.country}
                                </div>
                                <h1 className="text-5xl font-black md:text-6xl flex items-center gap-4">
                                    {Math.round(weather.temperature)}°C
                                    <WeatherIcon />
                                </h1>
                                <p className="text-xl font-medium opacity-80">
                                    {isNight ? 'Late Night Learning' : 'Good Day for Study'} in {hometown.city}
                                </p>
                            </div>

                            <button
                                onClick={refreshContext}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 border border-white/20 shadow-xl"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            {[
                                { icon: Thermometer, label: 'Condition', val: weather.condition },
                                { icon: Droplets, label: 'Humidity', val: `${weather.humidity}%` },
                                { icon: Wind, label: 'Wind', val: `${weather.windSpeed}m/s` },
                                { icon: Sun, label: 'Mode', val: isNight ? 'Twilight' : 'Active' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center gap-1 shadow-inner"
                                >
                                    <item.icon className="w-5 h-5 opacity-60" />
                                    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{item.label}</span>
                                    <span className="font-bold">{item.val}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Cultural / Motivational Message */}
                <div className="mt-auto pt-10">
                    <div className="p-6 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/5 pointer-events-auto max-w-lg">
                        <p className="italic text-lg opacity-90 leading-relaxed">
                            &quot;{weather.condition.toLowerCase().includes('rain')
                                ? "The sound of rain is a perfect companion for deep focus. Let's conquer today's lessons."
                                : "A bright day outside brings bright ideas inside. Keep moving forward!"}&quot;
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-8 h-1 rounded-full bg-primary" style={{ backgroundColor: primaryColor }} />
                            <span className="text-xs uppercase font-bold tracking-widest opacity-60">Daily Wisdom for {hometown.city}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
