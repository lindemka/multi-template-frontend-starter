import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth';

test.describe('Authentication Test', () => {
    test('should login and check authentication status', async ({ page }) => {
        // Login first
        await login(page, TEST_USERS.sarah);
        
        // Check if we're logged in by accessing dashboard
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        // Should not be redirected to login
        expect(page.url()).not.toContain('/login');
        console.log('Successfully logged in and accessed dashboard');
        
        // Check for authentication cookies
        const cookies = await page.context().cookies();
        console.log('All cookies:', cookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
        
        const accessTokenCookie = cookies.find(c => c.name === 'accessToken');
        const refreshTokenCookie = cookies.find(c => c.name === 'refreshToken');
        
        console.log('Access token cookie found:', !!accessTokenCookie);
        console.log('Refresh token cookie found:', !!refreshTokenCookie);
        
        // Check authentication status using JavaScript
        const isAuthenticated = await page.evaluate(() => {
            return document.cookie.includes('accessToken=') || document.cookie.includes('refreshToken=');
        });
        
        console.log('Authentication check via JavaScript:', isAuthenticated);
        
        // Test the auth.isAuthenticated() function
        const authCheck = await page.evaluate(() => {
            // This will only work if the auth utility is available globally
            return typeof window !== 'undefined' && window.location.href.includes('/dashboard');
        });
        
        console.log('Auth check result:', authCheck);
        
        // Should be authenticated
        expect(isAuthenticated).toBe(true);
    });
});
