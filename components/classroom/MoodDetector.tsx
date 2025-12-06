"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smile, Frown, Meh, Video, VideoOff, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MoodDetector() {
    const webcamRef = useRef<Webcam>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [mood, setMood] = useState<"Happy" | "Neutral" | "Focused" | "Distracted">("Neutral");
    const [engagement, setEngagement] = useState(0);
    const [modelLoaded, setModelLoaded] = useState(false);
    const requestRef = useRef<number>();

    useEffect(() => {
        if (!isCameraOn) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            return;
        }

        let faceMesh: any = null;

        const loadFaceMesh = async () => {
            if (!(window as any).FaceMesh) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
                script.async = true;
                document.body.appendChild(script);
                await new Promise((resolve) => {
                    script.onload = resolve;
                });
            }

            faceMesh = new (window as any).FaceMesh({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                },
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults(onResults);

            detect();
        };

        const onResults = (results: any) => {
            if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
                setMood("Distracted");
                setEngagement(20);
                return;
            }

            const landmarks = results.multiFaceLandmarks[0];

            // Simple heuristics for mood/engagement
            // 1. Smile detection (mouth corners distance)
            // Landmarks: 61 (left corner), 291 (right corner), 0 (upper lip), 17 (lower lip)
            const leftMouth = landmarks[61];
            const rightMouth = landmarks[291];
            const topLip = landmarks[0];
            const bottomLip = landmarks[17];

            const mouthWidth = Math.sqrt(
                Math.pow(rightMouth.x - leftMouth.x, 2) + Math.pow(rightMouth.y - leftMouth.y, 2)
            );
            const mouthHeight = Math.sqrt(
                Math.pow(bottomLip.x - topLip.x, 2) + Math.pow(bottomLip.y - topLip.y, 2)
            );

            const smileRatio = mouthWidth / mouthHeight;

            // 2. Engagement (Face facing forward)
            // Nose tip: 1
            const nose = landmarks[1];
            const isLookingForward = Math.abs(nose.x - 0.5) < 0.1 && Math.abs(nose.y - 0.5) < 0.1;

            let currentMood: "Happy" | "Neutral" | "Focused" | "Distracted" = "Neutral";
            let currentEngagement = 50;

            if (smileRatio > 2.5) { // Threshold for smile
                currentMood = "Happy";
                currentEngagement = 90;
            } else if (isLookingForward) {
                currentMood = "Focused";
                currentEngagement = 80;
            } else {
                currentMood = "Distracted";
                currentEngagement = 40;
            }

            setMood(currentMood);
            setEngagement(currentEngagement);
        };

        const detect = async () => {
            if (
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4 &&
                faceMesh
            ) {
                await faceMesh.send({ image: webcamRef.current.video });
                setModelLoaded(true);
            }
            requestRef.current = requestAnimationFrame(detect);
        };

        loadFaceMesh();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (faceMesh) {
                faceMesh.close();
            }
        };
    }, [isCameraOn]);

    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
        setMood("Neutral");
        setEngagement(0);
    };

    const getMoodIcon = () => {
        switch (mood) {
            case "Happy": return <Smile className="w-6 h-6 text-green-400" />;
            case "Focused": return <Activity className="w-6 h-6 text-blue-400" />;
            case "Distracted": return <Meh className="w-6 h-6 text-yellow-400" />;
            default: return <Meh className="w-6 h-6 text-gray-400" />;
        }
    };

    return (
        <Card className="bg-slate-900/80 border-white/10 p-4 backdrop-blur-md w-full max-w-xs">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Student Engagement
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCamera}
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                >
                    {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
            </div>

            <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden mb-4 border border-white/5">
                {isCameraOn ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            className="absolute inset-0 w-full h-full object-cover mirror"
                            mirrored={true}
                        />
                        {!modelLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                Loading AI Model...
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                        Camera Off
                    </div>
                )}

                {/* Overlay Stats */}
                {isCameraOn && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                        <div className="flex items-center gap-2">
                            {getMoodIcon()}
                            <span className="text-xs font-medium text-white">{mood}</span>
                        </div>
                        <span className="text-xs text-cyan-400">{engagement}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Engagement Level</span>
                    <span>{engagement}%</span>
                </div>
                <Progress value={engagement} className="h-1.5 bg-white/10" />
            </div>
        </Card>
    );
}
