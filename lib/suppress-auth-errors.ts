// Suppress expected 401 errors in development console
// These occur when checking auth status on pages where user is not logged in
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        // Suppress 401 Unauthorized fetch errors for auth and context endpoints
        const errorMessage = args[0]?.toString() || "";
        if (
            errorMessage.includes("401") &&
            (errorMessage.includes("/api/auth/me") ||
                errorMessage.includes("/api/auth/login") ||
                errorMessage.includes("/api/auth/refresh") ||
                errorMessage.includes("/api/context/sync") ||
                errorMessage.includes("/api/context/me") ||
                errorMessage.includes("/api/ai/detect-regional-info"))
        ) {
            // Silently ignore expected auth check failures
            return;
        }
        originalError.apply(console, args);
    };

    // Suppress Spline-related uncaught errors and network failures
    window.addEventListener('error', (event) => {
        const errorMessage = event.error?.message || event.message || "";
        if (
            errorMessage.includes("end of buffer") ||
            errorMessage.includes("Spline") ||
            (errorMessage.includes("403") && errorMessage.includes(".splinecode"))
        ) {
            event.preventDefault();
            return false;
        }
    });
}

export { };
