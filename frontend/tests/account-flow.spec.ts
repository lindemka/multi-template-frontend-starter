import { test, expect, chromium } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'
const browserChannel = 'chrome'

test('account flow: login -> account hub -> email -> security -> username -> logout redirect', async () => {
    const browser = await chromium.launch({ channel: browserChannel, headless: false, slowMo: 200 })
    const context = await browser.newContext({ recordVideo: { dir: 'test-artifacts/video' } })
    const page = await context.newPage()

    // Go to login
    await page.goto(`${baseURL}/login`)

    // Fill login form with seeded user
    await page.fill('#username', 'sarah.chen')
    await page.fill('#password', 'password123')
    await page.click('button:has-text("Sign In")')

    // Expect redirect to dashboard
    await page.waitForURL(/\/dashboard/)

    // Navigate to account hub
    await page.goto(`${baseURL}/account`)
    await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Edit profile' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Open profile' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Change email' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Change password' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Change username' })).toBeVisible()

    // Open Edit Profile modal and close it
    await page.click('button:has-text("Edit profile")')
    await expect(page.getByRole('heading', { name: /^Edit$/ })).toBeVisible()
    await page.click('button:has-text("Cancel")')

    // Go to change email
    await page.click('a:has-text("Change email")')
    await page.waitForURL(/\/account\/email/)
    await expect(page.getByText('Change email')).toBeVisible()

    // Back to account then go to security
    await page.goto(`${baseURL}/account`)
    await page.click('a:has-text("Change password")')
    await page.waitForURL(/\/account\/security/)
    await expect(page.getByText('Change password')).toBeVisible()

    // Back to account then go to username
    await page.goto(`${baseURL}/account`)
    await page.click('a:has-text("Change username")')
    await page.waitForURL(/\/account\/username/)
    await expect(page.getByText('Change Username')).toBeVisible()

    // Logout via API and verify redirect on protected route
    await page.request.post(`${baseURL}/api/auth/logout`)
    await page.goto(`${baseURL}/account`)
    await page.waitForURL(/\/login\?from=%2Faccount/)

    await browser.close()
})


