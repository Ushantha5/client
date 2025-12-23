import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";

interface AvatarSkillSubmission {
	name: string;
	skillName: string;
	description: string;
	category: string;
	email: string;
}

export const registrationService = {
	/**
	 * Submit an Avatar AI skill for review
	 */
	submitAvatarSkill: async (
		submissionData: AvatarSkillSubmission,
	): Promise<ApiResponse<{ message: string }>> => {
		const response = await apiClient.post("/api/requests", submissionData);
		return response.data;
	},
};