// Suppress expected 401 errors in development console
// These occur when checking auth status on pages where user is not logged in
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        // Suppress 401 Unauthorized fetch errors for auth endpoints
        const errorMessage = args[0]?.toString() || "";
        if (
            errorMessage.includes("401") &&
            (errorMessage.includes("/api/auth/me") ||
                errorMessage.includes("/api/auth/login"))
        ) {
            // Silently ignore expected auth check failures
            return;
        }
        originalError.apply(console, args);
    };
}

export { };
