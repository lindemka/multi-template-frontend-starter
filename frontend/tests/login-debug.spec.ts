import { test, expect } from '@playwright/test';

test.describe('Login Flow Debug', () => {
  test('login as Sarah Chen and verify authentication', async ({ page, context }) => {
    console.log('Starting login test...');
    
    // Go to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill in login form
    console.log('Filling login form...');
    await page.fill('input#username', 'sarah.chen@example.com');
    await page.fill('input#password', 'password123');
    
    // Take screenshot before login
    await page.screenshot({ path: 'before-login.png' });
    
    // Click login button
    console.log('Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Wait for response from login endpoint
    const loginResponse = await page.waitForResponse(
      response => response.url().includes('/api/auth/login'),
      { timeout: 10000 }
    );
    
    console.log('Login response status:', loginResponse.status());
    const loginBody = await loginResponse.json();
    console.log('Login response body:', JSON.stringify(loginBody, null, 2));
    
    // Check cookies after login
    const cookies = await context.cookies();
    console.log('Cookies after login:', cookies.map(c => ({ name: c.name, value: c.value?.substring(0, 50) + '...', httpOnly: c.httpOnly, path: c.path })));
    
    // Wait for navigation
    await page.waitForURL('**/dashboard/**', { timeout: 10000 }).catch(e => {
      console.log('Navigation did not happen:', e.message);
    });
    
    console.log('Current URL:', page.url());
    
    // Try to access /api/account/me directly
    console.log('Testing /api/account/me endpoint...');
    const meResponse = await page.evaluate(async () => {
      const response = await fetch('/api/account/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const text = await response.text();
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: text,
        cookies: document.cookie
      };
    });
    
    console.log('/api/account/me response:', JSON.stringify(meResponse, null, 2));
    
    // Try parsing the response
    if (meResponse.body) {
      try {
        const parsed = JSON.parse(meResponse.body);
        console.log('Parsed /api/account/me:', parsed);
      } catch (e) {
        console.log('Failed to parse /api/account/me response:', e.message);
        console.log('Raw body:', meResponse.body);
      }
    }
    
    // Check if we're on login page (redirect happened)
    if (page.url().includes('/login')) {
      console.log('ERROR: Still on login page after login attempt');
      
      // Check for error messages
      const errorElement = await page.$('.text-red-500, [role="alert"], .error');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        console.log('Error message on page:', errorText);
      }
    }
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'after-login.png' });
    
    // If we made it to dashboard, check avatar
    if (page.url().includes('/dashboard')) {
      console.log('Successfully navigated to dashboard');
      
      // Wait for avatar to load
      await page.waitForSelector('[data-testid="user-avatar"], .avatar, img[alt*="Sarah"], img[alt*="Me"]', { timeout: 5000 }).catch(() => {
        console.log('No avatar found');
      });
      
      // Check all img elements
      const images = await page.$$eval('img', imgs => 
        imgs.map(img => ({
          src: img.src,
          alt: img.alt,
          className: img.className
        }))
      );
      console.log('All images on page:', images);
    }
  });
});