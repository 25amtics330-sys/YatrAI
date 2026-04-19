import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject auth token
api.interceptors.request.use(
  (config) => {
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      try {
        const parsed = JSON.parse(persistRoot);
        const auth = JSON.parse(parsed.auth || '{}');
        if (auth.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch (e) {
        // silently fail if parsing fails
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('persist:root');
        window.location.href = '/login';
      }
      if (status === 429) {
        console.warn('Rate limited. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
