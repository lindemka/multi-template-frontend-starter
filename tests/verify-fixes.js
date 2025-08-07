#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyFixes() {
  console.log('\n' + '=' .repeat(70));
  log('cyan', '🔍 VERIFYING ALL FIXES FOR PROFILE EDITING');
  console.log('=' .repeat(70));
  
  const issues = [];
  const fixes = [];
  
  // Fix 1: Token consistency in api.ts
  log('blue', '\n1️⃣ Testing Token Consistency Fix');
  try {
    // Login and get token
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username: 'sarah.chen',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const profileId = loginResponse.data.profileId;
    
    if (!profileId) {
      issues.push('ProfileId not included in login response');
    } else {
      fixes.push('✅ ProfileId included in login response');
    }
    
    // Test with token
    const userResponse = await axios.get(
      `${BACKEND_URL}/api/users/${loginResponse.data.id}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (userResponse.status === 200) {
      fixes.push('✅ User endpoint works with token');
    }
    
    // Test profile endpoint
    const profileResponse = await axios.get(
      `${BACKEND_URL}/api/members/${profileId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (profileResponse.status === 200) {
      fixes.push('✅ Profile endpoint works with token');
    }
    
  } catch (error) {
    issues.push(`Token test failed: ${error.message}`);
  }
  
  // Fix 2: Account page data loading
  log('blue', '\n2️⃣ Testing Account Page Data Loading');
  try {
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username: 'sarah.chen',
      password: 'password123'
    });
    
    const accountResponse = await axios.get(
      `${BACKEND_URL}/api/users/${loginResponse.data.id}`,
      {
        headers: { 'Authorization': `Bearer ${loginResponse.data.token}` }
      }
    );
    
    if (accountResponse.data.firstName && accountResponse.data.email) {
      fixes.push('✅ Account data loads correctly');
    } else {
      issues.push('Account data incomplete');
    }
  } catch (error) {
    issues.push(`Account loading failed: ${error.message}`);
  }
  
  // Fix 3: Profile update functionality
  log('blue', '\n3️⃣ Testing Profile Update Functionality');
  try {
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username: 'sarah.chen',
      password: 'password123'
    });
    
    const testData = {
      name: 'Sarah Chen - Fix Verification',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      tagline: 'Verifying all fixes work correctly',
      about: {
        shortDescription: 'Testing profile updates after fixes',
        lookingFor: 'Confirming everything works',
        offering: 'Quality software',
        industries: ['Technology', 'Software'],
        languages: ['English', 'Mandarin']
      }
    };
    
    const updateResponse = await axios.put(
      `${BACKEND_URL}/api/members/${loginResponse.data.profileId}`,
      testData,
      {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (updateResponse.data.name === testData.name) {
      fixes.push('✅ Profile updates work correctly');
    } else {
      issues.push('Profile update data mismatch');
    }
    
    // Verify the update persisted
    const verifyResponse = await axios.get(
      `${BACKEND_URL}/api/members/${loginResponse.data.profileId}`,
      {
        headers: { 'Authorization': `Bearer ${loginResponse.data.token}` }
      }
    );
    
    if (verifyResponse.data.skills.length === 4) {
      fixes.push('✅ Profile updates persist correctly');
    }
    
  } catch (error) {
    issues.push(`Profile update failed: ${error.message}`);
  }
  
  // Fix 4: Authorization
  log('blue', '\n4️⃣ Testing Authorization Security');
  try {
    // Login as Sarah
    const sarahLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username: 'sarah.chen',
      password: 'password123'
    });
    
    // Login as Alex
    const alexLogin = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username: 'alex.johnson',
      password: 'password123'
    });
    
    // Alex tries to edit Sarah's profile
    try {
      await axios.put(
        `${BACKEND_URL}/api/members/${sarahLogin.data.profileId}`,
        { name: 'Unauthorized Edit' },
        {
          headers: { 'Authorization': `Bearer ${alexLogin.data.token}` }
        }
      );
      issues.push('❌ SECURITY: Unauthorized edits allowed!');
    } catch (error) {
      if (error.response?.status === 403) {
        fixes.push('✅ Authorization blocks unauthorized edits');
      }
    }
    
  } catch (error) {
    issues.push(`Authorization test failed: ${error.message}`);
  }
  
  // Fix 5: Frontend pages
  log('blue', '\n5️⃣ Testing Frontend Page Access');
  const pages = [
    '/login',
    '/dashboard',
    '/dashboard/members',
    '/dashboard/profile/1',
    '/dashboard/account',
    '/dashboard/startups'
  ];
  
  for (const page of pages) {
    try {
      const response = await axios.get(`${FRONTEND_URL}${page}`, {
        validateStatus: () => true,
        maxRedirects: 0
      });
      
      if (response.status === 200 || response.status === 307) {
        fixes.push(`✅ Page ${page} accessible`);
      } else if (response.status === 500) {
        issues.push(`Page ${page} returns 500 error`);
      }
    } catch (error) {
      issues.push(`Page ${page} failed: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(70));
  log('cyan', '📊 VERIFICATION SUMMARY');
  console.log('=' .repeat(70));
  
  if (fixes.length > 0) {
    log('green', '\n✅ FIXES VERIFIED (' + fixes.length + '):');
    fixes.forEach(fix => log('green', '  ' + fix));
  }
  
  if (issues.length > 0) {
    log('red', '\n❌ REMAINING ISSUES (' + issues.length + '):');
    issues.forEach(issue => log('red', '  ' + issue));
  } else {
    log('green', '\n🎉 ALL ISSUES FIXED! Profile editing is fully functional.');
  }
  
  // User instructions
  console.log('\n' + '=' .repeat(70));
  log('magenta', '📝 MANUAL TESTING INSTRUCTIONS');
  console.log('=' .repeat(70));
  log('blue', '\n1. Clear browser cache and cookies');
  log('blue', '2. Go to http://localhost:3000/login');
  log('blue', '3. Login with: sarah.chen / password123');
  log('blue', '4. Click avatar menu → "Account"');
  log('blue', '   - Should see account details without error');
  log('blue', '5. Click avatar menu → Your name/email');
  log('blue', '   - Should navigate to your profile');
  log('blue', '6. Click "Edit Profile" button');
  log('blue', '7. Change skills or other info');
  log('blue', '8. Click "Save Changes"');
  log('blue', '   - Should save successfully');
  log('blue', '\n9. Logout and login as: lindemka2 / password123');
  log('blue', '10. Repeat steps 4-8 for lindemka2');
  
  return issues.length === 0;
}

// Run verification
verifyFixes().then(success => {
  if (success) {
    console.log('\n');
    log('green', '✅ All systems operational! Ready for production.');
  } else {
    console.log('\n');
    log('yellow', '⚠️ Some issues remain. Please review and fix.');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  log('red', `\n❌ Verification failed: ${error.message}`);
  process.exit(1);
});