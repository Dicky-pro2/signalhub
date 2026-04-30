// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser(token);
                    setUser(response.user);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('auth_token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        
        loadUser();
    }, [token]);

    const signUp = async (email, password, fullName, role = 'customer') => {
        const response = await authAPI.signup(email, password, fullName, role);
        
        const { user: userData, token: newToken } = response;
        
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        setUser(userData);
        
        return userData;
    };

    const signIn = async (email, password) => {
        const response = await authAPI.login(email, password);
        
        const { user: userData, token: newToken } = response;
        
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        setUser(userData);
        
        return userData;
    };

    const signOut = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateUser, token }}>
            {children}
        </AuthContext.Provider>
    );
};