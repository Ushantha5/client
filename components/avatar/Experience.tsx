"use client";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Suspense } from "react";

export const Experience = ({ isSpeaking }: { isSpeaking: boolean }) => {
	return (
		<Suspense fallback={null}>
			{/* Camera Controls */}
			<OrbitControls
				enableZoom={false}
				minPolarAngle={Math.PI / 3}
				maxPolarAngle={Math.PI / 2}
			/>

			{/* Environment & Background */}
			{/* <Environment preset="city" /> */}
			<Stars
				radius={100}
				depth={50}
				count={5000}
				factor={4}
				saturation={0}
				fade
				speed={1}
			/>
			<color attach="background" args={["#0a0a1a"]} />

			{/* Lighting */}
			<ambientLight intensity={0.3} />
			<directionalLight
				position={[5, 5, 5]}
				intensity={1.5}
				castShadow
				shadow-mapSize={[2048, 2048]}
			/>
			<pointLight position={[-5, 3, -5]} intensity={0.5} color="#4a90e2" />
			<spotLight
				position={[0, 5, 0]}
				angle={0.3}
				penumbra={1}
				intensity={isSpeaking ? 2 : 1}
				color={isSpeaking ? "#ff6b6b" : "#ffffff"}
				castShadow
			/>

			{/* Avatar with Float effect */}
			<Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
				<Avatar isSpeaking={isSpeaking} />
			</Float>

			{/* Ground plane for shadows */}
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -1.5, 0]}
				receiveShadow
			>
				<planeGeometry args={[10, 10]} />
				<shadowMaterial opacity={0.3} />
			</mesh>
		</Suspense>
	);
};
