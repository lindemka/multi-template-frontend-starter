import { test, expect } from '@playwright/test'

test.describe('Chat Avatar Check', () => {
    test('chat dock header shows proper avatar not just initials', async ({ page }) => {
        // Login first
        await page.goto('/')
        await page.click('text=/Login|Sign In|Get Started/i')
        await page.fill('input[name="username"]', 'sarah.chen@example.com')
        await page.fill('input[name="password"]', 'password123')
        await page.click('button[type="submit"]')
        await page.waitForURL('**/dashboard', { timeout: 10000 })
        
        await page.goto('/dashboard')
        await page.waitForLoadState('networkidle')

        // Open chat dock
        const chatButton = page.locator('[data-testid="chat-dock-trigger"], [aria-label*="Nachrichten"], div:has-text("Nachrichten")').first()
        await chatButton.click()
        
        // Wait for chat dock to open
        await page.waitForSelector('[data-testid="chat-dock"]', { timeout: 5000 })

        // Check the header avatar in the chat dock
        const headerAvatar = page.locator('[data-testid="chat-dock"] .border-b').first().locator('img[src*="pravatar"], img[src*="avatar"]').first()
        
        // Verify the avatar image is present and has a valid src
        const isVisible = await headerAvatar.isVisible().catch(() => false)
        if (isVisible) {
            const src = await headerAvatar.getAttribute('src')
            console.log('Chat dock header avatar src:', src)
            expect(src).toBeTruthy()
            expect(src).toMatch(/pravatar|avatar/)
        } else {
            // Check if initials are shown instead
            const initials = await page.locator('[data-testid="chat-dock"] .border-b').first().locator('text=/SC|S/').isVisible()
            if (initials) {
                throw new Error('Chat dock header is showing initials instead of avatar image!')
            }
        }

        // Also check the minimized chat button
        await page.keyboard.press('Escape') // Close chat dock
        await page.waitForTimeout(500)
        
        const minimizedAvatar = page.locator('div:has-text("Nachrichten")').locator('..').locator('img[src*="pravatar"], img[src*="avatar"]').first()
        const minimizedVisible = await minimizedAvatar.isVisible().catch(() => false)
        if (minimizedVisible) {
            const src = await minimizedAvatar.getAttribute('src')
            console.log('Minimized chat avatar src:', src)
            expect(src).toBeTruthy()
            expect(src).toMatch(/pravatar|avatar/)
        }
    })
})