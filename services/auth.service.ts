import apiClient from "@/lib/apiClient";
import { LoginCredentials, RegisterData, User } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const authService = {
    /**
     * Login with email and password
     */
    login: async (
        credentials: LoginCredentials,
    ): Promise<ApiResponse<{ token: string; user: User }>> => {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<ApiResponse<User>> => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },

    /**
     * Logout (if backend has logout endpoint)
     */
    logout: async (): Promise<ApiResponse<{ message: string }>> => {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    },
};
