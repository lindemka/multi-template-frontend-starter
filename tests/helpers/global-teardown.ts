import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  // Clean up any test data if needed
  // This could include:
  // - Removing test messages
  // - Resetting user profiles
  // - Cleaning up uploaded files
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
