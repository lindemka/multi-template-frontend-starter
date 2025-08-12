import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth';

test.describe('Fix Real User Experience Issues', () => {
    test('should test complete user flow and fix issues', async ({ page }) => {
        // Step 1: Test login flow
        console.log('=== STEP 1: Testing Login Flow ===');
        await login(page, TEST_USERS.sarah);

        // Verify we're logged in by checking dashboard
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        console.log('Dashboard URL:', page.url());
        const dashboardContent = await page.textContent('body');
        console.log('Dashboard has content:', dashboardContent?.length > 0);

        // Step 2: Test messages page
        console.log('=== STEP 2: Testing Messages Page ===');
        await page.goto('/dashboard/messages');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000); // Wait for React hydration

        console.log('Messages URL:', page.url());

        // Check for various possible states
        const has404 = await page.locator('h1:has-text("404")').count();
        const hasLoading = await page.locator('.text-lg:has-text("Loading...")').count();
        const hasNachrichten = await page.locator('*:has-text("Nachrichten")').count();
        const hasMessagesInterface = await page.locator('[class*="chat"], [class*="message"], .flex-1').count();

        console.log('404 Error:', has404 > 0);
        console.log('Still Loading:', hasLoading > 0);
        console.log('Nachrichten Text:', hasNachrichten);
        console.log('Messages Interface:', hasMessagesInterface);

        // If we see loading for too long, that's a hydration issue
        if (hasLoading > 0) {
            console.log('⚠️ HYDRATION ISSUE DETECTED: Page stuck in loading state');
            // Wait longer to see if it resolves
            await page.waitForTimeout(5000);
            const stillLoading = await page.locator('.text-lg:has-text("Loading...")').count();
            if (stillLoading > 0) {
                console.log('❌ HYDRATION ISSUE CONFIRMED: Page still loading after 10 seconds');
            }
        }

        // Step 3: Test account page
        console.log('=== STEP 3: Testing Account Page ===');
        await page.goto('/dashboard/account');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        console.log('Account URL:', page.url());

        const hasAccountSettings = await page.locator('*:has-text("Account Settings")').count();
        const hasAccountForm = await page.locator('input, form').count();

        console.log('Account Settings Text:', hasAccountSettings);
        console.log('Account Form Elements:', hasAccountForm);

        // Step 4: Test navigation between pages
        console.log('=== STEP 4: Testing Navigation ===');
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Test clicking navigation links if they exist
        const navLinks = await page.locator('a[href*="/dashboard"], button[onclick*="dashboard"]').count();
        console.log('Navigation Links Found:', navLinks);

        // Step 5: Take screenshots for analysis
        await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });

        // Step 6: Check console for errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log('Console Error:', msg.text());
            }
        });

        // Reload page to capture any console errors
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        console.log('Console Errors Found:', consoleErrors.length);

        // Step 7: Test API endpoints directly
        console.log('=== STEP 7: Testing API Endpoints ===');
        const meResponse = await page.request.get('/api/account/me');
        console.log('Me API Status:', meResponse.status());

        const messagesResponse = await page.request.get('/api/messages');
        console.log('Messages API Status:', messagesResponse.status());

        // Step 8: Summary and recommendations
        console.log('=== STEP 8: Summary ===');

        if (has404 > 0) {
            console.log('❌ ISSUE: 404 errors detected');
        }

        if (hasLoading > 0) {
            console.log('❌ ISSUE: React hydration problems - pages stuck in loading state');
        }

        if (hasNachrichten === 0 && hasAccountSettings === 0) {
            console.log('❌ ISSUE: Content not rendering - React components not mounting');
        }

        if (consoleErrors.length > 0) {
            console.log('❌ ISSUE: JavaScript errors in console');
        }

        // Wait for user to see the browser
        await page.waitForTimeout(5000);

        // Final assertion - the application should be functional
        expect(page.url()).not.toContain('/login');
        expect(has404).toBe(0);
    });
});
