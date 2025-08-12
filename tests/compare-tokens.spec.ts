import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth';

test.describe('Compare Tokens', () => {
    test('should compare working vs failing tokens', async ({ page }) => {
        // Login first
        await login(page, TEST_USERS.sarah);

        console.log('=== STEP 1: Get token from cookies ===');

        // Get the access token from cookies
        const accessToken = await page.evaluate(() => {
            return document.cookie.split('accessToken=')[1]?.split(';')[0];
        });

        console.log('Access token from cookies:', accessToken ? 'exists' : 'missing');
        if (accessToken) {
            console.log('Token length:', accessToken.length);
            console.log('Token starts with:', accessToken.substring(0, 20) + '...');
        }

        console.log('=== STEP 2: Test with cookie token ===');

        // Test backend API with the cookie token
        const cookieTokenResult = await page.evaluate(async (token) => {
            try {
                const response = await fetch(`http://localhost:8080/api/chat/messages/alex.johnson`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                return {
                    success: response.ok,
                    status: response.status,
                    data: response.ok ? await response.json() : null
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }, accessToken);

        console.log('Cookie token result:', cookieTokenResult);

        console.log('=== STEP 3: Get fresh token from backend ===');

        // Get a fresh token directly from backend
        const freshTokenResult = await page.evaluate(async () => {
            try {
                const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usernameOrEmail: 'sarah.updated@example.com',
                        password: 'password123'
                    })
                });

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    const freshToken = loginData.accessToken;

                    console.log('Fresh token length:', freshToken.length);
                    console.log('Fresh token starts with:', freshToken.substring(0, 20) + '...');

                    // Test with fresh token
                    const response = await fetch(`http://localhost:8080/api/chat/messages/alex.johnson`, {
                        headers: {
                            'Authorization': `Bearer ${freshToken}`
                        }
                    });

                    return {
                        success: response.ok,
                        status: response.status,
                        data: response.ok ? await response.json() : null,
                        tokenLength: freshToken.length
                    };
                } else {
                    return {
                        success: false,
                        error: 'Failed to get fresh token'
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        });

        console.log('Fresh token result:', freshTokenResult);

        console.log('=== STEP 4: Compare tokens ===');

        if (accessToken && freshTokenResult.success) {
            console.log('Cookie token length:', accessToken.length);
            console.log('Fresh token length:', freshTokenResult.tokenLength);
            console.log('Tokens are same length:', accessToken.length === freshTokenResult.tokenLength);
            console.log('Tokens are identical:', accessToken === freshTokenResult.data?.accessToken);
        }

        // Take a screenshot
        await page.screenshot({ path: 'compare-tokens.png', fullPage: true });

        // Wait for user to see the browser
        await page.waitForTimeout(5000);

        console.log('=== SUMMARY ===');
        console.log('✅ Cookie token test:', cookieTokenResult.success);
        console.log('✅ Fresh token test:', freshTokenResult.success);

        // Final assertions
        expect(accessToken).toBeTruthy();
        expect(cookieTokenResult.success).toBeTruthy();
        expect(freshTokenResult.success).toBeTruthy();
    });
});
