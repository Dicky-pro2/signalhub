// This is a separate auth service for handling authentication logic
// It works alongside the AuthContext

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export const authService = {
  // Get stored token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  // Get stored user
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  
  // Set auth data
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  // Check user role
  hasRole: (role) => {
    const user = authService.getUser();
    return user && user.role === role;
  },
  
  // Update user data
  updateUser: (userData) => {
    const currentUser = authService.getUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
};

export default authService;