// src/features/auth/authService.js

import api from '../../api/api'; // <-- IMPORT our new instance

// Register user
const register = async (userData) => {
    // Use 'api' and a relative path
    const response = await api.post('/api/auth/register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    // Use 'api' and a relative path
    const response = await api.post('/api/auth/login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;