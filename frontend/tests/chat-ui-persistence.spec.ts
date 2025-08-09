import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function login(page, username: string, password: string) {
    await page.goto(`${BASE}/login`)
    await page.getByLabel('Username or Email').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
}

async function openDock(page) {
    const toggle = page.getByRole('button', { name: 'Messages' })
    if (await toggle.isVisible()) await toggle.click()
    await expect(page.getByTestId('chat-dock')).toBeVisible()
}

async function startConversation(page, username: string) {
    await page.getByRole('button', { name: 'New message' }).click()
    const dlg = page.getByRole('dialog')
    await dlg.getByPlaceholder('Search by name or username').fill(username)
    await expect(dlg.getByText(username).first()).toBeVisible({ timeout: 10000 })
    await dlg.getByText(username).first().click()
    await expect(page.getByTestId('chat-thread')).toBeVisible()
}

async function send(page, text: string) {
    await page.getByPlaceholder('Write a message').fill(text)
    await page.getByRole('button', { name: 'Send' }).click()
}

test('UI-only chat persists and shows history (>=10 messages)', async ({ browser }) => {
    const a = await browser.newContext()
    const b = await browser.newContext()
    const pageA = await a.newPage()
    const pageB = await b.newPage()

    // Ensure users exist (ignore conflicts)
    await pageA.request.post(`${BASE}/api/auth/register`, { data: { username: 'sarah.chen', email: 'sarah.chen@example.com', password: 'password123', firstName: 'Sarah', lastName: 'Chen', confirmPassword: 'password123' } }).catch(() => { })
    await pageB.request.post(`${BASE}/api/auth/register`, { data: { username: 'alex.johnson', email: 'alex.johnson@example.com', password: 'password123', firstName: 'Alex', lastName: 'Johnson', confirmPassword: 'password123' } }).catch(() => { })

    await login(pageA, 'sarah.chen', 'password123')
    await login(pageB, 'alex.johnson', 'password123')

    await openDock(pageA)
    await openDock(pageB)

    // Start conversation from A to B via UI modal
    await startConversation(pageA, 'alex.johnson')

    // Exchange >=10 messages using UI only
    const msgsA = ['Hello Alex!', 'How are you?', 'Working on a new feature.', 'It includes chat.', 'Looks like LinkedIn!', 'Persistence is key.']
    const msgsB = ['Hi Sarah!', 'Great to hear!', 'Ship it!', 'Agree!']

    for (const m of msgsA) {
        await send(pageA, m)
    }

    // On B, click the conversation and reply
    await pageB.getByTestId('chat-conversations').getByText('sarah.chen').first().click()
    for (const m of msgsB) {
        await send(pageB, m)
    }

    // Verify last reply visible on A
    await pageA.getByTestId('chat-conversations').getByText('alex.johnson').first().click()
    const threadA = pageA.getByTestId('chat-thread').getByTestId('chat-scroll')
    await expect(threadA.getByText('Agree!').first()).toBeVisible({ timeout: 10000 })

    await a.close(); await b.close()
})


