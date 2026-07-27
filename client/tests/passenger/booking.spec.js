import { test, expect } from '@playwright/test';

test.describe('Passenger User Journey - Booking Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Step 1: Login
        await page.goto('/login');
        await page.fill('input[name="email"]', 'citizen@ferryflow.com');
        await page.fill('input[name="password"]', 'Citizen123!');
        await page.click('button[type="submit"]');

        // Wait until redirected to dashboard or landing
        await page.waitForURL('**/dashboard');
    });

    test('should allow passenger to search and browse schedules', async ({ page }) => {
        await page.goto('/');
        
        // Wait for ports list to populate
        const departureSelect = page.locator('select').first();
        await expect(departureSelect).toBeVisible();

        // Select ports if options are populated
        const departureOptionsCount = await departureSelect.locator('option').count();
        if (departureOptionsCount > 1) {
            await departureSelect.selectOption({ index: 1 });
            const destinationSelect = page.locator('select').nth(1);
            await destinationSelect.selectOption({ index: 2 });

            const today = new Date().toISOString().split('T')[0];
            await page.fill('input[type="date"]', today);
            await page.click('button[type="submit"]');

            // Verify landing on search results page
            await page.waitForURL('**/search-results**');
            await expect(page.locator('h2, h3')).toContainText(/results|schedules/i);
        }
    });
});
