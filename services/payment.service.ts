import apiClient from "@/lib/apiClient";

export interface CreateCheckoutSessionRequest {
	courseId: string;
}

export interface CreateCheckoutSessionResponse {
	success: boolean;
	sessionId: string;
	url: string;
}

export interface VerifyPaymentResponse {
	success: boolean;
	data: {
		payment: any;
		enrollment: any;
	};
}

export const paymentService = {
	createCheckoutSession: async (
		courseId: string,
	): Promise<CreateCheckoutSessionResponse> => {
		const response = await apiClient.post<CreateCheckoutSessionResponse>(
			"/api/payments/create-checkout-session",
			{ courseId },
		);
		return response.data;
	},

	verifyPayment: async (
		sessionId: string,
	): Promise<VerifyPaymentResponse> => {
		const response = await apiClient.get<VerifyPaymentResponse>(
			`/api/payments/verify/${sessionId}`,
		);
		return response.data;
	},
};

