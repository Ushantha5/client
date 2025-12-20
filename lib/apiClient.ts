import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Use relative path to leverage Next.js rewrites and avoid port mismatch issues
const getBaseURL = () => {
    return "";
};

// Rate limiting for auth/me calls
let lastAuthCall = 0;
const AUTH_CALL_DELAY = 1000; // 1 second minimum between auth calls

const apiClient = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    withCredentials: true, // Important for cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: We rely on httpOnly cookies now, so manual header setting is removed.
// If you need to debug or handle specific cases, you can add logic here.
apiClient.interceptors.request.use(
    async (config) => {
        // Add rate limiting for auth/me calls
        if (config.url?.endsWith('/auth/me')) {
            const now = Date.now();
            const timeSinceLastCall = now - lastAuthCall;

            if (timeSinceLastCall < AUTH_CALL_DELAY) {
                // Delay the request to enforce minimum time between calls
                await new Promise(resolve => setTimeout(resolve, AUTH_CALL_DELAY - timeSinceLastCall));
            }

            lastAuthCall = Date.now();
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Flag to prevent infinite loops during refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor: Handle 401 errors and auto-refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Handle 429 Too Many Requests error
        if (error.response?.status === 429) {
            console.warn("Rate limit exceeded. Please wait before making another request.");
            // Optionally, you could implement a retry mechanism here with exponential backoff
            return Promise.reject(new Error("Too many requests. Please try again later."));
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint - cookies are sent automatically
                // Fixed: Use correct endpoint with /api prefix
                await apiClient.post("/api/auth/refresh");

                // If successful, the new cookies are set by the server response headers
                processQueue(null);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // If refresh fails, user is properly logged out
                if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                    // Redirect to login only if not already there
                    window.location.href = "/login?expired=true";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
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