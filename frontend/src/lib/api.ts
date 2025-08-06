import axios from 'axios';
import { User, ApiError } from '@/types/api';

// Create axios instance
const api = axios.create({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin  // Use current origin when in browser (Spring Boot serves at same origin)
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.status?.toString() || 'UNKNOWN',
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

// User API functions
export const userApi = {
  getAll: (): Promise<User[]> => api.get('/api/users').then(res => res.data),
  
  getById: (id: number): Promise<User> => 
    api.get(`/api/users/${id}`).then(res => res.data),
  
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> =>
    api.post('/api/users', user).then(res => res.data),
  
  update: (id: number, user: Partial<User>): Promise<User> =>
    api.put(`/api/users/${id}`, user).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/api/users/${id}`).then(res => res.data),
};

export default api;