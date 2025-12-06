"use client";

import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ClassroomRoomProps {
    roomName: string;
    participantName: string;
}

export function ClassroomRoom({ roomName, participantName }: ClassroomRoomProps) {
    const [token, setToken] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit/token?room=${roomName}&username=${participantName}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [roomName, participantName]);

    if (token === "") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-2" />
                <p className="text-sm text-gray-400">Connecting to Classroom...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: "100%" }}
        >
            <MyVideoConference />
            <RoomAudioRenderer />
            <ControlBar />
        </LiveKitRoom>
    );
}

function MyVideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );
    return (
        <GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
            <ParticipantTile />
        </GridLayout>
    );
}
