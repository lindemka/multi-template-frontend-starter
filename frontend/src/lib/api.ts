import axios from 'axios';
import { ApiError } from '@/types/api';

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

export default api;

// User API endpoints
export const userApi = {
  async getById(id: string | number) {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  async getAll() {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  async update(id: string | number, data: Record<string, unknown>) {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },
  
  async delete(id: string | number) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};