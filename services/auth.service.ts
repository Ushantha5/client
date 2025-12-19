import apiClient from "@/lib/apiClient";
import { LoginCredentials, RegisterData, User } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const authService = {
    /**
     * Login with email and password
     */
    login: async (
        credentials: LoginCredentials,
    ): Promise<ApiResponse<{ accessToken: string; user: User }>> => {
        const response = await apiClient.post("/api/auth/login", credentials);
        return response.data;
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<ApiResponse<User>> => {
        const response = await apiClient.post("/api/auth/register", data);
        return response.data;
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get("/api/auth/me");
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: any): Promise<ApiResponse<User>> => {
        const response = await apiClient.put("/api/auth/updatedetails", data);
        return response.data;
    },

    /**
     * Logout (if backend has logout endpoint)
     */
    logout: async (): Promise<ApiResponse<{ message: string }>> => {
        const response = await apiClient.post("/api/auth/logout");
        return response.data;
    },
};