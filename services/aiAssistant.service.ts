import apiClient from "@/lib/apiClient";
import {
    AIInteraction,
    CreateAIInteractionData,
    UpdateAIInteractionData,
} from "@/types/aiAssistant";
import { PaginatedResponse, PaginationParams } from "@/types/api";

interface AIInteractionFilters extends PaginationParams {
    user?: string;
    course?: string;
    mode?: "text" | "voice";
    search?: string;
}

export const aiAssistantService = {
    /**
     * Get all AI assistant interactions with pagination and filters
     */
    getAllInteractions: async (
        params?: AIInteractionFilters,
    ): Promise<PaginatedResponse<AIInteraction>> => {
        const response = await apiClient.get("/aI_Assistant_Interctions", {
            params,
        });
        return response.data;
    },

    /**
     * Get a single AI interaction by ID
     */
    getInteractionById: async (
        id: string,
    ): Promise<{ success: boolean; data: AIInteraction }> => {
        const response = await apiClient.get(`/aI_Assistant_Interctions/${id}`);
        return response.data;
    },

    /**
     * Create a new AI interaction
     */
    createInteraction: async (
        data: CreateAIInteractionData,
    ): Promise<{ success: boolean; data: AIInteraction }> => {
        const response = await apiClient.post("/aI_Assistant_Interctions", data);
        return response.data;
    },

    /**
     * Update an existing AI interaction
     */
    updateInteraction: async (
        id: string,
        data: UpdateAIInteractionData,
    ): Promise<{ success: boolean; data: AIInteraction }> => {
        const response = await apiClient.put(
            `/aI_Assistant_Interctions/${id}`,
            data,
        );
        return response.data;
    },

    /**
     * Delete an AI interaction
     */
    deleteInteraction: async (
        id: string,
    ): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(`/aI_Assistant_Interctions/${id}`);
        return response.data;
    },

    /**
     * Get user's interaction history
     */
    getUserHistory: async (
        userId: string,
        page = 1,
        limit = 20,
    ): Promise<PaginatedResponse<AIInteraction>> => {
        return aiAssistantService.getAllInteractions({ user: userId, page, limit });
    },

    /**
     * Get course-specific interactions
     */
    getCourseInteractions: async (
        courseId: string,
        page = 1,
        limit = 20,
    ): Promise<PaginatedResponse<AIInteraction>> => {
        return aiAssistantService.getAllInteractions({
            course: courseId,
            page,
            limit,
        });
    },

    /**
     * Search interactions
     */
    searchInteractions: async (
        query: string,
        page = 1,
        limit = 20,
    ): Promise<PaginatedResponse<AIInteraction>> => {
        return aiAssistantService.getAllInteractions({ search: query, page, limit });
    },
};
