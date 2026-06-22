import { defineStore } from 'pinia';
import { authApi } from '@/api/auth';

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
    isStudent: (state) => state.role === 'student',
    isTeacher: (state) => state.role === 'teacher',
    userName: (state) => state.user?.full_name || state.user?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.login(username, password);
        
        console.log('🔐 Login Response:', response);
        
        if (response.status === true) {
          const userData = response.data.user;
          const token = response.data.token;
          
          this.token = token;
          this.user = userData;
          this.role = userData.role;
          this.isAuthenticated = true;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', userData.role);
          localStorage.setItem('user_data', JSON.stringify(userData));
          localStorage.setItem('user_name', userData.full_name || userData.name || username);
          
          return { success: true, data: response.data };
        }
        
        return { success: false, message: response.message || 'Login gagal' };
      } catch (error) {
        console.error('Login error:', error);
        const message = error.response?.data?.message || error.message || 'Terjadi kesalahan saat login';
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 REGISTER ONLY (TANPA AUTO LOGIN)
    async registerOnly(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Register data to API:', userData);
        
        const response = await authApi.register(userData);
        
        console.log('📥 Register response:', response);
        
        if (response.status === true) {
          return { 
            success: true, 
            data: response.data,
            message: response.message || 'Registrasi berhasil'
          };
        }
        
        return { 
          success: false, 
          message: response.message || 'Registrasi gagal' 
        };
      } catch (error) {
        console.error('Register error:', error);
        
        let message = 'Terjadi kesalahan saat registrasi';
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat().join(', ');
          message = errors;
        }
        
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 REGISTER + AUTO LOGIN (untuk keperluan lain jika dibutuhkan)
    async register(userData) {
      const result = await this.registerOnly(userData);
      if (result.success) {
        // Auto login setelah register
        const loginResult = await this.login(userData.username, userData.password);
        return loginResult;
      }
      return result;
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.role = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_name');
      }
    },

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
      }
    }
  }
});