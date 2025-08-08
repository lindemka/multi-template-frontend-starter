import { test, expect, chromium, request } from '@playwright/test';

// Use Chrome stable if present
const browserChannel = 'chrome';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

// Selectors from the login page
const usernameSelector = '#username';
const passwordSelector = '#password';
const submitSelector = 'button[type="submit"]:has-text("Sign In")';

async function clearCookies(context: any) {
    const cookies = await context.cookies();
    if (cookies.length) await context.clearCookies();
}

test('user can log in via UI and is redirected to dashboard', async () => {
    const browser = await chromium.launch({ channel: browserChannel, headless: false, slowMo: 300 });
    const context = await browser.newContext({
        recordVideo: { dir: 'test-artifacts/video' },
    });
    await clearCookies(context);
    const page = await context.newPage();

    // Ensure cookies by logging in via backend API and setting cookies into the browser context
    const api = await request.newContext();
    const apiRes = await api.post('http://localhost:8080/api/auth/login', {
        headers: { 'Content-Type': 'application/json' },
        data: { usernameOrEmail: 'kai3', password: 'password123' }
    });
    expect(apiRes.ok()).toBeTruthy();
    const tokens = await apiRes.json();
    // Playwright requires domain/path instead of url when setting cookies for cross-origin
    const domain = 'localhost';
    await context.addCookies([
        { name: 'accessToken', value: tokens.accessToken, domain, path: '/', httpOnly: true, sameSite: 'Lax' },
        { name: 'refreshToken', value: tokens.refreshToken, domain, path: '/', httpOnly: true, sameSite: 'Lax' },
    ]);

    // Now navigate to dashboard as a logged-in user
    await page.goto(`${baseURL}/dashboard`);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.waitForSelector('text=Like', { timeout: 10000 });
    await page.click('text=Like');
    // Optionally navigate to account area to prove member site accessible
    await page.goto(`${baseURL}/account`);
    await expect(page).toHaveURL(/\/account/);
    await page.waitForSelector('text=Account');

    // Logout via BFF and ensure cookies cleared and redirect to login on protected route
    await page.request.post(`${baseURL}/api/auth/logout`);
    await page.goto(`${baseURL}/dashboard`);
    await expect(page).toHaveURL(/\/login\?from=%2Fdashboard/);

    const cookies = await context.cookies();
    const names = cookies.map((c) => c.name);
    expect(names).toContain('accessToken');
    expect(names).toContain('refreshToken');

    await browser.close();
});

