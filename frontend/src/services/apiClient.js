import axios from 'axios';
import { toast } from '../components/ui/toast';

const getBaseUrl = () => {
  let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  rawUrl = rawUrl.trim().replace(/\/+$/, '');
  if (!rawUrl.endsWith('/api')) {
    rawUrl = `${rawUrl}/api`;
  }
  return rawUrl;
};

const API_BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edumanage_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error & status handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected network error occurred';

    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Clearing stored auth state.');
      // Optional: Clear token on 401 if not handling silently
    }

    return Promise.reject({
      status: error.response?.status || 500,
      message,
      data: error.response?.data || null,
    });
  }
);

export default apiClient;
