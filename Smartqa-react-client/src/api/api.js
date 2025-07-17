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
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      // Add the token to the Authorization header
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
