// User-related types based on Spring Boot backend
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'MODERATOR';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  lastLogin: string | null;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}