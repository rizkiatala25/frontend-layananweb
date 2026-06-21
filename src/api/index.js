import axios from 'axios';

// 🔥 PERHATIKAN: Sekarang pakai /quizzes (tanpa api)
// Karena backend teman Anda route-nya di /quizzes
const API_BASE_URL = "http://192.168.33.103:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor untuk token
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

// Interceptor untuk response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
      }
      
      if (error.response.status === 422) {
        const errors = error.response.data.errors || {};
        const message = Object.values(errors).flat().join(', ');
        error.message = message || 'Validasi gagal';
      }
      
      if (error.response.status === 404) {
        error.message = 'Endpoint tidak ditemukan';
      }
    }
    return Promise.reject(error);
  }
);

export default api;