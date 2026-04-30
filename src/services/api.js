// src/services/api.js
const API_URL = 'http://localhost:5000/api';

export const authAPI = {
    // Signup - connects to backend
    signup: async (email, password, fullName, role = 'customer') => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName, role })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Signup failed');
        }
        return data;
    },
    
    // Login - connects to backend
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        return data;
    },
};