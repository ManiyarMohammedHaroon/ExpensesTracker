import axios from 'axios';

/**
 * Centalized API configuration for Expenses Tracker.
 * 
 * This utility ensures that the frontend always uses the correct backend URL,
 * whether running locally (localhost:5000) or deployed via KUBEX (using VITE_API_URL).
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
