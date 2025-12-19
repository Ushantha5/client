import apiClient from "@/lib/apiClient";

export interface Lesson {
    _id: string;
    course: string | any;
    title: string;
    videoUrl?: string;
    content?: string;
    duration?: number;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetLessonsParams {
    course?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetLessonsResponse {
    success: boolean;
    data: Lesson[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const lessonService = {
    getLessons: async (params?: GetLessonsParams): Promise<GetLessonsResponse> => {
        const response = await apiClient.get<GetLessonsResponse>("/api/lessons", {
            params,
        });
        return response.data;
    },

    getLessonById: async (id: string): Promise<{ success: boolean; data: Lesson }> => {
        const response = await apiClient.get<{ success: boolean; data: Lesson }>(
            `/api/lessons/${id}`
        );
        return response.data;
    },
};
