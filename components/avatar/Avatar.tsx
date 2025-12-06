"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Avatar({ isSpeaking }: { isSpeaking: boolean }) {
	const group = useRef<THREE.Group>(null);
	const headRef = useRef<THREE.Mesh>(null);
	const bodyRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (group.current && headRef.current) {
			// Head follows mouse
			const target = new THREE.Vector3(
				state.mouse.x * 0.5,
				state.mouse.y * 0.5,
				0,
			);
			headRef.current.rotation.y = THREE.MathUtils.lerp(
				headRef.current.rotation.y,
				target.x,
				0.1,
			);
			headRef.current.rotation.x = THREE.MathUtils.lerp(
				headRef.current.rotation.x,
				-target.y,
				0.1,
			);

			if (isSpeaking && bodyRef.current) {
				// Animate when speaking
				const bounce = Math.sin(state.clock.elapsedTime * 10) * 0.05;
				headRef.current.position.y = 0.5 + bounce;
				bodyRef.current.scale.y =
					1 + Math.sin(state.clock.elapsedTime * 15) * 0.02;
			} else {
				// Idle animation
				const idle = Math.sin(state.clock.elapsedTime * 2) * 0.02;
				if (headRef.current) headRef.current.position.y = 0.5 + idle;
			}
		}
	});

	return (
		<group ref={group} position={[0, -0.5, 0]}>
			{/* Body */}
			<mesh ref={bodyRef} position={[0, -0.3, 0]} castShadow>
				<capsuleGeometry args={[0.3, 0.8, 16, 32]} />
				<meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.4} />
			</mesh>

			{/* Head */}
			<mesh ref={headRef} position={[0, 0.5, 0]} castShadow>
				<sphereGeometry args={[0.35, 32, 32]} />
				<meshStandardMaterial color="#5aa3f0" metalness={0.2} roughness={0.3} />
			</mesh>

			{/* Eyes */}
			<mesh position={[-0.12, 0.55, 0.25]} castShadow>
				<sphereGeometry args={[0.05, 16, 16]} />
				<meshStandardMaterial
					color="#1a1a1a"
					emissive="#ffffff"
					emissiveIntensity={isSpeaking ? 0.5 : 0.2}
				/>
			</mesh>
			<mesh position={[0.12, 0.55, 0.25]} castShadow>
				<sphereGeometry args={[0.05, 16, 16]} />
				<meshStandardMaterial
					color="#1a1a1a"
					emissive="#ffffff"
					emissiveIntensity={isSpeaking ? 0.5 : 0.2}
				/>
			</mesh>

			{/* Mouth indicator when speaking */}
			{isSpeaking && (
				<mesh position={[0, 0.4, 0.28]}>
					<ringGeometry args={[0.08, 0.12, 16]} />
					<meshStandardMaterial
						color="#ff6b6b"
						emissive="#ff6b6b"
						emissiveIntensity={0.8}
					/>
				</mesh>
			)}
		</group>
	);
}
