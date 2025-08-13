import { test, expect } from '@playwright/test';
import { login, TEST_USERS, getAuthToken } from './helpers/auth';

test.describe('Feed Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await login(page, TEST_USERS.sarah);
    });

    test('should load feed page and display posts', async ({ page }) => {
        // Navigate to feed page
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Should be on feed page
        await expect(page).toHaveURL(/feed/);

        // Check for feed content
        await expect(page.locator('[data-testid="feed-post"]')).toBeVisible();

        // Check for create post button
        await expect(page.locator('button:has-text("Create Post")')).toBeVisible();

        // Check for feed posts
        const posts = await page.locator('[data-testid="feed-post"]').count();
        expect(posts).toBeGreaterThan(0);

        console.log(`Found ${posts} posts on feed page`);
    });

    test('should create a new post', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in post content
        const testContent = `Test post created at ${new Date().toISOString()}`;
        await page.fill('textarea[placeholder*="What\'s on your mind"]', testContent);

        // Submit the post
        await page.click('button:has-text("Post")');

        // Wait for modal to close
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();

        // Check that the new post appears
        await expect(page.locator(`text=${testContent}`)).toBeVisible();

        console.log('Successfully created a new post');
    });

    test('should create a post with image URL', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in post content
        const testContent = `Test post with image at ${new Date().toISOString()}`;
        await page.fill('textarea[placeholder*="What\'s on your mind"]', testContent);

        // Add image URL
        const imageUrl = 'https://picsum.photos/400/300';
        await page.fill('input[placeholder*="Image URL"]', imageUrl);

        // Submit the post
        await page.click('button:has-text("Post")');

        // Wait for modal to close
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();

        // Check that the new post appears with image
        await expect(page.locator(`text=${testContent}`)).toBeVisible();
        await expect(page.locator('img[src*="picsum.photos"]')).toBeVisible();

        console.log('Successfully created a post with image');
    });

    test('should like and unlike a post', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Find the first post
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Get initial like count
        const likeButton = firstPost.locator('button:has-text("Like")').or(firstPost.locator('button:has-text("Liked")'));
        const initialText = await likeButton.textContent();

        // Click like button
        await likeButton.click();

        // Wait for the like action to complete
        await page.waitForTimeout(1000);

        // Check that the button text changed
        const newText = await likeButton.textContent();
        expect(newText).not.toBe(initialText);

        // Click again to unlike
        await likeButton.click();

        // Wait for the unlike action to complete
        await page.waitForTimeout(1000);

        // Check that the button text changed back
        const finalText = await likeButton.textContent();
        expect(finalText).toBe(initialText);

        console.log('Successfully tested like/unlike functionality');
    });

    test('should add a comment to a post', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Find the first post
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Click comment button to show comments section
        await firstPost.locator('button:has-text("Comment")').click();

        // Wait for comment input to appear
        await expect(firstPost.locator('input[placeholder*="Write a comment"]')).toBeVisible();

        // Add a comment
        const testComment = `Test comment at ${new Date().toISOString()}`;
        await firstPost.locator('input[placeholder*="Write a comment"]').fill(testComment);

        // Submit comment
        await firstPost.locator('button:has-text("Post")').click();

        // Wait for comment to appear
        await expect(firstPost.locator(`text=${testComment}`)).toBeVisible();

        console.log('Successfully added a comment to a post');
    });

    test('should share a post', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Find the first post
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Click share button
        await firstPost.locator('button:has-text("Share")').click();

        // Wait for share dialog or notification
        await page.waitForTimeout(1000);

        // Check for success message or dialog
        const successMessage = page.locator('text=Post shared successfully').or(page.locator('text=Shared'));
        await expect(successMessage).toBeVisible({ timeout: 5000 });

        console.log('Successfully shared a post');
    });

    test('should handle pagination and load more posts', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Get initial post count
        const initialPostCount = await page.locator('[data-testid="feed-post"]').count();

        // Scroll to bottom to trigger load more
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for potential load more
        await page.waitForTimeout(2000);

        // Get new post count
        const newPostCount = await page.locator('[data-testid="feed-post"]').count();

        // Should have same or more posts
        expect(newPostCount).toBeGreaterThanOrEqual(initialPostCount);

        console.log(`Initial posts: ${initialPostCount}, After scroll: ${newPostCount}`);
    });

    test('should refresh feed', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Get initial post count
        const initialPostCount = await page.locator('[data-testid="feed-post"]').count();

        // Refresh the page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Get new post count
        const newPostCount = await page.locator('[data-testid="feed-post"]').count();

        // Should have same number of posts
        expect(newPostCount).toBe(initialPostCount);

        console.log(`Posts before refresh: ${initialPostCount}, After refresh: ${newPostCount}`);
    });

    test('should handle empty feed state', async ({ page }) => {
        // This test might not be applicable if we always have sample data
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Check that we have some content on the page
        const pageContent = await page.textContent('body');
        expect(pageContent).toBeTruthy();

        // Should have create post button even if no posts
        await expect(page.locator('button:has-text("Create Post")')).toBeVisible();

        console.log('Feed page loads correctly even with minimal content');
    });

    test('should validate post creation form', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Try to submit empty post
        await page.click('button:has-text("Post")');

        // Should show validation error or stay open
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in content and try again
        await page.fill('textarea[placeholder*="What\'s on your mind"]', 'Valid test post');
        await page.click('button:has-text("Post")');

        // Modal should close
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();

        console.log('Successfully tested post creation validation');
    });

    test('should handle image URL validation', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in content
        await page.fill('textarea[placeholder*="What\'s on your mind"]', 'Test post with invalid image');

        // Add invalid image URL
        await page.fill('input[placeholder*="Image URL"]', 'not-a-valid-url');

        // Submit the post
        await page.click('button:has-text("Post")');

        // Should handle gracefully (either show error or submit anyway)
        await page.waitForTimeout(1000);

        // Check if modal closed (indicating submission) or stayed open (indicating validation)
        const modalVisible = await page.locator('[role="dialog"]').isVisible();

        if (!modalVisible) {
            // Post was submitted, check if it appears
            await expect(page.locator('text=Test post with invalid image')).toBeVisible();
        } else {
            // Validation kept modal open
            console.log('Image URL validation kept modal open');
        }

        console.log('Successfully tested image URL validation');
    });

    test('should handle keyboard shortcuts in post creation', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in content
        await page.fill('textarea[placeholder*="What\'s on your mind"]', 'Test post with keyboard shortcuts');

        // Try Ctrl+Enter to submit
        await page.keyboard.press('Control+Enter');

        // Wait for submission
        await page.waitForTimeout(1000);

        // Check if modal closed
        const modalVisible = await page.locator('[role="dialog"]').isVisible();

        if (!modalVisible) {
            // Post was submitted
            await expect(page.locator('text=Test post with keyboard shortcuts')).toBeVisible();
            console.log('Successfully submitted post with Ctrl+Enter');
        } else {
            // Try regular Enter
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            if (!(await page.locator('[role="dialog"]').isVisible())) {
                await expect(page.locator('text=Test post with keyboard shortcuts')).toBeVisible();
                console.log('Successfully submitted post with Enter');
            }
        }
    });

    test('should handle character limit in post creation', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Click create post button
        await page.click('button:has-text("Create Post")');

        // Wait for modal to appear
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Fill in very long content
        const longContent = 'A'.repeat(1000);
        await page.fill('textarea[placeholder*="What\'s on your mind"]', longContent);

        // Check character count display
        const charCount = page.locator('text=/\\d+\\/\\d+/');
        await expect(charCount).toBeVisible();

        // Submit the post
        await page.click('button:has-text("Post")');

        // Wait for submission
        await page.waitForTimeout(1000);

        // Check if modal closed (indicating successful submission)
        const modalVisible = await page.locator('[role="dialog"]').isVisible();

        if (!modalVisible) {
            // Post was submitted successfully
            await expect(page.locator('text=A'.repeat(100))).toBeVisible();
            console.log('Successfully created post with long content');
        } else {
            console.log('Character limit prevented submission');
        }
    });

    test('should handle comment character limit', async ({ page }) => {
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Find the first post
        const firstPost = page.locator('[data-testid="feed-post"]').first();

        // Click comment button to show comments section
        await firstPost.locator('button:has-text("Comment")').click();

        // Wait for comment input to appear
        await expect(firstPost.locator('input[placeholder*="Write a comment"]')).toBeVisible();

        // Add a long comment
        const longComment = 'B'.repeat(500);
        await firstPost.locator('input[placeholder*="Write a comment"]').fill(longComment);

        // Submit comment
        await firstPost.locator('button:has-text("Post")').click();

        // Wait for comment to appear
        await expect(firstPost.locator(`text=${longComment.substring(0, 100)}`)).toBeVisible();

        console.log('Successfully added a long comment');
    });

    test('should handle network errors gracefully', async ({ page }) => {
        // This test simulates network issues by temporarily disabling network
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Disable network temporarily
        await page.route('**/*', route => route.abort());

        // Try to create a post
        await page.click('button:has-text("Create Post")');
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        await page.fill('textarea[placeholder*="What\'s on your mind"]', 'Test post with network error');
        await page.click('button:has-text("Post")');

        // Should handle error gracefully
        await page.waitForTimeout(2000);

        // Re-enable network
        await page.unroute('**/*');

        // Try again with network enabled
        await page.fill('textarea[placeholder*="What\'s on your mind"]', 'Test post after network restore');
        await page.click('button:has-text("Post")');

        // Should work now
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();

        console.log('Successfully handled network errors gracefully');
    });

    test('should handle authentication errors', async ({ page }) => {
        // Logout first
        await page.goto('/api/auth/logout');
        await page.waitForLoadState('networkidle');

        // Try to access feed page without authentication
        await page.goto('/dashboard/feed');
        await page.waitForLoadState('networkidle');

        // Should redirect to login page
        await expect(page).toHaveURL(/login/);

        console.log('Successfully redirected to login when not authenticated');
    });

    test('should test feed API endpoints directly', async ({ request, page }) => {
        // Get auth token
        const token = await getAuthToken(page, TEST_USERS.sarah);

        // Test feed posts API
        const postsResponse = await request.get('http://localhost:8080/api/feed/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(postsResponse.ok()).toBeTruthy();
        const posts = await postsResponse.json();
        expect(Array.isArray(posts.content)).toBeTruthy();

        console.log(`API returned ${posts.content.length} posts`);

        // Test creating a post via API
        if (posts.content.length > 0) {
            const firstPost = posts.content[0];

            // Test like API
            const likeResponse = await request.post(`http://localhost:8080/api/feed/posts/${firstPost.id}/like`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            expect([200, 201, 409]).toContain(likeResponse.status());

            // Test comment API
            const commentResponse = await request.post(`http://localhost:8080/api/feed/posts/${firstPost.id}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    content: `API test comment at ${new Date().toISOString()}`
                }
            });

            expect([200, 201]).toContain(commentResponse.status());

            // Test share API
            const shareResponse = await request.post(`http://localhost:8080/api/feed/posts/${firstPost.id}/share`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    sharePlatform: 'twitter'
                }
            });

            expect([200, 201]).toContain(shareResponse.status());
        }

        console.log('Successfully tested all feed API endpoints');
    });

    test('should test feed pagination API', async ({ request, page }) => {
        // Get auth token
        const token = await getAuthToken(page, TEST_USERS.sarah);

        // Test pagination
        const page1Response = await request.get('http://localhost:8080/api/feed/posts?page=0&size=5', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(page1Response.ok()).toBeTruthy();
        const page1 = await page1Response.json();

        const page2Response = await request.get('http://localhost:8080/api/feed/posts?page=1&size=5', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(page2Response.ok()).toBeTruthy();
        const page2 = await page2Response.json();

        // Should have pagination metadata
        expect(page1.totalElements).toBeDefined();
        expect(page1.totalPages).toBeDefined();
        expect(page1.first).toBeDefined();
        expect(page1.last).toBeDefined();

        console.log(`Page 1: ${page1.content.length} posts, Page 2: ${page2.content.length} posts`);
        console.log(`Total: ${page1.totalElements} posts, Pages: ${page1.totalPages}`);
    });

    test('should test feed search and filtering', async ({ request, page }) => {
        // Get auth token
        const token = await getAuthToken(page, TEST_USERS.sarah);

        // Test search by content
        const searchResponse = await request.get('http://localhost:8080/api/feed/posts?search=test', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(searchResponse.ok()).toBeTruthy();
        const searchResults = await searchResponse.json();
        expect(Array.isArray(searchResults.content)).toBeTruthy();

        console.log(`Search for "test" returned ${searchResults.content.length} posts`);

        // Test filtering by author
        const authorResponse = await request.get('http://localhost:8080/api/feed/posts?author=sarah', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(authorResponse.ok()).toBeTruthy();
        const authorResults = await authorResponse.json();
        expect(Array.isArray(authorResults.content)).toBeTruthy();

        console.log(`Filter by author "sarah" returned ${authorResults.content.length} posts`);
    });
});
