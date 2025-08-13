import { test, expect } from '@playwright/test';

test.describe('Share with Real Token Test', () => {
    test('should get real JWT token and test share functionality', async ({ page }) => {
        // Listen to console messages
        page.on('console', msg => {
            console.log('Browser console:', msg.text());
        });

        // Listen to network requests
        page.on('request', request => {
            if (request.url().includes('/api/feed')) {
                console.log('Feed API request:', request.url(), request.method());
            }
        });

        page.on('response', response => {
            if (response.url().includes('/api/feed')) {
                console.log('Feed API response:', response.url(), response.status());
                if (!response.ok()) {
                    response.text().then(text => {
                        console.log('Response body:', text);
                    }).catch(() => {
                        console.log('Could not read response body');
                    });
                }
            }
        });

        // Login first
        await page.goto('http://localhost:3000/login');
        await page.waitForLoadState('networkidle');
        await page.fill('input[id="username"]', 'test@example.com');
        await page.fill('input[id="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Get the JWT token from cookies
        const cookies = await page.context().cookies();
        const accessToken = cookies.find(cookie => cookie.name === 'accessToken');
        console.log('Access token found:', !!accessToken);
        if (accessToken) {
            console.log('Access token value:', accessToken.value.substring(0, 50) + '...');
        }
        
        // Go to feed page
        await page.goto('http://localhost:3000/dashboard/feed');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Check if posts are rendered
        const posts = await page.locator('[data-testid="feed-post"]').count();
        console.log(`Found ${posts} posts on the page`);
        
        if (posts > 0) {
            // Try to find a post that's not by the current user
            const postElements = page.locator('[data-testid="feed-post"]');
            
            for (let i = 0; i < posts; i++) {
                const postElement = postElements.nth(i);
                const authorName = await postElement.locator('[data-testid="author-name"]').textContent();
                console.log(`Post ${i + 1} author: ${authorName}`);
                
                // If it's not "Test User", try to share it
                if (authorName && !authorName.includes('Test User')) {
                    console.log(`Trying to share post by ${authorName}`);
                    
                    // Click the share button on this post
                    const shareButton = postElement.locator('button:has-text("Share")');
                    await shareButton.click();
                    
                    // Wait a moment to see if any errors occur
                    await page.waitForTimeout(3000);
                    
                    // Check for any console errors
                    const errors = await page.evaluate(() => {
                        return (window as any).consoleErrors || [];
                    });
                    
                    if (errors.length > 0) {
                        console.log('Console errors:', errors);
                    } else {
                        console.log('No console errors detected');
                    }
                    
                    break;
                }
            }
        }
        
        // Take a screenshot
        await page.screenshot({ path: 'test-results/share-with-real-token-test.png' });
    });
});
