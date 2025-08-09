import { test, expect } from '@playwright/test'

test.describe('Chat from profile', () => {
    test('start chat from profile drawer and exchange messages', async ({ browser }) => {
        const contextA = await browser.newContext()
        const contextB = await browser.newContext()

        const pageA = await contextA.newPage()
        const pageB = await contextB.newPage()

        // Seed users (ignore errors if exist)
        await pageA.request.post('http://localhost:3000/api/auth/register', {
            data: { username: 'sarah.chen', email: 'sarah.chen@example.com', password: 'password123', firstName: 'Sarah', lastName: 'Chen', confirmPassword: 'password123' }
        }).catch(() => { })
        await pageB.request.post('http://localhost:3000/api/auth/register', {
            data: { username: 'alex.johnson', email: 'alex.johnson@example.com', password: 'password123', firstName: 'Alex', lastName: 'Johnson', confirmPassword: 'password123' }
        }).catch(() => { })

        // Login as Sarah
        await pageA.goto('http://localhost:3000/login')
        await pageA.getByLabel('Username or Email').fill('sarah.chen')
        await pageA.getByLabel('Password').fill('password123')
        await pageA.getByRole('button', { name: 'Sign In' }).click()
        await pageA.waitForURL('**/dashboard')

        // Login as Alex
        await pageB.goto('http://localhost:3000/login')
        await pageB.getByLabel('Username or Email').fill('alex.johnson')
        await pageB.getByLabel('Password').fill('password123')
        await pageB.getByRole('button', { name: 'Sign In' }).click()
        await pageB.waitForURL('**/dashboard')

        // Sarah navigates to Members, opens Alex drawer and clicks chat button
        await pageA.goto('http://localhost:3000/dashboard/members')
        await pageA.getByText('Alex Johnson').first().click()
        // Click explicit message button in the drawer
        await pageA.getByRole('button', { name: /Message Alex Johnson/i }).click()

        // Ensure chat dock visible, send message (dock may already be open)
        const dockButton = pageA.getByRole('button', { name: 'Messages' })
        if (await dockButton.isVisible()) {
            await dockButton.click()
        }
        await pageA.getByPlaceholder('Write a message').fill('Hello from Sarah via profile!')
        await pageA.getByRole('button', { name: 'Send' }).click()

        // Alex opens dock and sees incoming message
        await pageB.getByRole('button', { name: 'Messages' }).click()
        await expect(pageB.getByText('sarah.chen: Hello from Sarah via profile!').first()).toBeVisible({ timeout: 10000 })

        // Alex replies
        await pageB.getByPlaceholder('Write a message').fill('Hi Sarah, received!')
        await pageB.getByRole('button', { name: 'Send' }).click()
        await expect(pageA.getByText('alex.johnson: Hi Sarah, received!').first()).toBeVisible({ timeout: 10000 })

        await contextA.close()
        await contextB.close()
    })
})


