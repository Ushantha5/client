import apiClient from "@/lib/apiClient";

export interface Enrollment {
	_id: string;
	student: {
		_id: string;
		name: string;
		email: string;
		profileImage?: string;
	};
	course: {
		_id: string;
		title: string;
		description: string;
		thumbnail?: string;
		price: number;
		level: string;
		teacher: {
			_id: string;
			name: string;
			email: string;
		};
	};
	progress: number;
	status: "active" | "completed";
	enrolledAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface EnrollmentsResponse {
	success: boolean;
	data: Enrollment[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const enrollmentService = {
	getMyEnrollments: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<EnrollmentsResponse> => {
		const response = await apiClient.get<EnrollmentsResponse>("/api/enrollments/my", {
			params,
		});
		return response.data;
	},

	getEnrollmentById: async (id: string): Promise<{ success: boolean; data: Enrollment }> => {
		const response = await apiClient.get<{ success: boolean; data: Enrollment }>(
			`/api/enrollments/${id}`,
		);
		return response.data;
	},

	createEnrollment: async (data: Partial<Enrollment>): Promise<{ success: boolean; data: Enrollment }> => {
		const response = await apiClient.post<{ success: boolean; data: Enrollment }>(
			"/api/enrollments",
			data,
		);
		return response.data;
	},

	updateEnrollment: async (
		id: string,
		data: Partial<Enrollment>,
	): Promise<{ success: boolean; data: Enrollment }> => {
		const response = await apiClient.put<{ success: boolean; data: Enrollment }>(
			`/api/enrollments/${id}`,
			data,
		);
		return response.data;
	},
};