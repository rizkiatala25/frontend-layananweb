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
    /**
     * Login user
     */
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.login(username, password);
        
        console.log('🔐 Login Response:', response);
        
        if (response.status === true) {
          const userData = response.data.user;
          const token = response.data.token;
          
          // 🔥🔥🔥 DAFTAR USERNAME TEACHER 🔥🔥🔥
          const teacherUsernames = [
            'teacher', 
            'guru', 
            'admin', 
            'budi_guru',
            'akmal'
          ];
          
          // 🔥 TENTUKAN ROLE DARI USERNAME
          let userRole = 'student';
          let fullName = 'Student User';
          
          // CEK APAKAH USERNAME TERMASUK TEACHER
          if (teacherUsernames.includes(username.toLowerCase())) {
            userRole = 'teacher';
            fullName = 'Teacher User';
          } else {
            userRole = 'student';
            fullName = username.charAt(0).toUpperCase() + username.slice(1) + ' User';
          }
          
          // 🔥 OVERRIDE DATA DARI BACKEND
          userData.role = userRole;
          userData.full_name = fullName;
          
          console.log('📌 Final role (after override):', userRole);
          console.log('📌 Final user data:', userData);
          
          // 🔥 SIMPAN KE STATE
          this.token = token;
          this.user = userData;
          this.role = userRole;
          this.isAuthenticated = true;
          
          // 🔥 SIMPAN KE LOCALSTORAGE
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', userRole);
          localStorage.setItem('user_data', JSON.stringify(userData));
          localStorage.setItem('user_name', fullName);
          
          console.log('✅ Role saved to localStorage:', userRole);
          console.log('✅ Name saved to localStorage:', fullName);
          
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

    /**
     * Register user
     */
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.register(userData);
        
        if (response.status) {
          // Auto login setelah register
          const loginResult = await this.login(userData.username, userData.password);
          return loginResult;
        }
        
        return { success: false, message: response.message || 'Registrasi gagal' };
      } catch (error) {
        console.error('Register error:', error);
        const message = error.response?.data?.message || error.message || 'Terjadi kesalahan saat registrasi';
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear state
        this.user = null;
        this.token = null;
        this.role = null;
        this.isAuthenticated = false;
        
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_name');
      }
    },

    /**
     * Load user data from localStorage
     */
    loadUserFromStorage() {
      const token = localStorage.getItem('auth_token');
      const role = localStorage.getItem('user_role');
      const userData = localStorage.getItem('user_data');
      
      console.log('📌 Loading from storage - token:', token);
      console.log('📌 Loading from storage - role:', role);
      
      if (token && role) {
        this.token = token;
        this.role = role;
        this.isAuthenticated = true;
        
        if (userData) {
          try {
            this.user = JSON.parse(userData);
            console.log('📌 User loaded from storage:', this.user);
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
    },

    /**
     * Set role manually (for testing)
     */
    setRole(role) {
      this.role = role;
      localStorage.setItem('user_role', role);
      console.log('📌 Role manually set to:', role);
    }
  }
});