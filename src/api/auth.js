import api from './index';

export const authApi = {
  // 🔥 LOGIN SISWA
  async loginSiswa(username, password) {
    const response = await api.post('/api/login/siswa', { 
      username, 
      password 
    });
    return response.data;
  },

  // 🔥 LOGIN GURU
  async loginGuru(username, password) {
    const response = await api.post('/api/login/guru', { 
      username, 
      password 
    });
    return response.data;
  },

  // 🔥 REGISTER SISWA
  async registerSiswa(userData) {
    const response = await api.post('/api/register/siswa', userData);
    return response.data;
  },

  // 🔥 REGISTER GURU
  async registerGuru(userData) {
    const response = await api.post('/api/register/guru', userData);
    return response.data;
  },

  // 🔥 LOGOUT
  async logout() {
    const response = await api.post('/api/logout');
    return response.data;
  },

  // 🔥 GET PROFILE
  async getProfile() {
    const response = await api.get('/api/profile');
    return response.data;
  }
};