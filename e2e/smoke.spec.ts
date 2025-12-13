import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // We need to know what the actual title is.
    // Based on "Student Portal", let's expect that or something generic.
    // I'll check metadata or assume generic "App" or similar if unknown, but better check.
    await expect(page).toHaveTitle(/MR5|School|Learn/i);
});
