// Authentication utility functions (cookie-based via BFF)
export const auth = {
  login: (_token: string, user: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user', JSON.stringify(user))
      } catch (e) {
        console.error('Error saving user data:', e)
      }
    }
  },

  // Deprecated: tokens are httpOnly cookies set by BFF. Keep for backward-compat no-op.
  setToken: (_token: string) => { },

  getToken: () => null,

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
    if (typeof document !== 'undefined') {
      const c = document.cookie || ''
      return c.includes('accessToken=') || c.includes('refreshToken=')
    }
    return false
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch { }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      window.location.href = '/login'
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