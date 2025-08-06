// User-related types based on Spring Boot backend
export interface User {
  id: number; // Spring Boot Long maps to TypeScript number
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'MODERATOR';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  lastLogin: string | null; // ISO date string from Spring Boot
  avatar?: string;
  createdAt?: string; // ISO date string from Spring Boot
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