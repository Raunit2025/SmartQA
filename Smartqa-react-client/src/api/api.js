// src/api/api.js

import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';

const api = axios.create({
  baseURL: serverEndpoint,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        // Add the token to the Authorization header
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
