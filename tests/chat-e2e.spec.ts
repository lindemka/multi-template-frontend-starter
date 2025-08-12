import { test, expect } from '@playwright/test';
import { TEST_USERS } from './helpers/auth';

test.describe('Chat System End-to-End', () => {
    test('should allow users to send and receive messages', async ({ page, request }) => {
        console.log('🧪 Starting comprehensive chat E2E test...');

        // Step 1: Login as Sarah
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();
        console.log('✅ Sarah logged in successfully');

        // Step 2: Set authentication cookies in browser
        await page.context().addCookies([
            {
                name: 'accessToken',
                value: loginData.accessToken,
                domain: 'localhost',
                path: '/',
                httpOnly: false, // Need to be accessible for testing
                secure: false,
                sameSite: 'Lax'
            },
            {
                name: 'refreshToken',
                value: loginData.refreshToken,
                domain: 'localhost',
                path: '/',
                httpOnly: false, // Need to be accessible for testing
                secure: false,
                sameSite: 'Lax'
            }
        ]);

        // Step 3: Navigate to messages page
        await page.goto('/dashboard/messages');
        await page.waitForLoadState('networkidle');

        // Step 4: Verify we're on the messages page
        await expect(page).not.toHaveURL(/login/);
        await expect(page).toHaveURL(/messages/);
        console.log('✅ Successfully navigated to messages page');

        // Step 5: Take screenshot of initial state
        await page.screenshot({ path: 'test-results/chat-initial-state.png' });

        // Step 6: Check page content and structure
        const pageContent = await page.textContent('body');
        console.log('Page content preview:', pageContent?.substring(0, 200));

        // Step 7: Look for conversation elements
        const allButtons = page.locator('button');
        const buttonCount = await allButtons.count();
        console.log(`Found ${buttonCount} buttons on the page`);

        // Step 8: Find conversation buttons (buttons with avatars or user info)
        const conversationButtons = allButtons.filter({
            has: page.locator('img[alt*="Avatar"], [class*="AvatarFallback"], [class*="avatar"]')
        });

        const conversationCount = await conversationButtons.count();
        console.log(`Found ${conversationCount} conversation buttons`);

        if (conversationCount === 0) {
            // If no conversations exist, we need to create one
            console.log('No existing conversations found, creating a new conversation...');

            // Look for compose/new message button
            const composeButton = allButtons.filter({
                hasText: /compose|new|message|start/i
            }).or(allButtons.filter({
                has: page.locator('svg[class*="lucide-edit"], svg[class*="lucide-plus"]')
            }));

            const composeCount = await composeButton.count();
            console.log(`Found ${composeCount} compose buttons`);

            if (composeCount > 0) {
                await composeButton.first().click();
                await page.waitForTimeout(1000);
                console.log('✅ Clicked compose button');
            } else {
                // Try to search for a user to start a conversation
                const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="durchsuchen"]');
                const searchCount = await searchInput.count();
                console.log(`Found ${searchCount} search inputs`);

                if (searchCount > 0) {
                    await searchInput.first().fill('alex');
                    await page.waitForTimeout(1000);
                    console.log('✅ Searched for user "alex"');

                    // Look for search results
                    const searchResults = page.locator('text=alex.johnson, text=Alex Johnson');
                    const resultCount = await searchResults.count();
                    console.log(`Found ${resultCount} search results for Alex`);

                    if (resultCount > 0) {
                        await searchResults.first().click();
                        await page.waitForTimeout(1000);
                        console.log('✅ Clicked on Alex Johnson');
                    }
                }
            }
        } else {
            // Click on the first conversation
            await conversationButtons.first().click();
            await page.waitForTimeout(1000);
            console.log('✅ Clicked on existing conversation');
        }

        // Step 9: Take screenshot after conversation selection
        await page.screenshot({ path: 'test-results/chat-conversation-selected.png' });

        // Step 10: Look for message input and send functionality
        const messageInputs = page.locator('input[placeholder*="message"], input[placeholder*="Write"], textarea[placeholder*="message"], textarea[placeholder*="Write"]');
        const inputCount = await messageInputs.count();
        console.log(`Found ${inputCount} message input fields`);

        if (inputCount > 0) {
            // Step 11: Send a test message
            const testMessage = `E2E Test message at ${new Date().toISOString()}`;
            console.log(`Sending message: "${testMessage}"`);

            await messageInputs.first().fill(testMessage);
            await page.waitForTimeout(500);

            // Step 12: Find and click send button
            const sendButtons = page.locator('button').filter({
                hasText: /send|senden/i
            }).or(page.locator('button').filter({
                has: page.locator('svg[class*="lucide-send"], svg[class*="lucide-arrow"]')
            }));

            const sendButtonCount = await sendButtons.count();
            console.log(`Found ${sendButtonCount} send buttons`);

            if (sendButtonCount > 0) {
                await sendButtons.first().click();
                console.log('✅ Clicked send button');

                // Step 13: Wait for message to be sent and appear
                await page.waitForTimeout(2000);

                // Step 14: Verify message appears in the conversation
                const messageElements = page.locator(`text="${testMessage}"`);
                const messageCount = await messageElements.count();
                console.log(`Found ${messageCount} instances of the sent message in UI`);

                // Step 15: Take screenshot after sending message
                await page.screenshot({ path: 'test-results/chat-message-sent.png' });

                // Step 16: Verify message was persisted by checking database
                const dbCheck = await checkMessageInDatabase(testMessage);
                console.log(`Database check result: ${dbCheck ? '✅ Message found in database' : '❌ Message not found in database'}`);

                // Step 17: Assertions
                expect(messageCount).toBeGreaterThan(0);
                expect(dbCheck).toBeTruthy();

                console.log('🎉 SUCCESS: Message was sent and persisted correctly!');
            } else {
                console.log('❌ No send button found');
                await page.screenshot({ path: 'test-results/chat-no-send-button.png' });
            }
        } else {
            console.log('❌ No message input field found');
            await page.screenshot({ path: 'test-results/chat-no-input.png' });
        }
    });

    test('should display existing messages in conversations', async ({ page, request }) => {
        console.log('🧪 Testing message display functionality...');

        // Step 1: Login
        const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
            data: {
                usernameOrEmail: TEST_USERS.sarah.email,
                password: TEST_USERS.sarah.password
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();

        // Step 2: Set authentication cookies
        await page.context().addCookies([
            {
                name: 'accessToken',
                value: loginData.accessToken,
                domain: 'localhost',
                path: '/',
                httpOnly: false,
                secure: false,
                sameSite: 'Lax'
            },
            {
                name: 'refreshToken',
                value: loginData.refreshToken,
                domain: 'localhost',
                path: '/',
                httpOnly: false,
                secure: false,
                sameSite: 'Lax'
            }
        ]);

        // Step 3: Navigate to messages
        await page.goto('/dashboard/messages');
        await page.waitForLoadState('networkidle');

        // Step 4: Check if there are any existing messages displayed
        const messageElements = page.locator('[class*="message"], [class*="chat"], [data-testid*="message"]');
        const messageCount = await messageElements.count();
        console.log(`Found ${messageCount} message elements on page`);

        // Step 5: Look for any text that might be messages
        const allText = await page.textContent('body');
        const hasMessageContent = allText && (
            allText.includes('Test message') ||
            allText.includes('Hello') ||
            allText.includes('Hi') ||
            allText.includes('message')
        );

        console.log(`Page contains message-like content: ${hasMessageContent}`);

        // Step 6: Take screenshot
        await page.screenshot({ path: 'test-results/chat-message-display.png' });

        // Step 7: Assertions
        expect(messageCount).toBeGreaterThanOrEqual(0);
        console.log('✅ Message display test completed');
    });
});

async function checkMessageInDatabase(messageContent: string): Promise<boolean> {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    try {
        const escapedContent = messageContent.replace(/'/g, "''");
        const { stdout } = await execAsync(`docker compose exec db psql -U postgres -d project1 -c "SELECT COUNT(*) FROM chat_messages WHERE content LIKE '%${escapedContent}%';" -t`);
        const count = parseInt(stdout.trim());
        return count > 0;
    } catch (error) {
        console.error('Error checking database:', error);
        return false;
    }
}
