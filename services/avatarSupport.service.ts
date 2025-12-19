import apiClient from "@/lib/apiClient";

export const avatarSupportService = {
    /**
     * Get LiveKit token for avatar agent
     */
    getAvatarToken: async (roomId: string, participantName: string) => {
        return await apiClient.post("/api/livekit/avatar-token", {
            room: roomId,
            participantName,
        });
    },

    /**
     * Get room information
     */
    getRoomInfo: async (roomId: string) => {
        return await apiClient.get(`/api/livekit/room/${roomId}`);
    },

    /**
     * Execute an avatar support agent action
     */
    executeAction: async (data: { user_intent: string; tool_calls: any[] }) => {
        return await apiClient.post("/avatar-support-agent/action", data);
    },

    /**
     * Run a test avatar action
     */
    runTest: async () => {
        return await apiClient.post("/avatar-support-agent/test");
    },
};
