#!/usr/bin/env node

const axios = require('axios');
const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:3000';

async function testRealBrowserExperience() {
  console.log('🌐 Testing Real Browser Experience\n');
  console.log('=' .repeat(60));
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to false to see the browser
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test 1: Login
    console.log('📱 Test 1: Login Flow');
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForSelector('input[name="username"]', { timeout: 5000 });
    
    // Fill login form
    await page.type('input[name="username"]', 'sarah.chen');
    await page.type('input[name="password"]', 'password123');
    
    // Submit login
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log('✅ Logged in successfully');
    console.log(`   Current URL: ${page.url()}`);
    
    // Test 2: Navigate to Account
    console.log('\n📱 Test 2: Account Page');
    await page.goto(`${FRONTEND_URL}/dashboard/account`);
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorElement = await page.$('.text-red-600');
    if (errorElement) {
      const errorText = await page.evaluate(el => el.textContent, errorElement);
      console.log(`❌ Error on Account page: ${errorText}`);
    } else {
      console.log('✅ Account page loaded without errors');
    }
    
    // Test 3: Navigate to Profile
    console.log('\n📱 Test 3: Profile Page');
    
    // Get localStorage data
    const userData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('user') || '{}');
    });
    
    console.log(`   User data in localStorage:`, userData);
    
    if (userData.profileId) {
      await page.goto(`${FRONTEND_URL}/dashboard/profile/${userData.profileId}`);
      await page.waitForTimeout(2000);
      
      // Check if Edit button exists
      const editButton = await page.$('button:has-text("Edit Profile")');
      if (editButton) {
        console.log('✅ Edit Profile button found');
        
        // Click Edit
        await editButton.click();
        await page.waitForTimeout(2000);
        
        // Try to edit
        const nameInput = await page.$('input[name="name"]');
        if (nameInput) {
          await nameInput.click({ clickCount: 3 }); // Select all
          await nameInput.type('Sarah Chen - Browser Test');
          
          // Save
          const saveButton = await page.$('button:has-text("Save")');
          if (saveButton) {
            await saveButton.click();
            await page.waitForTimeout(2000);
            
            // Check for success/error
            const successMessage = await page.$('.text-green-600');
            const errorMessage = await page.$('.text-red-600');
            
            if (successMessage) {
              console.log('✅ Profile saved successfully');
            } else if (errorMessage) {
              const errorText = await page.evaluate(el => el.textContent, errorMessage);
              console.log(`❌ Save failed: ${errorText}`);
            }
          }
        }
      } else {
        console.log('❌ Edit Profile button not found');
      }
    } else {
      console.log('❌ No profileId in localStorage');
    }
    
    // Check console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    if (consoleErrors.length > 0) {
      console.log('\n⚠️ Console errors detected:');
      consoleErrors.forEach(err => console.log(`   ${err}`));
    }
    
  } catch (error) {
    console.error('❌ Browser test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Fallback test without puppeteer
async function testWithoutPuppeteer() {
  console.log('🔧 Running API-based tests (Puppeteer not available)\n');
  
  // Import and run the manual test
  require('./manual-user-journey.js');
}

// Check if puppeteer is available
try {
  require.resolve('puppeteer');
  testRealBrowserExperience().catch(console.error);
} catch (e) {
  testWithoutPuppeteer();
}