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
    isStudent: (state) => state.role === 'siswa' || state.role === 'student',
    isTeacher: (state) => state.role === 'guru' || state.role === 'teacher',
    userName: (state) => state.user?.full_name || state.user?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    // 🔥 LOGIN - SUPPORT guru/siswa DAN teacher/student
    async login(username, password, role) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔐 Login - username:', username, 'role:', role);
        
        let response;
        if (role === 'guru' || role === 'teacher') {
          response = await authApi.loginGuru(username, password);
        } else {
          response = await authApi.loginSiswa(username, password);
        }
        
        console.log('🔐 Login response:', response);
        
        if (response && response.success === true) {
          const userData = response.data.user;
          const token = response.data.token;
          
          // 🔥 AMBIL ROLE DARI BACKEND
          let userRole = userData.role;
          console.log('📌 Role dari backend:', userRole);
          
          // 🔥 KONVERSI ROLE KE FORMAT YANG KITA PAKAI
          // Jika backend kirim 'teacher' atau 'student', kita ubah ke 'guru' atau 'siswa'
          if (userRole === 'teacher') userRole = 'guru';
          if (userRole === 'student') userRole = 'siswa';
          
          console.log('📌 Role setelah konversi:', userRole);
          
          this.token = token;
          this.user = userData;
          this.role = userRole;
          this.isAuthenticated = true;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', userRole);
          localStorage.setItem('user_data', JSON.stringify(userData));
          localStorage.setItem('user_name', userData.full_name || userData.name || username);
          
          console.log('✅ Login success - Role tersimpan:', this.role);
          
          return { success: true, data: response.data };
        }
        
        return { success: false, message: response?.message || 'Login gagal' };
      } catch (error) {
        console.error('❌ Login error:', error);
        this.error = error.response?.data?.message || error.message || 'Terjadi kesalahan';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 🔥 REGISTER ONLY
    async registerOnly(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Register only:', userData);
        
        let response;
        // 🔥 CEK ROLE UNTUK PILIH ENDPOINT
        if (userData.role === 'guru' || userData.role === 'teacher') {
          response = await authApi.registerGuru(userData);
        } else {
          response = await authApi.registerSiswa(userData);
        }
        
        console.log('📥 Register response:', response);
        
        if (response && response.success === true) {
          return { 
            success: true, 
            data: response.data,
            message: response.message || 'Registrasi berhasil'
          };
        }
        
        return { 
          success: false, 
          message: response?.message || 'Registrasi gagal'
        };
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

    // 🔥 REGISTER + AUTO LOGIN
    async register(userData) {
      const result = await this.registerOnly(userData);
      if (result.success) {
        return await this.login(userData.username, userData.password, userData.role);
      }
      return result;
    },

    // 🔥 LOGOUT
    async logout() {
      this.loading = true;
      
      try {
        await authApi.logout();
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
      
      console.log('📌 loadUserFromStorage - token:', token ? 'Ada' : 'Tidak ada');
      console.log('📌 loadUserFromStorage - role:', role);
      
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
        console.log('⚠️ No auth data in storage');
      }
    }
  }
});