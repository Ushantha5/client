import apiClient from "@/lib/apiClient";
import { AI-TEACHER } from "@/types/AI-TEACHER";
import { ApiResponse } from "@/types/api";

export const AI-TEACHERService = {
    /**
     * Get all AI-TEACHERs
     */
    getAllAI - TEACHERs: async (): Promise<ApiResponse<AI-TEACHER[] >> => {
        const response = await apiClient.get("/avathor/AI-TEACHERs");
        return response.data;
    },

    /**
     * Get AI-TEACHER by ID
     */
    getAI - TEACHERById: async (id: string): Promise<ApiResponse<AI-TEACHER >> => {
        const response = await apiClient.get(`/avathor/AI-TEACHERs/${id}`);
        return response.data;
    },
};
