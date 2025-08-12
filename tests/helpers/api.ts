import { APIRequestContext, expect } from '@playwright/test';
import { TEST_USERS, TestUser } from './auth';

/**
 * Make an authenticated API request
 */
export async function authenticatedRequest(
  request: APIRequestContext,
  endpoint: string,
  options: {
    method?: string;
    data?: any;
    token?: string;
    user?: TestUser;
  } = {}
): Promise<any> {
  const { method = 'GET', data, token, user = TEST_USERS.sarah } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await request.request(endpoint, {
    method,
    headers,
    data: data ? JSON.stringify(data) : undefined
  });
  
  return response;
}

/**
 * Test API endpoint with authentication
 */
export async function testApiEndpoint(
  request: APIRequestContext,
  endpoint: string,
  expectedStatus: number = 200,
  options: {
    method?: string;
    data?: any;
    token?: string;
    user?: TestUser;
  } = {}
): Promise<any> {
  const response = await authenticatedRequest(request, endpoint, options);
  
  expect(response.status()).toBe(expectedStatus);
  
  if (expectedStatus >= 200 && expectedStatus < 300) {
    return await response.json();
  }
  
  return null;
}

/**
 * Test login API
 */
export async function testLoginApi(
  request: APIRequestContext,
  user: TestUser = TEST_USERS.sarah
): Promise<{ token: string; user: any }> {
  const response = await request.post('/api/auth/login', {
    data: {
      usernameOrEmail: user.email,
      password: user.password
    }
  });
  
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data).toHaveProperty('accessToken');
  expect(data).toHaveProperty('user');
  
  return {
    token: data.accessToken,
    user: data.user
  };
}

/**
 * Test members API
 */
export async function testMembersApi(
  request: APIRequestContext,
  token: string
): Promise<any[]> {
  const response = await request.get('/api/members', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const members = await response.json();
  expect(Array.isArray(members)).toBe(true);
  expect(members.length).toBeGreaterThan(0);
  
  return members;
}

/**
 * Test chat conversations API
 */
export async function testChatConversationsApi(
  request: APIRequestContext,
  token: string
): Promise<any[]> {
  const response = await request.get('/api/chat/conversations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const conversations = await response.json();
  expect(Array.isArray(conversations)).toBe(true);
  
  return conversations;
}

/**
 * Test chat messages API
 */
export async function testChatMessagesApi(
  request: APIRequestContext,
  token: string,
  username: string
): Promise<any[]> {
  const response = await request.get(`/api/chat/messages/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const messages = await response.json();
  expect(Array.isArray(messages)).toBe(true);
  
  return messages;
}

/**
 * Test send message API
 */
export async function testSendMessageApi(
  request: APIRequestContext,
  token: string,
  to: string,
  content: string
): Promise<any> {
  const response = await request.post('/api/chat/send', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      to,
      content
    }
  });
  
  expect(response.status()).toBe(200);
  
  const message = await response.json();
  expect(message).toHaveProperty('id');
  expect(message).toHaveProperty('content', content);
  expect(message).toHaveProperty('to', to);
  
  return message;
}

/**
 * Test user search API
 */
export async function testUserSearchApi(
  request: APIRequestContext,
  token: string,
  query: string
): Promise<any[]> {
  const response = await request.get(`/api/chat/users/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
  
  return users;
}

/**
 * Test WebSocket ticket API
 */
export async function testWebSocketTicketApi(
  request: APIRequestContext,
  token: string
): Promise<string> {
  const response = await request.get('/api/chat/ws-ticket', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data).toHaveProperty('token');
  
  return data.token;
}

/**
 * Test account/me API
 */
export async function testAccountMeApi(
  request: APIRequestContext,
  token: string
): Promise<any> {
  const response = await request.get('/api/account/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  const user = await response.json();
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('username');
  expect(user).toHaveProperty('email');
  
  return user;
}

/**
 * Test protected route access
 */
export async function testProtectedRoute(
  request: APIRequestContext,
  endpoint: string,
  token?: string
): Promise<void> {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await request.get(endpoint, { headers });
  
  if (token) {
    expect(response.status()).not.toBe(401);
  } else {
    expect(response.status()).toBe(401);
  }
}
