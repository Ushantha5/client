import apiClient from "@/lib/apiClient";
import { Teacher } from "@/types/teacher"; // Assuming type file will be renamed or exports Teacher
import { ApiResponse } from "@/types/api";

export const teacherService = {
    /**
     * Get all AI-TEACHERs
     */
    getAllTeachers: async (): Promise<ApiResponse<Teacher[]>> => {
        const response = await apiClient.get("/avathor/teachers");
        return response.data;
    },

    /**
     * Get AI-TEACHER by ID
     */
    getTeacherById: async (id: string): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.get(`/avathor/teachers/${id}`);
        return response.data;
    },
};
