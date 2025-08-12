import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Check if database is running
  try {
    const response = await fetch('http://localhost:8080/health');
    if (!response.ok) {
      console.log('⚠️  Backend not running, starting services...');
      // You could start services here if needed
    } else {
      console.log('✅ Backend is running');
    }
  } catch (error) {
    console.log('⚠️  Backend not accessible, make sure to run ./scripts/dev.sh');
  }
  
  // Check if frontend is running
  try {
    const response = await fetch('http://localhost:3000');
    if (!response.ok) {
      console.log('⚠️  Frontend not running, make sure to run npm run dev');
    } else {
      console.log('✅ Frontend is running');
    }
  } catch (error) {
    console.log('⚠️  Frontend not accessible, make sure to run npm run dev');
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;
