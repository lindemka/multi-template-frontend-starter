import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function login(page, username: string, password: string) {
    await page.goto(`${BASE}/login`)
    await page.getByLabel('Username or Email').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
}

async function logout(page) {
    await page.request.post(`${BASE}/api/auth/logout`).catch(() => { })
}

async function openDockIfNeeded(page) {
    const toggle = page.getByRole('button', { name: 'Messages' })
    if (await toggle.count()) {
        if (await toggle.isVisible()) {
            await toggle.click()
        }
    }
}

test.describe('Chat persistence like LinkedIn', () => {
    test('chat persists across logouts and reloads for both users', async ({ browser }) => {
        const contextA = await browser.newContext()
        const contextB = await browser.newContext()

        const pageA = await contextA.newPage()
        const pageB = await contextB.newPage()

        // Ensure users exist (ignore if already registered)
        await pageA.request.post(`${BASE}/api/auth/register`, {
            data: { username: 'sarah.chen', email: 'sarah.chen@example.com', password: 'password123', firstName: 'Sarah', lastName: 'Chen', confirmPassword: 'password123' }
        }).catch(() => { })
        await pageB.request.post(`${BASE}/api/auth/register`, {
            data: { username: 'alex.johnson', email: 'alex.johnson@example.com', password: 'password123', firstName: 'Alex', lastName: 'Johnson', confirmPassword: 'password123' }
        }).catch(() => { })

        // Login both
        await login(pageA, 'sarah.chen', 'password123')
        await login(pageB, 'alex.johnson', 'password123')

        // Open dock
        await openDockIfNeeded(pageA)
        await openDockIfNeeded(pageB)

        // Seed a conversation via REST (ensures persistence and left-list entry)
        await pageA.evaluate(async () => {
            await fetch('/api/chat/conversations/alex.johnson/ensure', { method: 'POST' })
            await fetch('/api/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: 'alex.johnson', content: 'Hello Alex!' }) })
        })

        // B opens thread and sees the message
        await expect(pageB.getByText('sarah.chen').first()).toBeVisible({ timeout: 10000 })
        await pageB.getByText('sarah.chen').first().click()
        // Scope assertions to the thread area to avoid collisions
        const threadB = pageB.locator('[data-testid="chat-thread"] [data-testid="chat-scroll"]')
        await expect(threadB.locator('[data-testid="chat-msg"]').getByText('Hello Alex!').first()).toBeVisible({ timeout: 10000 })

        // B replies via UI
        await pageB.getByPlaceholder('Write a message').fill('Hi Sarah!')
        await pageB.getByRole('button', { name: 'Send' }).click()

        // A ensures dock open and thread selected and sees persisted reply
        await openDockIfNeeded(pageA)
        // If not selected, click the conversation entry
        await expect(pageA.getByText('alex.johnson').first()).toBeVisible({ timeout: 10000 })
        await pageA.getByText('alex.johnson').first().click()
        const threadA = pageA.locator('[data-testid="chat-thread"] [data-testid="chat-scroll"]')
        await expect(threadA.locator('[data-testid="chat-msg"]').getByText('Hi Sarah!').first()).toBeVisible({ timeout: 10000 })

        // Logout both
        await logout(pageA)
        await logout(pageB)

        // Login again and verify history persists
        await login(pageA, 'sarah.chen', 'password123')
        await login(pageB, 'alex.johnson', 'password123')

        await openDockIfNeeded(pageA)
        await expect(pageA.getByText('alex.johnson').first()).toBeVisible({ timeout: 10000 })
        await pageA.getByText('alex.johnson').first().click()
        await expect(threadA.locator('[data-testid="chat-msg"]').getByText('Hello Alex!').first()).toBeVisible({ timeout: 10000 })
        await expect(threadA.locator('[data-testid="chat-msg"]').getByText('Hi Sarah!').first()).toBeVisible({ timeout: 10000 })

        await openDockIfNeeded(pageB)
        await expect(pageB.getByText('sarah.chen').first()).toBeVisible({ timeout: 10000 })
        await pageB.getByText('sarah.chen').first().click()
        await expect(threadB.locator('[data-testid="chat-msg"]').getByText('Hello Alex!').first()).toBeVisible({ timeout: 10000 })
        await expect(threadB.locator('[data-testid="chat-msg"]').getByText('Hi Sarah!').first()).toBeVisible({ timeout: 10000 })

        await contextA.close()
        await contextB.close()
    })
})


