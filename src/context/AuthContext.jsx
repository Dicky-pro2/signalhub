import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/cocobase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loaded user from storage:', parsedUser); // Debug log
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user:', e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, fullName, selectedRole = 'customer') => {
    try {
      // For demo purposes, we'll set role based on selection
      // In production, this would come from your Cocobase API
      let role = selectedRole;
      
      // Demo logic: if email contains 'provider', set role to provider
      // This is just for testing - remove in production
      if (email.includes('provider')) {
        role = 'provider';
      } else if (email.includes('admin')) {
        role = 'admin';
      }
      
      const userData = { 
        id: Date.now().toString(), 
        email, 
        full_name: fullName, 
        role: role,
        created_at: new Date().toISOString()
      };
      
      const token = 'mock-token-' + Date.now();
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('User signed up:', userData); // Debug log
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      // For demo purposes - determine role based on email
      let role = 'customer';
      
      if (email === 'provider@signalhub.com' || email.includes('provider')) {
        role = 'provider';
      } else if (email === 'admin@signalhub.com' || email.includes('admin')) {
        role = 'admin';
      }
      
      const userData = { 
        id: Date.now().toString(), 
        email, 
        full_name: email.split('@')[0], 
        role: role,
        last_login: new Date().toISOString()
      };
      
      const token = 'mock-token-' + Date.now();
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('User signed in:', userData); // Debug log
      return userData;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('User signed out'); // Debug log
  };

  const updateUser = (updatedData) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};