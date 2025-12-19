"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sky, Stars, Cloud, Clouds } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherEnvironmentProps {
    theme: string;
    isNight: boolean;
}

const Rain = () => {
    const count = 1000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = Math.random() * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    const ref = useRef<THREE.Points>(null);

    useFrame((_state, _delta) => {
        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= 0.2; // Rain speed
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = 15;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#88ccff"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    );
};

export const WeatherEnvironment: React.FC<WeatherEnvironmentProps> = ({ theme, isNight }) => {
    return (
        <>
            {/* Lighting adaptation */}
            <ambientLight intensity={isNight ? 0.2 : 0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={isNight ? 0.1 : 1}
                color={theme === 'sunny' ? '#fff5e6' : '#ffffff'}
            />

            {/* Atmosphere */}
            {isNight ? (
                <>
                    <color attach="background" args={['#050510']} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                </>
            ) : (
                <Sky
                    sunPosition={[100, theme === 'sunny' ? 10 : 2, 100]}
                    turbidity={theme === 'cloudy' ? 10 : 0.1}
                    rayleigh={theme === 'rainy' ? 0.5 : 2}
                />
            )}

            {/* Weather effects */}
            {(theme === 'cloudy' || theme === 'rainy') && (
                <Clouds material={THREE.MeshLambertMaterial}>
                    <Cloud seed={10} bounds={[10, 2, 10]} volume={5} color={isNight ? "#222" : "#ccc"} />
                    <Cloud seed={20} bounds={[10, 2, 10]} volume={5} color={isNight ? "#111" : "#888"} />
                </Clouds>
            )}

            {theme === 'rainy' && <Rain />}

            {/* Ground / Grid for context */}
            <gridHelper args={[20, 20, 0x444444, 0x222222]} position={[0, -2, 0]} />
        </>
    );
};
