import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";

interface AvathorSkillSubmission {
	name: string;
	skillName: string;
	description: string;
	category: string;
	email: string;
}

export const registrationService = {
	/**
	 * Submit an Avathor AI skill for review
	 */
	submitAvathorSkill: async (
		submissionData: AvathorSkillSubmission,
	): Promise<ApiResponse<{ message: string }>> => {
		const response = await apiClient.post("/api/requests", submissionData);
		return response.data;
	},
};