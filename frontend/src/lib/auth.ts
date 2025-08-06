// Authentication utility functions
export const auth = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      // Also set as cookie for middleware to check
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
          return null;
        }
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return auth.getToken() !== null;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Redirect to login
      window.location.href = '/login';
    }
  },

  getAuthHeaders: () => {
    const token = auth.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  },

  hasRole: (role: string) => {
    const user = auth.getUser();
    return user && user.role === role;
  },

  isAdmin: () => {
    return auth.hasRole('ADMIN');
  }
};