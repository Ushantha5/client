"use client";

import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useProgress } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="bg-black/80 text-white p-2 rounded">Loading Room: {progress.toFixed(0)}%</div>
        </Html>
    );
}

function OBJModel({ url }: { url: string }) {
    const obj = useLoader(OBJLoader, url);

    // Basic material override if textures aren't effectively mapped by default
    // obj.traverse((child: any) => {
    //   if (child.isMesh) {
    //     child.material.color.setHex(0xcccccc);
    //   }
    // });

    return <primitive object={obj} scale={1} position={[0, -2, 0]} />;
}

interface RoomSceneProps {
    modelUrl: string;
    name: string;
}

export function RoomScene({ modelUrl, name }: RoomSceneProps) {
    return (
        <div className="w-full h-screen bg-[#1a1a1a] flex flex-col">
            <div className="p-4 bg-[#2a2a2a] text-white flex justify-between items-center">
                <h1 className="text-xl font-bold">{name}</h1>
            </div>
            <div className="flex-1 relative">
                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <Suspense fallback={<Loader />}>
                        <Environment preset="apartment" />
                        <ambientLight intensity={0.4} />
                        <pointLight position={[10, 10, 10]} />

                        <OBJModel url={modelUrl} />

                        <OrbitControls />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
