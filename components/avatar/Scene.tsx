"use client";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { Suspense, useState, useEffect } from "react";

export default function Scene({ isSpeaking }: { isSpeaking: boolean }) {
	const [hasWebGL, setHasWebGL] = useState(true);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Check WebGL support
		try {
			const canvas = document.createElement("canvas");
			const gl =
				canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			if (!gl) {
				setHasWebGL(false);
			}
		} catch (error) {
			console.error('WebGL detection error:', error);
			setHasWebGL(false);
		}
	}, []);

	if (!mounted) {
		return (
			<div className="h-[500px] w-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
				<div className="text-white">Loading 3D Scene...</div>
			</div>
		);
	}

	if (!hasWebGL) {
		return (
			<div className="h-[500px] w-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
				<div className="text-center text-white p-8">
					<div className="text-6xl mb-4">🤖</div>
					<h3 className="text-xl font-semibold mb-2">3D Avatar Unavailable</h3>
					<p className="text-gray-400">
						Your browser doesn&apos;t support WebGL. The voice features still
						work!
					</p>
				</div>
			</div>
		);
	}

	return (
		<Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
			<Suspense fallback={null}>
				<Experience isSpeaking={isSpeaking} />
			</Suspense>
		</Canvas>
	);
}