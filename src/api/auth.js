import api from './index';

export const authApi = {
  async login(username, password) {
    // 🔥 PERHATIKAN: pakai /auth/login (tanpa api)
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  async register(userData) {
    // 🔥 PERHATIKAN: pakai /auth/register (tanpa api)
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  }
};