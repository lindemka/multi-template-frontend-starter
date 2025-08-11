import { test, expect } from '@playwright/test';

test.describe('Chat Authentication', () => {
  test('chat components should not appear when not logged in', async ({ page, context }) => {
    // Clear any existing cookies to ensure we're logged out
    await context.clearCookies();
    
    // Go directly to dashboard (which should have chat components)
    await page.goto('http://localhost:3000/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    
    // Verify chat dock is not present
    const chatDock = page.locator('[data-testid="chat-dock"]');
    await expect(chatDock).not.toBeVisible();
    
    // Verify no chat-related elements are visible
    const chatElements = page.locator('.chat-dock, [aria-label="Messages"], [aria-label="New message"]');
    await expect(chatElements).toHaveCount(0);
  });

  test('chat components should appear after login', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/login');
    
    // Login as Sarah Chen
    await page.fill('input#username', 'sarah.chen@example.com');
    await page.fill('input#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard/**', { timeout: 5000 }).catch(() => {
      console.log('Navigation to dashboard did not happen');
    });
    
    // Now chat components should be available (minimized by default)
    const messagesButton = page.locator('[aria-label="Messages"]');
    
    // Wait for the chat component to initialize (it needs to fetch user data first)
    await page.waitForTimeout(2000);
    
    // Check if messages button exists (it might be visible or hidden depending on state)
    const chatInitialized = await messagesButton.count() > 0 || await page.locator('[data-testid="chat-dock"]').count() > 0;
    expect(chatInitialized).toBeTruthy();
  });

  test('chat API endpoints should return 401/403 when not authenticated', async ({ page, context }) => {
    // Clear cookies to ensure we're logged out
    await context.clearCookies();
    
    // Navigate to a page first
    await page.goto('http://localhost:3000/login');
    
    // Try to access chat endpoints directly
    const conversationsResponse = await page.evaluate(async () => {
      const response = await fetch('http://localhost:3000/api/chat/conversations', {
        credentials: 'include'
      });
      return {
        status: response.status,
        ok: response.ok
      };
    });
    
    // Should get 401 or 403
    expect([401, 403]).toContain(conversationsResponse.status);
    expect(conversationsResponse.ok).toBeFalsy();
    
    // Try WebSocket ticket endpoint
    const wsTicketResponse = await page.evaluate(async () => {
      const response = await fetch('http://localhost:3000/api/chat/ws-ticket', {
        credentials: 'include'
      });
      return {
        status: response.status,
        ok: response.ok
      };
    });
    
    // Should get 401 or 403
    expect([401, 403]).toContain(wsTicketResponse.status);
    expect(wsTicketResponse.ok).toBeFalsy();
  });
});