import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, '')
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gigflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auth errors
// NOTE: We only clear credentials here — actual redirect is handled by AuthContext
// to avoid redirect loops during session restoration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear stored credentials; AuthContext handles navigation
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('gigflow_token');
        localStorage.removeItem('gigflow_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
