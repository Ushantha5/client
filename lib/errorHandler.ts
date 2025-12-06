import { AxiosError } from "axios";

export interface ApiErrorResponse {
    success: false;
    error: string;
    errors?: Record<string, string>;
}

/**
 * Parse API error and return user-friendly message
 */
export function parseApiError(error: unknown): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        // Check for specific error message from backend
        if (data?.error) {
            return data.error;
        }

        // Check for validation errors
        if (data?.errors) {
            const firstError = Object.values(data.errors)[0];
            return firstError || "Validation error occurred";
        }

        // Network errors
        if (error.code === "ECONNABORTED") {
            return "Request timeout. Please try again.";
        }

        if (error.code === "ERR_NETWORK") {
            return "Network error. Please check your connection.";
        }

        // HTTP status errors
        if (error.response?.status === 404) {
            return "Resource not found";
        }

        if (error.response?.status === 500) {
            return "Server error. Please try again later.";
        }

        if (error.response?.status === 403) {
            return "You don't have permission to perform this action";
        }
    }

    // Generic error
    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred";
}

/**
 * Log error to console in development
 */
export function logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === "development") {
        console.error(`[Error${context ? ` - ${context}` : ""}]:`, error);
    }
}

/**
 * Handle API error with logging and parsing
 */
export function handleApiError(error: unknown, context?: string): string {
    logError(error, context);
    return parseApiError(error);
}
