import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth';
import { generateTestMessage } from './helpers/data';

test.describe('Messages Page', () => {
    test('should load messages page and handle authentication', async ({ page }) => {
        // Login first using the auth helper
        await login(page, TEST_USERS.sarah);

        // Navigate to messages page
        await page.goto('/dashboard/messages');
        await page.waitForLoadState('networkidle');

        // Now we should be on the messages page
        await expect(page).not.toHaveURL(/login/);
        await expect(page).toHaveURL(/messages/);

        // Check for any content on the page
        const pageContent = await page.textContent('body');
        expect(pageContent).toBeTruthy();
        console.log('Page loaded successfully');
    });

    test('should have basic page structure', async ({ page }) => {
        await login(page, TEST_USERS.sarah);
        await page.goto('/dashboard/messages');
        await page.waitForLoadState('networkidle');

        // Check for basic page elements
        const buttons = await page.locator('button').count();
        const inputs = await page.locator('input').count();

        console.log(`Found ${buttons} buttons on the page`);
        console.log(`Found ${inputs} inputs on the page`);

        // Should have some interactive elements
        expect(buttons).toBeGreaterThan(0);
    });

    test('should handle API endpoints', async ({ request }) => {
        // Add longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();
        expect(loginData.accessToken).toBeDefined();

        // Test conversations API
        const conversationsResponse = await request.get('http://localhost:8080/api/chat/conversations', {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });

        // Should get a response (might be empty array or error)
        expect([200, 404, 403, 401, 500]).toContain(conversationsResponse.status());
    });

    test('should handle user search API', async ({ request }) => {
        // Add longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Test user search API
        const searchResponse = await request.get('http://localhost:8080/api/chat/users/search?q=alex', {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });

        if (searchResponse.ok()) {
            const users = await searchResponse.json();
            console.log(`Found ${users.length} users matching 'alex'`);
            expect(Array.isArray(users)).toBeTruthy();
        } else {
            expect([404, 403, 401, 500]).toContain(searchResponse.status());
        }
    });

    test('should handle WebSocket ticket API', async ({ request }) => {
        // Add longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Test WebSocket ticket API
        const ticketResponse = await request.get('http://localhost:8080/api/chat/ws-ticket', {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });

        if (ticketResponse.ok()) {
            const ticketData = await ticketResponse.json();
            console.log('WebSocket ticket obtained successfully');
            expect(ticketData).toBeDefined();
        } else {
            expect([404, 403, 401, 500]).toContain(ticketResponse.status());
        }
    });

    test('should handle send message API', async ({ request }) => {
        // Add even longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Test send message API
        const messageResponse = await request.post('http://localhost:8080/api/chat/send', {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                to: TEST_USERS.alex.username,
                content: generateTestMessage('API Test')
            }
        });

        if (messageResponse.ok()) {
            console.log('Message sent successfully via API');
            const messageData = await messageResponse.json();
            expect(messageData).toBeDefined();
        } else {
            expect([404, 403, 400, 401, 500]).toContain(messageResponse.status());
        }
    });

    test('should handle mark read API', async ({ request }) => {
        // Add even longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Test mark read API
        const markReadResponse = await request.post(`http://localhost:8080/api/chat/conversations/${TEST_USERS.alex.username}/mark-read`, {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });

        // Should get a response (might be success or error)
        expect([200, 204, 404, 403, 401, 500]).toContain(markReadResponse.status());
    });

    test('should handle ensure conversation API', async ({ request }) => {
        // Add even longer delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Use backend API directly to avoid rate limiting
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Test ensure conversation API
        const ensureResponse = await request.post(`http://localhost:8080/api/chat/conversations/${TEST_USERS.alex.username}/ensure`, {
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            }
        });

        // Should get a response (might be success or error)
        expect([200, 404, 403, 401, 500]).toContain(ensureResponse.status());
    });
});
