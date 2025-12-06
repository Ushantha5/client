import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true, // Important for cookies
});

// Request interceptor: Add token from cookies
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor: Handle 401 errors and other common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear cookies and redirect to login
            Cookies.remove("token");
            Cookies.remove("user");
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
        }

        // Log errors in development
        if (process.env.NODE_ENV === "development") {
            console.error("API Error:", {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
            });
        }

        return Promise.reject(error);
    },
);

export default apiClient;
