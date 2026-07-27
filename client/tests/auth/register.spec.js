import { test, expect } from '@playwright/test';

test.describe('Authentication - Registration Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('should load the registration page correctly', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('Create Your');
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
    });

    test('should show validation error for mismatched passwords', async ({ page }) => {
        await page.fill('input[name="name"]', 'Jane Doe');
        await page.fill('input[name="email"]', 'jane@example.com');
        await page.fill('input[name="password"]', 'Password123!');
        await page.fill('input[name="confirmPassword"]', 'Password456!');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Passwords do not match').first()).toBeVisible();
    });
});
