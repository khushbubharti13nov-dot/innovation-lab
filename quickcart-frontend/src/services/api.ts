import axios from 'axios';

// Get the backend URL from our .env file
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
});

// --- Interceptor to add the token to every request ---
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('quickcart_token');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;