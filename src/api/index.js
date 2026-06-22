import axios from 'axios';

// 🔥 GANTI DENGAN URL BACKEND TEMAN ANDA
const API_BASE_URL = 'http://192.168.33.102:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk handle response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
      }
      
      // Handle 422 Validation Error
      if (error.response.status === 422) {
        const errors = error.response.data.errors || {};
        const message = Object.values(errors).flat().join(', ');
        error.message = message || 'Validasi gagal';
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        error.message = 'Endpoint tidak ditemukan';
      }
    }
    return Promise.reject(error);
  }
);

export default api;