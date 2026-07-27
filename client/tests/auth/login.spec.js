import { test, expect } from '@playwright/test';

test.describe('Authentication - Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should load the login page correctly', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('Welcome');
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test('should show validation error for malformed email', async ({ page }) => {
        await page.fill('input[name="email"]', 'notanemail');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=⚠')).toBeVisible();
    });

    test('should show server validation warning for wrong credentials', async ({ page }) => {
        await page.fill('input[name="email"]', 'wronguser@example.com');
        await page.fill('input[name="password"]', 'WrongPassword123!');
        await page.click('button[type="submit"]');

        // We expect a warning toast or inline error response to appear
        const errorMsg = page.locator('text=Invalid credentials').or(page.locator('text=unauthorized')).or(page.locator('text=⚠'));
        await expect(errorMsg.first()).toBeVisible();
    });
});
