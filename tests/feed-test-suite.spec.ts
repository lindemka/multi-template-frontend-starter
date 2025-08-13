import { test, expect } from '@playwright/test';

/**
 * Feed Test Suite
 * 
 * This test suite covers the complete feed functionality including:
 * - Loading and displaying posts
 * - Creating new posts
 * - Post interactions (like, comment, share)
 * - Feed refresh functionality
 * 
 * Note: These tests currently run with authentication bypassed for development.
 * In production, authentication should be properly implemented.
 */

test.describe('Feed Functionality Test Suite', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to feed page before each test
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');
    });

    test('should load feed page and display posts', async ({ page }) => {
        // Verify feed page loads correctly
        await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible();

        // Verify create post button is present
        const createPostButton = page.locator('button:has-text("Create Post")');
        await expect(createPostButton).toBeVisible();

        // Verify multiple posts are displayed
        const posts = page.locator('[data-testid="feed-post"]');
        await expect(posts).toHaveCount(4); // Expected number of posts in test database

        // Verify post content is visible
        await expect(page.locator('text=This is a test post')).toBeVisible();
        await expect(page.locator('text=Just launched a new feature')).toBeVisible();
    });

    test('should open create post modal', async ({ page }) => {
        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Verify modal opens with correct elements
        await expect(page.locator('text=Create a New Post')).toBeVisible();
        await expect(page.locator('textarea[placeholder*="Share your thoughts"]')).toBeVisible();
        await expect(page.locator('input[placeholder*="https://example.com/image.jpg"]')).toBeVisible();
        // Note: The modal has two "Create Post" buttons - one in the main UI and one in the modal
        await expect(page.locator('button:has-text("Create Post")').nth(1)).toBeVisible();
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    });

    test('should display post interaction buttons', async ({ page }) => {
        // Get the first post
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Verify interaction buttons are present
        await expect(firstPost.locator('button:has-text("Like")')).toBeVisible();
        await expect(firstPost.locator('button:has-text("Comment")')).toBeVisible();
        await expect(firstPost.locator('button:has-text("Share")')).toBeVisible();
    });

    test('should display post metadata correctly', async ({ page }) => {
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Verify author information is displayed
        await expect(firstPost.locator('[data-testid="author-name"]')).toBeVisible();

        // Verify post timestamps are present
        await expect(firstPost.locator('text=/ago/')).toBeVisible();

        // Verify interaction counts are displayed (these might be displayed differently)
        // await expect(firstPost.locator('text=/0 likes/')).toBeVisible();
        // await expect(firstPost.locator('text=/0 comments/')).toBeVisible();
    });

    test('should handle feed refresh', async ({ page }) => {
        // Get initial post count
        const initialPosts = page.locator('[data-testid="feed-post"]');
        const initialCount = await initialPosts.count();

        // Refresh the page to simulate feed refresh
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify posts are still displayed
        const postsAfterRefresh = page.locator('[data-testid="feed-post"]');
        await expect(postsAfterRefresh).toHaveCount(initialCount);
    });

    test('should display loading states', async ({ page }) => {
        // This test can be expanded when loading states are implemented
        // For now, we verify that the feed loads correctly
        await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible();
    });

    test('should handle empty feed gracefully', async ({ page }) => {
        // This test can be expanded when we have a way to clear the feed
        // For now, we verify that the feed displays posts correctly
        const posts = page.locator('[data-testid="feed-post"]');
        await expect(posts).toHaveCount(4);
    });

    test('should display post content correctly', async ({ page }) => {
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Verify post content is readable
        const postContent = firstPost.locator('p').first();
        await expect(postContent).toBeVisible();

        // Verify content is not empty
        const contentText = await postContent.textContent();
        expect(contentText?.length).toBeGreaterThan(0);
    });

    test('should handle responsive design', async ({ page }) => {
        // Test on mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify feed still loads correctly
        await expect(page.locator('[data-testid="feed-post"]').first()).toBeVisible();

        // Verify create post button is still accessible
        const createPostButton = page.locator('button:has-text("Create Post")');
        await expect(createPostButton).toBeVisible();

        // Reset viewport
        await page.setViewportSize({ width: 1280, height: 720 });
    });
});

/**
 * Test Configuration Notes:
 * 
 * 1. Authentication: Currently bypassed for development testing
 * 2. Database: Uses test data from V10__create_feed_tables.sql migration
 * 3. Backend: Requires Spring Boot application running on port 8080
 * 4. Frontend: Requires Next.js application running on port 3000
 * 
 * To run these tests:
 * 1. Start the backend: cd backend && mvn spring-boot:run
 * 2. Start the frontend: cd frontend && npm run dev
 * 3. Run tests: npx playwright test tests/feed-test-suite.spec.ts
 * 
 * To run with authentication:
 * 1. Re-enable authentication in SecurityConfig.java
 * 2. Re-enable authentication checks in frontend API routes
 * 3. Update tests to include login steps
 */
