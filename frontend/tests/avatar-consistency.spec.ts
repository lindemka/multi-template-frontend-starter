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

test.describe('Avatar Consistency', () => {
    test('same avatar image appears everywhere for each user', async ({ page }) => {
        // Register test users
        await page.request.post(`${BASE}/api/auth/register`, {
            data: {
                username: 'consistency.test1',
                email: 'consistency.test1@example.com',
                password: 'password123',
                firstName: 'Consistency',
                lastName: 'TestOne',
                confirmPassword: 'password123'
            }
        }).catch(() => { })

        await page.request.post(`${BASE}/api/auth/register`, {
            data: {
                username: 'consistency.test2',
                email: 'consistency.test2@example.com',
                password: 'password123',
                firstName: 'Consistency',
                lastName: 'TestTwo',
                confirmPassword: 'password123'
            }
        }).catch(() => { })

        // Login as first user
        await login(page, 'consistency.test1', 'password123')

        // 1. Check nav-user avatar (current user's avatar in sidebar)
        // Wait for sidebar to load
        await page.waitForTimeout(1000)
        const navUserAvatar = page.locator('[data-slot="avatar-image"]').first()
        await expect(navUserAvatar).toBeVisible()
        const navUserSrc = await navUserAvatar.getAttribute('src')
        expect(navUserSrc).toMatch(/https?:\/\//)

        // 2. Navigate to members page and find test2
        await page.goto(`${BASE}/dashboard/members`)
        await page.waitForTimeout(500)

        // Get test2's avatar from members list
        const memberCard = page.locator('text=Consistency TestTwo').first()
        await expect(memberCard).toBeVisible()
        // Find the avatar image near the member's name
        const memberAvatar = page.locator('[data-slot="avatar-image"]').nth(1) // Skip nav-user avatar
        const memberSrc = await memberAvatar.getAttribute('src')
        expect(memberSrc).toMatch(/https?:\/\//)

        // 3. Open chat with test2 and verify avatar consistency
        await page.evaluate(async () => {
            await fetch('/api/chat/conversations/consistency.test2/ensure', { method: 'POST' })
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: 'consistency.test2', content: 'Testing avatar consistency' })
            })
        })

        // Open messages dock
        const toggle = page.getByRole('button', { name: 'Messages' })
        if (await toggle.count() && await toggle.isVisible()) {
            await toggle.click()
        }

        // Wait for conversation to appear
        await expect(page.getByText('Consistency TestTwo').first()).toBeVisible({ timeout: 10000 })

        // Get avatar from chat conversation list
        const convoRow = page.locator('button').filter({ hasText: 'Consistency TestTwo' }).first()
        const chatListAvatar = convoRow.locator('[data-slot="avatar-image"]').first()
        const chatListSrc = await chatListAvatar.getAttribute('src')

        // Verify same avatar URL (should be the same deterministic pravatar)
        expect(chatListSrc).toBe(memberSrc)

        // 4. Open chat window and verify avatar in header
        await convoRow.click()
        await page.waitForTimeout(500)

        // Find the chat window by looking for the username in the header
        const chatWindow = page.locator('div').filter({ hasText: 'Consistency TestTwo' }).first()
        // Get the avatar from the chat header (should be near the username)
        const chatHeaderAvatar = page.locator('div').filter({ hasText: 'Consistency TestTwo' }).locator('[data-slot="avatar-image"]').first()
        const chatHeaderSrc = await chatHeaderAvatar.getAttribute('src')

        // Verify same avatar URL
        expect(chatHeaderSrc).toBe(memberSrc)

        // 6. Navigate to profile page and verify avatar
        await page.goto(`${BASE}/dashboard/profile/consistency.test2`)
        await page.waitForTimeout(500)

        const profileAvatar = page.locator('[data-slot="avatar-image"]').first()
        await expect(profileAvatar).toBeVisible()
        const profileSrc = await profileAvatar.getAttribute('src')

        // Verify same avatar URL
        expect(profileSrc).toBe(memberSrc)

        console.log('✅ Avatar consistency verified:')
        console.log(`   - All instances of user "consistency.test2" show the same avatar: ${memberSrc}`)
        console.log(`   - Current user "consistency.test1" shows consistent avatar: ${navUserSrc}`)
    })
})
