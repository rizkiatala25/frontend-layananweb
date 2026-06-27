import axios from 'axios';

// 🔥 GANTI DENGAN IP BACKEND TEMAN ANDA
const API_BASE_URL = 'http://192.168.33.105:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor request
api.interceptors.request.use(
  (config) => {
    console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`);
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;