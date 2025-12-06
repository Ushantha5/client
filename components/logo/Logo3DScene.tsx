"use client";
import { Canvas } from "@react-three/fiber";
import { Logo3D } from "./Logo3D";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

interface Logo3DSceneProps {
	size?: "small" | "medium" | "large";
	autoRotate?: boolean;
}

export default function Logo3DScene({
	size = "medium",
	autoRotate = true,
}: Logo3DSceneProps) {
	const sizeMap = {
		small: "h-[150px]",
		medium: "h-[300px]",
		large: "h-[500px]",
	};

	return (
		<div className={`w-full ${sizeMap[size]} relative`}>
			<Suspense
				fallback={
					<div className="w-full h-full flex items-center justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
					</div>
				}
			>
				<Canvas
					camera={{ position: [0, 0, 5], fov: 50 }}
					gl={{
						alpha: true,
						antialias: true,
						powerPreference: "high-performance",
					}}
				>
					<Environment preset="sunset" />

					{/* Lighting */}
					<ambientLight intensity={0.5} />
					<directionalLight position={[10, 10, 5]} intensity={1} castShadow />
					<pointLight
						position={[-10, -10, -5]}
						intensity={0.5}
						color="#D4AF37"
					/>
					<spotLight
						position={[0, 10, 0]}
						angle={0.3}
						penumbra={1}
						intensity={1}
						castShadow
					/>

					{/* Logo */}
					<Logo3D />

					{/* Controls */}
					{autoRotate && (
						<OrbitControls
							enableZoom={false}
							autoRotate
							autoRotateSpeed={2}
							enablePan={false}
						/>
					)}
				</Canvas>
			</Suspense>
		</div>
	);
}
