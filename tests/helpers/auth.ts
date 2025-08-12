import { Page, expect } from '@playwright/test';

export interface TestUser {
    username: string;
    email: string;
    password: string;
    role: string;
}

export const TEST_USERS: Record<string, TestUser> = {
    sarah: {
        username: 'sarah.chen',
        email: 'sarah.updated@example.com',
        password: 'password123',
        role: 'USER'
    },
    alex: {
        username: 'alex.johnson',
        email: 'alex.johnson@example.com',
        password: 'password123',
        role: 'USER'
    },
    maria: {
        username: 'maria.garcia',
        email: 'maria.garcia@example.com',
        password: 'password123',
        role: 'USER'
    },
    james: {
        username: 'james.kim',
        email: 'james.kim@example.com',
        password: 'password123',
        role: 'USER'
    },
    kai: {
        username: 'kai3',
        email: 'kai3@example.com',
        password: 'password123',
        role: 'USER'
    }
};

/**
 * Login using UI form (more reliable for testing the actual user experience)
 */
export async function login(page: Page, user: TestUser = TEST_USERS.sarah): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await page.goto('/login');
            await page.waitForLoadState('networkidle');

            // Wait for the login form to be visible
            await page.waitForSelector('input[id="username"]', { timeout: 10000 });
            await page.waitForSelector('input[id="password"]', { timeout: 10000 });

            // Fill in credentials - use email as usernameOrEmail
            await page.fill('input[id="username"]', user.email);
            await page.fill('input[id="password"]', user.password);

            // Listen for the login response
            const loginPromise = page.waitForResponse(response =>
                response.url().includes('/api/auth/login') && response.request().method() === 'POST'
            );

            // Submit form
            await page.click('button[type="submit"]');

            // Wait for the login response
            const loginResponse = await loginPromise;

            if (!loginResponse.ok()) {
                // If it's a rate limit error, wait longer and retry
                if (loginResponse.status() === 429) {
                    console.log(`Rate limited on attempt ${attempt}, waiting 5 seconds...`);
                    await page.waitForTimeout(5000);
                    continue;
                }
                throw new Error(`Login failed: ${loginResponse.status()} ${loginResponse.statusText()}`);
            }

            // Wait for the response to complete
            await page.waitForLoadState('networkidle');

            // Check if we have the authentication cookies
            const cookies = await page.context().cookies();
            const hasAccessToken = cookies.some(cookie => cookie.name === 'accessToken');
            const hasRefreshToken = cookies.some(cookie => cookie.name === 'refreshToken');

            if (!hasAccessToken && !hasRefreshToken) {
                throw new Error('No authentication cookies found after login');
            }

            // Now navigate to dashboard to verify login worked
            await page.goto('/dashboard');
            await page.waitForLoadState('networkidle');

            // If we're still on login page, login failed
            if (page.url().includes('/login')) {
                throw new Error('Login failed: Still redirected to login page');
            }

            // Add a longer delay to help with rate limiting
            await page.waitForTimeout(3000);

            // If we get here, login was successful
            return;

        } catch (error) {
            lastError = error as Error;
            console.log(`Login attempt ${attempt} failed: ${error}`);

            if (attempt < maxRetries) {
                // Wait before retrying
                await page.waitForTimeout(2000 * attempt);
            }
        }
    }

    // If we get here, all attempts failed
    throw lastError || new Error('Login failed after all retry attempts');
}

/**
 * Login using username instead of email
 */
export async function loginWithUsername(page: Page, user: TestUser = TEST_USERS.sarah): Promise<void> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Wait for the login form to be visible
    await page.waitForSelector('input[id="username"]', { timeout: 10000 });
    await page.waitForSelector('input[id="password"]', { timeout: 10000 });

    // Fill in credentials
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);

    // Listen for the login response
    const loginPromise = page.waitForResponse(response =>
        response.url().includes('/api/auth/login') && response.request().method() === 'POST'
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for the login response
    const loginResponse = await loginPromise;

    if (!loginResponse.ok()) {
        throw new Error(`Login failed: ${loginResponse.status()} ${loginResponse.statusText()}`);
    }

    // Wait for the response to complete
    await page.waitForLoadState('networkidle');

    // Check if we have the authentication cookies
    const cookies = await page.context().cookies();
    const hasAccessToken = cookies.some(cookie => cookie.name === 'accessToken');
    const hasRefreshToken = cookies.some(cookie => cookie.name === 'refreshToken');

    if (!hasAccessToken && !hasRefreshToken) {
        throw new Error('No authentication cookies found after login');
    }

    // Now navigate to dashboard to verify login worked
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // If we're still on login page, login failed
    if (page.url().includes('/login')) {
        throw new Error('Login failed: Still redirected to login page');
    }

    // Add a longer delay to help with rate limiting
    await page.waitForTimeout(3000);
}

/**
 * Logout by navigating to logout endpoint
 */
export async function logout(page: Page): Promise<void> {
    // Call the logout API to clear cookies
    const logoutResponse = await page.request.post('/api/auth/logout');
    if (!logoutResponse.ok()) {
        throw new Error(`Logout failed: ${logoutResponse.status()}`);
    }

    // Clear cookies from the page context as well
    await page.context().clearCookies();

    // Navigate to login page to verify logout worked
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
}

/**
 * Check if user is logged in by trying to access dashboard
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    try {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        return !page.url().includes('/login');
    } catch {
        return false;
    }
}

/**
 * Ensure user is logged in, login if not
 */
export async function ensureLoggedIn(page: Page, user: TestUser = TEST_USERS.sarah): Promise<void> {
    if (!(await isLoggedIn(page))) {
        await login(page, user);
    }
}

/**
 * Test login failure with invalid credentials
 */
export async function testLoginFailure(page: Page, username: string, password: string): Promise<void> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill in invalid credentials
    await page.fill('input[id="username"]', username);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for response
    await page.waitForLoadState('networkidle');

    // Should stay on login page or show error
    await expect(page).not.toHaveURL('**/dashboard');
}

/**
 * Get auth token for API testing by using the backend directly
 */
export async function getAuthToken(page: Page, user: TestUser = TEST_USERS.sarah): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Use backend API directly to avoid rate limiting
            const loginResponse = await page.request.post('http://localhost:8080/api/auth/login', {
                data: {
                    usernameOrEmail: user.email,
                    password: user.password
                }
            });

            if (!loginResponse.ok()) {
                // If it's a rate limit error, wait longer and retry
                if (loginResponse.status() === 429) {
                    console.log(`API rate limited on attempt ${attempt}, waiting 5 seconds...`);
                    await page.waitForTimeout(5000);
                    continue;
                }
                throw new Error(`Failed to get auth token via backend API: ${loginResponse.status()}`);
            }

            const loginData = await loginResponse.json();

            if (!loginData.accessToken) {
                throw new Error('No access token received from backend API');
            }

            return loginData.accessToken;

        } catch (error) {
            lastError = error as Error;
            console.log(`getAuthToken attempt ${attempt} failed: ${error}`);

            if (attempt < maxRetries) {
                // Wait before retrying
                await page.waitForTimeout(2000 * attempt);
            }
        }
    }

    // If we get here, all attempts failed
    throw lastError || new Error('Failed to get auth token after all retry attempts');
}
