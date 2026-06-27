import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    role: localStorage.getItem('user_role') || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    loading: false,
    error: null
  }),

  getters: {
    isStudent: (state) => state.role === 'siswa',
    isTeacher: (state) => state.role === 'guru',
    userName: (state) => state.user?.full_name || state.user?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    // 🔥 LOGIN SISWA
    async loginSiswa(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/api/login/siswa', { username, password });
        console.log('📥 Login Siswa response:', response.data);
        
        if (response.data.success) {
          const userData = response.data.data.user;
          const token = response.data.data.token;
          
          this.token = token;
          this.user = userData;
          this.role = 'siswa';
          this.isAuthenticated = true;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', 'siswa');
          localStorage.setItem('user_data', JSON.stringify(userData));
          localStorage.setItem('user_name', userData.full_name || userData.name || username);
          
          return { success: true, data: response.data.data };
        }
        return { success: false, message: response.data.message || 'Login gagal' };
      } catch (error) {
        console.error('❌ Login error:', error);
        this.error = error.response?.data?.message || error.message || 'Terjadi kesalahan';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 LOGIN GURU
    async loginGuru(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/api/login/guru', { username, password });
        console.log('📥 Login Guru response:', response.data);
        
        if (response.data.success) {
          const userData = response.data.data.user;
          const token = response.data.data.token;
          
          this.token = token;
          this.user = userData;
          this.role = 'guru';
          this.isAuthenticated = true;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', 'guru');
          localStorage.setItem('user_data', JSON.stringify(userData));
          localStorage.setItem('user_name', userData.full_name || userData.name || username);
          
          return { success: true, data: response.data.data };
        }
        return { success: false, message: response.data.message || 'Login gagal' };
      } catch (error) {
        console.error('❌ Login error:', error);
        this.error = error.response?.data?.message || error.message || 'Terjadi kesalahan';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 REGISTER SISWA
    async registerSiswa(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/api/register/siswa', userData);
        console.log('📥 Register Siswa response:', response.data);
        
        if (response.data.success) {
          return { 
            success: true, 
            data: response.data.data,
            message: response.data.message || 'Registrasi berhasil'
          };
        }
        return { success: false, message: response.data.message || 'Registrasi gagal' };
      } catch (error) {
        console.error('❌ Register error:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan'
        };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 REGISTER GURU
    async registerGuru(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/api/register/guru', userData);
        console.log('📥 Register Guru response:', response.data);
        
        if (response.data.success) {
          return { 
            success: true, 
            data: response.data.data,
            message: response.data.message || 'Registrasi berhasil'
          };
        }
        return { success: false, message: response.data.message || 'Registrasi gagal' };
      } catch (error) {
        console.error('❌ Register error:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan'
        };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 LOGOUT
    async logout() {
      this.loading = true;
      
      try {
        await api.post('/api/logout');
      } catch (error) {
        console.warn('Logout API error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.role = null;
        this.isAuthenticated = false;
        this.error = null;
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_name');
        
        this.loading = false;
      }
    },

    // 🔥 LOAD FROM STORAGE
    loadUserFromStorage() {
      const token = localStorage.getItem('auth_token');
      const role = localStorage.getItem('user_role');
      const userData = localStorage.getItem('user_data');
      
      if (token && role) {
        this.token = token;
        this.role = role;
        this.isAuthenticated = true;
        
        if (userData) {
          try {
            this.user = JSON.parse(userData);
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        
        console.log('✅ Auth loaded - Role:', this.role);
      } else {
        this.token = null;
        this.role = null;
        this.isAuthenticated = false;
        this.user = null;
      }
    }
  }
});