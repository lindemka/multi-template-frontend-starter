// Quick test to check API responses
async function checkAPIs() {
  try {
    // Login first
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'sarah.chen@example.com',
        password: 'password123'
      })
    });
    
    const cookies = loginRes.headers.get('set-cookie');
    console.log('Login response:', loginRes.status);
    
    // Check account/me
    const meRes = await fetch('http://localhost:8080/api/account/me', {
      headers: { 'Cookie': cookies || '' }
    });
    const meData = await meRes.json();
    console.log('\n/api/account/me response:');
    console.log(JSON.stringify(meData, null, 2));
    
    // Check member/1
    const memberRes = await fetch('http://localhost:8080/api/members/1', {
      headers: { 'Cookie': cookies || '' }
    });
    const memberData = await memberRes.json();
    console.log('\n/api/members/1 response (first few fields):');
    console.log(JSON.stringify({
      id: memberData.id,
      name: memberData.name,
      avatar: memberData.avatar,
      email: memberData.email,
      username: memberData.username
    }, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAPIs();