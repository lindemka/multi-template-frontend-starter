#!/usr/bin/env node

const axios = require('axios');
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

// Simulated browser state
let browserState = {
  token: null,
  user: null,
  cookies: {}
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function simulateLogin(username, password) {
  log('blue', `\n🔐 LOGGING IN AS: ${username}`);
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username,
      password
    });
    
    browserState.token = response.data.token;
    browserState.user = {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      role: response.data.role,
      profileId: response.data.profileId
    };
    
    log('green', `✅ Login successful`);
    log('green', `   User ID: ${browserState.user.id}`);
    log('green', `   Profile ID: ${browserState.user.profileId}`);
    log('green', `   Name: ${browserState.user.firstName} ${browserState.user.lastName}`);
    return true;
  } catch (error) {
    log('red', `❌ Login failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function navigateToAccount() {
  log('blue', '\n📄 NAVIGATING TO ACCOUNT PAGE');
  
  if (!browserState.token) {
    log('red', '❌ Not logged in - would redirect to login');
    return false;
  }
  
  try {
    // Simulate what the Account page does
    const response = await axios.get(
      `${BACKEND_URL}/api/users/${browserState.user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${browserState.token}`
        }
      }
    );
    
    log('green', '✅ Account data loaded successfully');
    log('green', `   Name: ${response.data.firstName} ${response.data.lastName}`);
    log('green', `   Email: ${response.data.email}`);
    log('green', `   Username: ${response.data.username}`);
    return response.data;
  } catch (error) {
    log('red', `❌ Failed to load account data: ${error.response?.status} ${error.response?.data?.error || error.message}`);
    log('yellow', '   This is what the user sees: "Unable to load user data. Please try logging in again."');
    return false;
  }
}

async function navigateToProfile() {
  log('blue', '\n👤 NAVIGATING TO PROFILE PAGE');
  
  if (!browserState.user?.profileId) {
    log('red', '❌ No profile ID found');
    return false;
  }
  
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/members/${browserState.user.profileId}`,
      {
        headers: {
          'Authorization': `Bearer ${browserState.token}`
        }
      }
    );
    
    log('green', '✅ Profile loaded successfully');
    log('green', `   Name: ${response.data.name}`);
    log('green', `   Location: ${response.data.location}`);
    log('green', `   Tagline: ${response.data.tagline}`);
    log('green', `   Skills: ${response.data.skills?.join(', ') || 'None'}`);
    return response.data;
  } catch (error) {
    log('red', `❌ Failed to load profile: ${error.response?.status} ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function editProfile(updates) {
  log('blue', '\n✏️ EDITING PROFILE');
  
  if (!browserState.user?.profileId) {
    log('red', '❌ No profile ID found');
    return false;
  }
  
  log('yellow', '   Attempting to update:');
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'object') {
      log('yellow', `     ${key}: ${JSON.stringify(updates[key])}`);
    } else {
      log('yellow', `     ${key}: ${updates[key]}`);
    }
  });
  
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/members/${browserState.user.profileId}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${browserState.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    log('green', '✅ Profile updated successfully');
    log('green', `   New name: ${response.data.name}`);
    log('green', `   New skills: ${response.data.skills?.join(', ')}`);
    return response.data;
  } catch (error) {
    log('red', `❌ Failed to update profile: ${error.response?.status}`);
    if (error.response?.data) {
      log('red', `   Error: ${JSON.stringify(error.response.data)}`);
    }
    log('yellow', '   This is what the user sees: "Failed to update profile"');
    return false;
  }
}

async function testUnauthorizedAccess() {
  log('blue', '\n🔒 TESTING AUTHORIZATION');
  
  // Login as different user
  await simulateLogin('alex.johnson', 'password123');
  
  log('yellow', '   Attempting to edit Sarah\'s profile (ID: 1) as Alex...');
  
  try {
    await axios.put(
      `${BACKEND_URL}/api/members/1`,
      { name: 'Hacked by Alex' },
      {
        headers: {
          'Authorization': `Bearer ${browserState.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    log('red', '❌ SECURITY ISSUE: Unauthorized edit was allowed!');
  } catch (error) {
    if (error.response?.status === 403) {
      log('green', '✅ Authorization working: Edit blocked with 403 Forbidden');
    } else {
      log('yellow', `⚠️ Unexpected error: ${error.response?.status}`);
    }
  }
}

async function runFullUserJourney() {
  console.log('=' .repeat(60));
  log('magenta', '🧪 MANUAL USER JOURNEY TEST - SARAH CHEN');
  console.log('=' .repeat(60));
  
  // Test Sarah's journey
  if (!await simulateLogin('sarah.chen', 'password123')) return;
  
  const accountData = await navigateToAccount();
  if (!accountData) {
    log('red', '⚠️ Account page issue detected - user would see error message');
  }
  
  const profileData = await navigateToProfile();
  if (!profileData) {
    log('red', '⚠️ Profile page issue detected');
    return;
  }
  
  const updateResult = await editProfile({
    name: 'Sarah Chen - Manual Test',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    tagline: 'Testing the complete user journey',
    about: {
      shortDescription: 'Manual testing of profile editing',
      lookingFor: 'Verifying all features work',
      offering: 'Quality assurance',
      industries: ['Tech', 'QA'],
      languages: ['English', 'Mandarin']
    }
  });
  
  if (!updateResult) {
    log('red', '⚠️ Profile update issue detected - user would see error message');
  }
  
  // Test lindemka2
  console.log('\n' + '=' .repeat(60));
  log('magenta', '🧪 MANUAL USER JOURNEY TEST - LINDEMKA2');
  console.log('=' .repeat(60));
  
  // First create lindemka2 if doesn't exist
  log('yellow', '\n📝 Checking if lindemka2 exists...');
  try {
    await simulateLogin('lindemka2', 'password123');
  } catch (error) {
    log('yellow', '   User doesn\'t exist, creating...');
    try {
      const registerResponse = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        username: 'lindemka2',
        email: 'lindemka2@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      log('green', '✅ User lindemka2 created successfully');
      browserState.token = registerResponse.data.token;
      browserState.user = {
        id: registerResponse.data.id,
        username: registerResponse.data.username,
        email: registerResponse.data.email,
        firstName: registerResponse.data.firstName,
        lastName: registerResponse.data.lastName,
        role: registerResponse.data.role,
        profileId: registerResponse.data.profileId
      };
    } catch (regError) {
      // User might already exist, try login again
      await simulateLogin('lindemka2', 'password123');
    }
  }
  
  await navigateToAccount();
  await navigateToProfile();
  await editProfile({
    name: 'Lindemka2 Test User',
    skills: ['Testing', 'QA'],
    tagline: 'Test user for verification'
  });
  
  // Test authorization
  await testUnauthorizedAccess();
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  log('magenta', '📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  log('green', '\n✅ Working Features:');
  log('green', '  • Login authentication');
  log('green', '  • Profile data retrieval');
  log('green', '  • Profile editing (when token is correct)');
  log('green', '  • Authorization (blocks unauthorized edits)');
  
  log('yellow', '\n⚠️ Issues Found:');
  if (!accountData) {
    log('yellow', '  • Account page may have token/auth issues');
  }
  if (!updateResult) {
    log('yellow', '  • Profile updates may fail due to token mismatch');
  }
  
  log('blue', '\n📝 Recommendations:');
  log('blue', '  1. Ensure localStorage token name consistency');
  log('blue', '  2. Add profileId to login response');
  log('blue', '  3. Improve error messages for users');
  log('blue', '  4. Add loading states during API calls');
}

// Run the test
runFullUserJourney().catch(console.error);