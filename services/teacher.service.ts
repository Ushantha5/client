import apiClient from "@/lib/apiClient";
import { Teacher } from "@/types/teacher";
import { ApiResponse } from "@/types/api";

export const teacherService = {
    /**
     * Get all teachers
     */
    getAllTeachers: async (): Promise<ApiResponse<Teacher[]>> => {
        const response = await apiClient.get("/avathor/teachers");
        return response.data;
    },

    /**
     * Get teacher by ID
     */
    getTeacherById: async (id: string): Promise<ApiResponse<Teacher>> => {
        const response = await apiClient.get(`/avathor/teachers/${id}`);
        return response.data;
    },
};
