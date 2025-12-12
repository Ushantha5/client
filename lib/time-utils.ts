

/**
 * Get a time-based greeting based on the current hour
 * @returns A greeting string like "Good morning", "Good afternoon", etc.
 */
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good evening";
    } else {
        return "Welcome back";
    }
}
