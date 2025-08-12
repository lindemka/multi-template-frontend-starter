import { TEST_USERS, TestUser } from './auth';

/**
 * Generate test message content
 */
export function generateTestMessage(prefix: string = 'Test'): string {
  const timestamp = new Date().toISOString();
  return `${prefix} message at ${timestamp}`;
}

/**
 * Generate unique test data
 */
export function generateUniqueTestData(): {
  message: string;
  username: string;
  email: string;
} {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  return {
    message: `Test message ${timestamp} ${random}`,
    username: `testuser_${timestamp}_${random}`,
    email: `test_${timestamp}_${random}@example.com`
  };
}

/**
 * Get random test user (excluding specified user)
 */
export function getRandomTestUser(excludeUser?: TestUser): TestUser {
  const users = Object.values(TEST_USERS);
  const availableUsers = excludeUser 
    ? users.filter(user => user.username !== excludeUser.username)
    : users;
  
  const randomIndex = Math.floor(Math.random() * availableUsers.length);
  return availableUsers[randomIndex];
}

/**
 * Get test user by username
 */
export function getTestUserByUsername(username: string): TestUser | null {
  return Object.values(TEST_USERS).find(user => user.username === username) || null;
}

/**
 * Get test user by email
 */
export function getTestUserByEmail(email: string): TestUser | null {
  return Object.values(TEST_USERS).find(user => user.email === email) || null;
}

/**
 * Sample test data for different scenarios
 */
export const TEST_DATA = {
  messages: {
    short: 'Hi there!',
    medium: 'This is a medium length test message for testing purposes.',
    long: 'This is a very long test message that contains multiple sentences and should be used to test how the application handles longer content. It includes various punctuation marks and should wrap properly in the UI.',
    special: 'Test message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
    unicode: 'Test message with unicode: 🚀✨🎉🔥💯',
    html: '<script>alert("test")</script>Test message with HTML',
    newlines: 'Line 1\nLine 2\nLine 3'
  },
  
  usernames: {
    valid: ['testuser', 'user123', 'john_doe', 'jane.smith'],
    invalid: ['', 'a', 'verylongusernameexceedingmaximumlength', 'user@name', 'user name'],
    edge: ['123456', 'user-name', 'user_name', 'userName']
  },
  
  emails: {
    valid: ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org'],
    invalid: ['', 'invalid', '@example.com', 'user@', 'user@.com'],
    edge: ['user@example', 'user@example..com', 'user..name@example.com']
  },
  
  passwords: {
    valid: ['password123', 'SecurePass1!', 'MyP@ssw0rd'],
    invalid: ['', 'short', 'nouppercaseornumber', 'NOLOWERCASEORNUMBER'],
    edge: ['password', '123456', 'abcdefgh']
  }
};

/**
 * Generate test conversation data
 */
export function generateTestConversation(user1: TestUser, user2: TestUser, messageCount: number = 5) {
  const messages = [];
  const now = new Date();
  
  for (let i = 0; i < messageCount; i++) {
    const timestamp = new Date(now.getTime() - (messageCount - i) * 60000); // 1 minute apart
    const isFromUser1 = i % 2 === 0;
    
    messages.push({
      id: `msg_${i + 1}`,
      content: `Test message ${i + 1} from ${isFromUser1 ? user1.username : user2.username}`,
      from: isFromUser1 ? user1.username : user2.username,
      to: isFromUser1 ? user2.username : user1.username,
      timestamp: timestamp.toISOString(),
      read: i < messageCount - 1 // All but last message are read
    });
  }
  
  return {
    conversationId: `conv_${user1.username}_${user2.username}`,
    participants: [user1.username, user2.username],
    messages,
    lastMessage: messages[messages.length - 1],
    unreadCount: 1
  };
}

/**
 * Generate test member data
 */
export function generateTestMember(overrides: Partial<any> = {}) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  return {
    id: timestamp,
    username: `testmember_${random}`,
    email: `member_${random}@example.com`,
    name: `Test Member ${random}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${random}`,
    bio: `This is a test bio for member ${random}`,
    skills: ['JavaScript', 'React', 'Node.js'],
    location: 'San Francisco, CA',
    company: 'Test Company',
    title: 'Software Engineer',
    ...overrides
  };
}

/**
 * Sample test members for consistent testing
 */
export const SAMPLE_MEMBERS = [
  generateTestMember({
    id: 1,
    username: 'sarah.chen',
    email: 'sarah.chen@example.com',
    name: 'Sarah Chen',
    skills: ['React', 'TypeScript', 'UI/UX']
  }),
  generateTestMember({
    id: 2,
    username: 'alex.johnson',
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    skills: ['Python', 'Django', 'Data Science']
  }),
  generateTestMember({
    id: 3,
    username: 'maria.garcia',
    email: 'maria.garcia@example.com',
    name: 'Maria Garcia',
    skills: ['Java', 'Spring Boot', 'Microservices']
  }),
  generateTestMember({
    id: 4,
    username: 'james.kim',
    email: 'james.kim@example.com',
    name: 'James Kim',
    skills: ['Go', 'Kubernetes', 'DevOps']
  }),
  generateTestMember({
    id: 5,
    username: 'kai3',
    email: 'kai3@example.com',
    name: 'Kai Lin',
    skills: ['Vue.js', 'Node.js', 'Full Stack']
  })
];

/**
 * Clean up test data (for cleanup in tests)
 */
export async function cleanupTestData(): Promise<void> {
  // This would typically interact with the database to clean up test data
  // For now, it's a placeholder for future implementation
  console.log('Cleaning up test data...');
}

/**
 * Setup test data (for setup in tests)
 */
export async function setupTestData(): Promise<void> {
  // This would typically set up test data in the database
  // For now, it's a placeholder for future implementation
  console.log('Setting up test data...');
}
