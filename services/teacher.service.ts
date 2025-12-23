import apiClient from "@/lib/apiClient";

export const teacherService = {
    /**
     * Get all teachers
     */
    getAllTeachers: async () => {
        const response = await apiClient.get("/api/avatar/teachers");
        return response.data;
    },

    /**
     * Get teacher by ID
     */
    getTeacherById: async (id: string) => {
        const response = await apiClient.get(`/api/avatar/teachers/${id}`);
        return response.data;
    },
};