import { test, expect } from '@playwright/test';

test.describe('Admin User Journey - Management Flow', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('ADMIN FLOW LOG:', msg.text()));
        page.on('pageerror', err => console.log('ADMIN FLOW ERROR:', err.message));

        // Step 1: Log in as admin
        await page.goto('/admin/login');
        await page.fill('input[name="email"]', 'admin@ferryflow.com');
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // Wait until redirected to admin dashboard specifically (avoid matching /admin/login)
        await page.waitForURL((url) => url.pathname === '/admin' || url.pathname === '/admin/dashboard');
    });

    test('should allow admin to manage ferries, routes, schedules, and alerts', async ({ page }) => {
        // 1. Create a Ferry
        await page.goto('/admin/ferries/new');
        await expect(page.locator('h1').last()).toContainText('Add New Ferry');

        const ferryName = `E2E Test Ferry ${Date.now()}`;
        const regNo = `REG-${Date.now()}`;

        await page.fill('input[placeholder="Enter ferry name"]', ferryName);
        await page.fill('input[placeholder="Enter registration number"]', regNo);
        await page.fill('input[placeholder="Maximum passengers"]', '80');
        await page.selectOption('select', 'available');

        // Submit the form
        await page.click('button[type="submit"]');
        
        // Wait for redirect to ferries list
        await page.waitForURL('**/admin/ferries');

        // 2. Create a Route
        await page.goto('/admin/routes/create');
        await expect(page.locator('h1').last()).toContainText('Add New Route');

        const routeName = `E2E Route ${Date.now()}`;
        const originPort = `Origin Port ${Date.now()}`;
        const destPort = `Dest Port ${Date.now()}`;
        await page.fill('input[placeholder="e.g. Seattle to Bainbridge"]', routeName);
        await page.fill('input[placeholder="e.g. Seattle Port"]', originPort);
        await page.fill('input[placeholder="e.g. Bainbridge Island Port"]', destPort);
        await page.fill('input[placeholder="e.g. 8.6"]', '12');
        await page.fill('input[placeholder="e.g. 35"]', '45');

        await page.click('button[type="submit"]');

        // Wait for redirect to routes list
        await page.waitForURL('**/admin/routes');

        // 3. Create a Schedule
        await page.goto('/admin/schedules/create');
        await expect(page.locator('h1').last()).toContainText('Create New Schedule');

        // Select the newly created ferry and route
        // Wait for dropdowns to be populated
        const ferrySelect = page.locator('select[name="ferry"]');
        await expect(ferrySelect).toBeVisible();

        const ferryOption = page.locator('select[name="ferry"] option').filter({ hasText: ferryName });
        const ferryVal = await ferryOption.getAttribute('value');
        await page.selectOption('select[name="ferry"]', ferryVal);

        const routeOption = page.locator('select[name="route"] option').filter({ hasText: routeName });
        const routeVal = await routeOption.getAttribute('value');
        await page.selectOption('select[name="route"]', routeVal);

        // Fill date/time
        // We set departure to tomorrow at 10:00 AM
        const formatDateTimeLocal = (d) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        const departure = new Date();
        departure.setDate(departure.getDate() + 1);
        departure.setHours(10, 0, 0, 0);
        const departureTimeStr = formatDateTimeLocal(departure);
        
        await page.fill('input[name="departureTime"]', departureTimeStr);

        const arrival = new Date(departure.getTime() + 60 * 60 * 1000); // 1 hour later
        const arrivalTimeStr = formatDateTimeLocal(arrival);
        await page.fill('input[name="arrivalTime"]', arrivalTimeStr);

        await page.fill('input[name="fare"]', '150');
        await page.click('button[type="submit"]');

        // Wait for redirect to schedules list
        await page.waitForURL('**/admin/schedules');

        // 4. Publish Alert
        await page.goto('/admin/alerts');
        await expect(page.locator('h1').last()).toContainText('Alerts Broadcasting');

        // Wait for alert title input to be visible to ensure form is loaded
        const alertTitleInput = page.locator('input[placeholder="e.g. Minor Delay on Route"]');
        await expect(alertTitleInput).toBeVisible({ timeout: 10000 });

        // First select is the alert type dropdown
        await page.locator('select').first().selectOption('delay');
        await alertTitleInput.fill('E2E Delay Alert');
        await page.fill('textarea[placeholder="Type the warning message here..."]', 'This is an E2E test alert message.');

        await page.click('button[type="submit"]');
        
        // Wait for the alert to show in the list
        await expect(page.locator('text=E2E Delay Alert').first()).toBeVisible({ timeout: 10000 });
    });
});
