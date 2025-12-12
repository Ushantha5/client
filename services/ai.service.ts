import apiClient from "@/lib/apiClient";
import { ChatRequest, ChatResponse, GradeRequest, GradeResponse, SummaryRequest, SummaryResponse } from "@/types/ai";

export const aiService = {
    /**
     * Send a chat message to the AI Coach
     */
    chat: async (data: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post("/ai/chat", data);
        return response.data;
    },

    /**
     * Generate course summary and quiz
     */
    generateSummary: async (data: SummaryRequest): Promise<SummaryResponse> => {
        const response = await apiClient.post("/ai/summary", data);
        return response.data;
    },

    /**
     * Auto-grade an assignment
     */
    gradeAssignment: async (data: GradeRequest): Promise<GradeResponse> => {
        const response = await apiClient.post("/ai/grade", data);
        return response.data;
    },
};
