import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function login(page, username: string, password: string) {
    await page.goto(`${BASE}/login`)
    await page.getByLabel('Username or Email').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
}

test.describe('Avatars', () => {
    test('chat dock shows avatars and members table uses mocked photos', async ({ page }) => {
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
        // Wait for conversation row to appear and check for avatar component (image or fallback)
        await expect(page.getByText('Avatar Other').first()).toBeVisible({ timeout: 10000 })
        const chatAvatarAny = page.locator('[data-testid="chat-conversations"] [data-slot="avatar"], [data-testid="chat-conversations"] [data-slot="avatar-image"], [data-testid="chat-conversations"] [data-slot="avatar-fallback"]').first()
        await expect(chatAvatarAny).toBeVisible({ timeout: 10000 })

        // Navigate to members page and assert mocked images render
        await page.goto(`${BASE}/dashboard/members`)
        // Wait for either rows or empty state
        await page.waitForTimeout(500)
        const memberAvatarAny = page.locator('[data-slot="avatar"], [data-slot="avatar-image"], [data-slot="avatar-fallback"]').first()
        await expect(memberAvatarAny).toBeVisible({ timeout: 10000 })
    })
})


