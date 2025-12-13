"use client";

import { RoomScene } from "@/components/3d/room-scene";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function ClassroomPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id;

    return (
        <div className="relative h-screen w-full">
            <div className="absolute top-4 left-4 z-10">
                <Button onClick={() => router.push(`/course/${courseId}`)} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campus
                </Button>
            </div>
            <RoomScene
                modelUrl="/assets/3d/rooms/classroom.obj"
                name="Post-Soviet Classroom (History Class)"
            />
        </div>
    );
}
