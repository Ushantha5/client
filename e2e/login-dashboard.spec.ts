import { test, expect } from '@playwright/test';

test.describe('Login and Dashboard Flow', () => {
    test('user can log in and see student dashboard', async ({ page }) => {
        // Go to home page
        await page.goto(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

        // Click Sign In button
        await page.getByRole('button', { name: /sign in/i }).click();

        // Fill login form (replace with real test credentials)
        await page.fill('input[name="email"]', 'testuser@example.com');
        await page.fill('input[name="password"]', 'password123');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Wait for navigation to student dashboard
        await page.waitForURL('**/student');
        await expect(page).toHaveURL(/\/student/);

        // Verify dashboard header exists
        await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();

        // Verify at least one StatsCard is visible
        await expect(page.locator('text=Learning Hours')).toBeVisible();
    });
});
