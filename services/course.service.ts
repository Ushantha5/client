import apiClient from "@/lib/apiClient";

export interface Course {
	_id: string;
	title: string;
	description: string;
	category?: string;
	level: string;
	price: number;
	thumbnail?: string;
	language: string;
	teacher: {
		_id: string;
		name: string;
		email: string;
		profileImage?: string;
	};
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CoursesResponse {
	success: boolean;
	data: Course[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const courseService = {
	getAllCourses: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		level?: string;
		category?: string;
	}): Promise<CoursesResponse> => {
		const response = await apiClient.get<CoursesResponse>("/api/courses", {
			params,
		});
		return response.data;
	},

	getCourseById: async (id: string): Promise<{ success: boolean; data: Course }> => {
		const response = await apiClient.get<{ success: boolean; data: Course }>(
			`/api/courses/${id}`,
		);
		return response.data;
	},
};

