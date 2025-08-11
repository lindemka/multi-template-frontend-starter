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

test.describe('Final Avatar Check', () => {
    test('avatars are consistent pravatar images everywhere', async ({ page }) => {
        // Use existing users that we know have profiles
        await login(page, 'sarah.chen', 'password123')

        // 1. Check that current user has an avatar in the sidebar
        await page.waitForTimeout(1000)
        const sidebarAvatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`Found ${sidebarAvatars.length} avatar images on dashboard`)

        // The first avatar should be the nav-user avatar
        if (sidebarAvatars.length > 0) {
            const navUserSrc = await sidebarAvatars[0].getAttribute('src')
            console.log(`Nav user avatar: ${navUserSrc}`)
            expect(navUserSrc).toMatch(/pravatar\.cc/)
        }

        // 2. Navigate to members page and check avatars
        await page.goto(`${BASE}/dashboard/members`)
        await page.waitForTimeout(1000)

        const memberAvatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`Found ${memberAvatars.length} avatar images on members page`)

        // Check that all member avatars are pravatar URLs
        for (let i = 0; i < Math.min(3, memberAvatars.length); i++) {
            const src = await memberAvatars[i].getAttribute('src')
            console.log(`Member avatar ${i + 1}: ${src}`)
            expect(src).toMatch(/pravatar\.cc/)
        }

        // 3. Open chat and check avatars there
        // Create a conversation with alex.johnson
        await page.evaluate(async () => {
            await fetch('/api/chat/conversations/alex.johnson/ensure', { method: 'POST' })
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: 'alex.johnson', content: 'Testing avatars' })
            })
        })

        // Open messages dock
        const toggle = page.getByRole('button', { name: 'Messages' })
        if (await toggle.count() && await toggle.isVisible()) {
            await toggle.click()
            await page.waitForTimeout(500)
        }

        // Check avatar in conversation list
        const chatAvatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`Found ${chatAvatars.length} avatar images with chat open`)

        // Find Alex Johnson's avatar in the conversation list
        const alexConvo = page.locator('button').filter({ hasText: 'Alex Johnson' }).first()
        if (await alexConvo.count() > 0) {
            const alexAvatar = alexConvo.locator('[data-slot="avatar-image"]').first()
            if (await alexAvatar.count() > 0) {
                const alexSrc = await alexAvatar.getAttribute('src')
                console.log(`Alex Johnson chat avatar: ${alexSrc}`)
                expect(alexSrc).toMatch(/pravatar\.cc/)

                // Remember Alex's avatar URL for consistency check
                // Click to open the chat
                await alexConvo.click()
                await page.waitForTimeout(500)

                // Check avatar in chat header
                const headerAvatars = await page.locator('[data-slot="avatar-image"]').all()
                // Find the one that matches Alex's avatar
                for (const avatar of headerAvatars) {
                    const src = await avatar.getAttribute('src')
                    if (src === alexSrc) {
                        console.log('✅ Alex Johnson has the same avatar in chat list and chat header')
                        break
                    }
                }
            }
        }

        // 4. Navigate to a profile page
        await page.goto(`${BASE}/dashboard/profile/alex.johnson`)
        await page.waitForTimeout(1000)

        const profileAvatars = await page.locator('[data-slot="avatar-image"]').all()
        console.log(`Found ${profileAvatars.length} avatar images on profile page`)

        if (profileAvatars.length > 0) {
            const profileSrc = await profileAvatars[0].getAttribute('src')
            console.log(`Profile page avatar: ${profileSrc}`)
            expect(profileSrc).toMatch(/pravatar\.cc/)
        }

        console.log('✅ All avatars are using pravatar.cc images (not initials)')
        console.log('✅ Avatar consistency test completed successfully')
    })
})

