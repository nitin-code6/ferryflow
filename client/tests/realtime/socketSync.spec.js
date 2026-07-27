import { test, expect } from '@playwright/test';

test.describe('Real-Time Socket.IO Integration Flow', () => {
    test('should broadcast system alerts from admin to active passengers in real-time', async ({ browser }) => {
        // Step 1: Create two independent browser contexts
        const adminContext = await browser.newContext();
        const passengerContext = await browser.newContext();

        const adminPage = await adminContext.newPage();
        const passengerPage = await passengerContext.newPage();

        adminPage.on('console', msg => console.log('SOCKET ADMIN LOG:', msg.text()));
        adminPage.on('pageerror', err => console.log('SOCKET ADMIN ERROR:', err.message));
        passengerPage.on('console', msg => console.log('SOCKET PASSENGER LOG:', msg.text()));
        passengerPage.on('pageerror', err => console.log('SOCKET PASSENGER ERROR:', err.message));

        // Step 2: Admin Logs In
        await adminPage.goto('/admin/login');
        await adminPage.fill('input[name="email"]', 'admin@ferryflow.com');
        await adminPage.fill('input[name="password"]', 'Password123!');
        await adminPage.click('button[type="submit"]');
        await adminPage.waitForURL((url) => url.pathname === '/admin' || url.pathname === '/admin/dashboard');

        // Step 3: Passenger Logs In
        await passengerPage.goto('/login');
        await passengerPage.fill('input[name="email"]', 'citizen1@ferryflow.com');
        await passengerPage.fill('input[name="password"]', 'Password123!');
        await passengerPage.click('button[type="submit"]');
        await passengerPage.waitForURL('**/dashboard');

        // Step 4: Admin navigates to Alerts panel
        await adminPage.goto('/admin/alerts');
        await expect(adminPage.locator('h1').last()).toContainText('Alerts Broadcasting');

        // Step 5: Admin broadcasts a new alert
        const alertTitle = `E2E Realtime Title ${Date.now()}`;
        const alertMsg = `Emergency delay notice broadcasted at ${Date.now()}`;

        // Wait for alert title input to be visible to ensure form is loaded
        const alertTitleInput = adminPage.locator('input[placeholder="e.g. Minor Delay on Route"]');
        await expect(alertTitleInput).toBeVisible({ timeout: 10000 });

        await adminPage.locator('select').first().selectOption('delay');
        await alertTitleInput.fill(alertTitle);
        await adminPage.fill('textarea[placeholder="Type the warning message here..."]', alertMsg);

        // Submit alert
        await adminPage.click('button[type="submit"]');

        // Step 6: Verify Passenger receives the alert toast message in real-time
        // We assert that the alert toast is visible on the passenger's page
        await expect(passengerPage.locator(`text=${alertMsg}`).first()).toBeVisible({ timeout: 10000 });

        // Clean up contexts
        await adminContext.close();
        await passengerContext.close();
    });
});
