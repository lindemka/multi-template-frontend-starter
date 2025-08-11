import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function ensureLoggedOut(page) {
    try { await page.request.post(`${BASE}/api/auth/logout`) } catch { }
    try { await page.context().clearCookies() } catch { }
    try { await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }) } catch { }
}

async function login(page, username: string, password: string) {
    await ensureLoggedOut(page)
    await page.goto(`${BASE}/login`)
    if (page.url().includes('/dashboard')) {
        await ensureLoggedOut(page)
        await page.goto(`${BASE}/login`)
    }
    await page.getByLabel('Username or Email').waitFor({ state: 'visible' })
    await page.getByLabel('Password').waitFor({ state: 'visible' })
    await page.getByLabel('Username or Email').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
}

test.describe('Avatars', () => {
    test('chat dock shows DB avatar images and members table shows images', async ({ page }) => {
        // Create user and login
        await page.request.post(`${BASE}/api/auth/register`, {
            data: { username: 'avatar.tester', email: 'avatar.tester@example.com', password: 'password123', firstName: 'Avatar', lastName: 'Tester', confirmPassword: 'password123' }
        }).catch(() => { })
        await login(page, 'avatar.tester', 'password123')
        // Seed another user so the members list is non-empty and excludes current
        await page.request.post(`${BASE}/api/auth/register`, {
            data: { username: 'avatar.other', email: 'avatar.other@example.com', password: 'password123', firstName: 'Avatar', lastName: 'Other', confirmPassword: 'password123' }
        }).catch(() => { })

        // Seed conversation so list has an entry
        await page.evaluate(async () => {
            await fetch('/api/chat/conversations/avatar.other/ensure', { method: 'POST' })
            await fetch('/api/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: 'avatar.other', content: 'Hello' }) })
        })
        // Open messages dock
        const toggle = page.getByRole('button', { name: 'Messages' })
        if (await toggle.count()) {
            if (await toggle.isVisible()) await toggle.click()
        }
        // Wait for conversation row to appear
        await expect(page.getByText('Avatar Other').first()).toBeVisible({ timeout: 10000 })
        // Assert the conversation entry renders an <img> with a real src (DB photo if available; else deterministic photo fallback)
        const convoRow = page.locator('[data-testid="chat-conversations"] button').filter({ hasText: 'Avatar Other' }).first()
        const img = convoRow.locator('[data-slot="avatar-image"]').first()
        await expect(img).toHaveAttribute('src', /https?:\/\//)

        // Navigate to members page and assert avatar images render with non-empty src
        await page.goto(`${BASE}/dashboard/members`)
        await page.waitForTimeout(300)
        const memberImg = page.locator('[data-slot="avatar-image"]').first()
        await expect(memberImg).toHaveAttribute('src', /^https?:\/\//)
    })
})


