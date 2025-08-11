import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test('manual avatar verification', async ({ page }) => {
    // Go to login page
    await page.goto(`${BASE}/login`)
    console.log('On login page:', page.url())

    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'test-artifacts/login-page.png' })

    // Try to login with sarah.chen
    await page.getByLabel('Username or Email').fill('sarah.chen')
    await page.getByLabel('Password').fill('password123')

    // Take screenshot before clicking
    await page.screenshot({ path: 'test-artifacts/before-login.png' })

    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Wait a bit and see where we are
    await page.waitForTimeout(3000)
    console.log('After login attempt:', page.url())

    // Take screenshot after login attempt
    await page.screenshot({ path: 'test-artifacts/after-login.png' })

    // If we're on the dashboard, check avatars
    if (page.url().includes('dashboard')) {
        console.log('Successfully logged in!')

        // Look for avatar images
        const avatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`Found ${avatars.length} avatar images`)

        for (let i = 0; i < Math.min(3, avatars.length); i++) {
            const src = await avatars[i].getAttribute('src')
            console.log(`Avatar ${i + 1}: ${src}`)

            // Check if it's a pravatar image
            if (src?.includes('pravatar.cc')) {
                console.log('  ✅ This is a pravatar photo')
            } else if (src?.includes('ui-avatars.com')) {
                console.log('  ❌ This is still using initials')
            } else {
                console.log('  ℹ️ Unknown avatar source')
            }
        }

        // Navigate to members page
        await page.goto(`${BASE}/dashboard/members`)
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'test-artifacts/members-page.png' })

        const memberAvatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`\nMembers page: Found ${memberAvatars.length} avatar images`)

        for (let i = 0; i < Math.min(3, memberAvatars.length); i++) {
            const src = await memberAvatars[i].getAttribute('src')
            console.log(`Member avatar ${i + 1}: ${src}`)
            if (src?.includes('pravatar.cc')) {
                console.log('  ✅ This is a pravatar photo')
            }
        }

        // Open chat
        const messagesBtn = page.getByRole('button', { name: 'Messages' })
        if (await messagesBtn.count() > 0) {
            await messagesBtn.click()
            await page.waitForTimeout(2000)
            await page.screenshot({ path: 'test-artifacts/chat-dock.png' })

            const chatAvatars = await page.locator('[data-slot="avatar-image"]').all()
            console.log(`\nWith chat open: Found ${chatAvatars.length} avatar images`)
        }
    } else {
        console.log('Login failed or redirected to:', page.url())
        const errorMsg = await page.locator('.text-red-500, .text-destructive').textContent().catch(() => null)
        if (errorMsg) {
            console.log('Error message:', errorMsg)
        }
    }
})
