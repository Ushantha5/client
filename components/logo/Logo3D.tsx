"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Logo3D() {
	const groupRef = useRef<THREE.Group>(null);
	const particlesRef = useRef<THREE.Points>(null);

	// Create particles around logo
	const particleCount = 100;
	const positions = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i++) {
		const angle = (i / particleCount) * Math.PI * 2;
		const radius = 2 + Math.random() * 0.5;
		positions[i * 3] = Math.cos(angle) * radius;
		positions[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
	}

	useFrame((state) => {
		if (groupRef.current) {
			// Smooth rotation
			groupRef.current.rotation.y =
				Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
			groupRef.current.rotation.x =
				Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

			// Floating animation
			groupRef.current.position.y =
				Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
		}

		if (particlesRef.current) {
			// Rotate particles
			particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
		}
	});

	return (
		<group ref={groupRef}>
			{/* Shield Base */}
			<mesh position={[0, 0, 0]} castShadow>
				<boxGeometry args={[2, 2.5, 0.2]} />
				<meshStandardMaterial
					color="#D4AF37"
					metalness={0.8}
					roughness={0.2}
					emissive="#D4AF37"
					emissiveIntensity={0.2}
				/>
			</mesh>

			{/* Inner Shield */}
			<mesh position={[0, 0, 0.11]} castShadow>
				<boxGeometry args={[1.8, 2.3, 0.1]} />
				<meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.5} />
			</mesh>

			{/* MR5 Text (3D Extrusion) */}
			<mesh position={[0, -0.3, 0.2]} castShadow>
				<boxGeometry args={[1.2, 0.4, 0.1]} />
				<meshStandardMaterial
					color="#1E3A8A"
					metalness={0.5}
					roughness={0.3}
					emissive="#1E3A8A"
					emissiveIntensity={0.3}
				/>
			</mesh>

			{/* Plant Symbol (Simplified) */}
			<group position={[0, 0.3, 0.2]}>
				{/* Pot */}
				<mesh position={[0, -0.2, 0]} castShadow>
					<cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
					<meshStandardMaterial
						color="#8B4513"
						metalness={0.2}
						roughness={0.8}
					/>
				</mesh>

				{/* Plant */}
				<mesh position={[0, 0, 0]} castShadow>
					<sphereGeometry args={[0.15, 8, 8]} />
					<meshStandardMaterial
						color="#22C55E"
						metalness={0.3}
						roughness={0.5}
						emissive="#22C55E"
						emissiveIntensity={0.2}
					/>
				</mesh>
			</group>

			{/* Laurel Wreaths (Simplified) */}
			<group position={[-0.9, 0, 0.15]}>
				{[...Array(5)].map((_, i) => (
					<mesh
						key={`left-${i}`}
						position={[0, i * 0.4 - 1, 0]}
						rotation={[0, 0, Math.PI / 6]}
						castShadow
					>
						<boxGeometry args={[0.1, 0.3, 0.05]} />
						<meshStandardMaterial
							color="#D4AF37"
							metalness={0.6}
							roughness={0.3}
						/>
					</mesh>
				))}
			</group>

			<group position={[0.9, 0, 0.15]}>
				{[...Array(5)].map((_, i) => (
					<mesh
						key={`right-${i}`}
						position={[0, i * 0.4 - 1, 0]}
						rotation={[0, 0, -Math.PI / 6]}
						castShadow
					>
						<boxGeometry args={[0.1, 0.3, 0.05]} />
						<meshStandardMaterial
							color="#D4AF37"
							metalness={0.6}
							roughness={0.3}
						/>
					</mesh>
				))}
			</group>

			{/* Lions (Simplified as spheres on top) */}
			<group position={[0, 1.5, 0.2]}>
				{[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
					<mesh key={i} position={[x, 0, 0]} castShadow>
						<sphereGeometry args={[0.15, 16, 16]} />
						<meshStandardMaterial
							color="#D4AF37"
							metalness={0.7}
							roughness={0.2}
							emissive="#D4AF37"
							emissiveIntensity={0.3}
						/>
					</mesh>
				))}
			</group>

			{/* Glow Ring */}
			<mesh position={[0, 0, -0.2]}>
				<torusGeometry args={[1.5, 0.05, 16, 100]} />
				<meshStandardMaterial
					color="#D4AF37"
					emissive="#D4AF37"
					emissiveIntensity={0.5}
					transparent
					opacity={0.6}
				/>
			</mesh>

			{/* Particles */}
			<points ref={particlesRef}>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						count={particleCount}
						array={positions}
						itemSize={3}
						args={[positions, 3]}
					/>
				</bufferGeometry>
				<pointsMaterial
					size={0.05}
					color="#D4AF37"
					transparent
					opacity={0.6}
					sizeAttenuation
				/>
			</points>
		</group>
	);
}
