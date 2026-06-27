<template>
  <div class="login-wrapper">
    <header class="app-header">
      <div class="logo-group">
        <div class="logo-circle"></div>
        <span class="app-title-header">ZONEQUIZZZ</span>
      </div>
    </header>

    <div class="background-decorations" style="pointer-events: none;">
      <div class="curve-left"></div>
      <div class="curve-right"></div>
    </div>

    <main class="login-main">
      <div class="login-card">
        <div class="card-logo-center">
          <div class="logo-circle-small"></div>
          <span class="app-title-card">ZONEQUIZZZ</span>
        </div>

        <h1 class="form-title">{{ title || 'Login' }}</h1>

        <div class="role-badge-container">
          <span class="role-badge" :class="role">
            {{ role === 'guru' ? '👨‍🏫 Teacher' : '🎓 Student' }}
          </span>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="formData.username" 
              placeholder="Username" 
              required
              autofocus
            />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input 
                :type="passwordVisible ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                placeholder="Password" 
                required
              />
              <button 
                type="button" 
                class="toggle-visibility" 
                @click="passwordVisible = !passwordVisible"
              >
                <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login-submit" :disabled="loading">
            {{ loading ? '⏳ Memproses...' : 'Login' }}
          </button>
        </form>

        <p class="footer-text">
          New to ZoneQuizizz? 
          <a href="#" @click.prevent="goToRegister" class="signup-link">
            Sign up for free account
          </a>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js';

export default {
  name: 'LoginView',
  props: {
    role: {
      type: String,
      required: true,
      validator: (value) => ['siswa', 'guru'].includes(value)
    },
    title: {
      type: String,
      default: 'Login'
    }
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        rememberMe: false
      },
      passwordVisible: false,
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      // 🔥 RESET ERROR SEBELUM LOGIN
      this.errorMessage = '';
      this.loading = true;
      
      try {
        const authStore = useAuthStore();
        
        console.log(`📌 Login ${this.role} - username:`, this.formData.username);
        
        let result;
        if (this.role === 'guru') {
          result = await authStore.loginGuru(
            this.formData.username,
            this.formData.password
          );
        } else {
          result = await authStore.loginSiswa(
            this.formData.username,
            this.formData.password
          );
        }
        
        console.log('📌 Login result:', result);
        
        // 🔥 HANYA REDIRECT JIKA SUKSES
        if (result.success) {
          const userRole = authStore.role || localStorage.getItem('user_role');
          console.log('📌 Final role:', userRole);
          
          if (userRole === 'guru') {
            console.log('✅ Redirect ke Teacher Dashboard');
            this.$router.push('/dashboard/guru');
          } else if (userRole === 'siswa') {
            console.log('✅ Redirect ke Student Dashboard');
            this.$router.push('/dashboard/siswa');
          } else {
            console.log('⚠️ Role tidak dikenal:', userRole);
            this.$router.push('/');
          }
        } else {
          // 🔥 TAMPILKAN ERROR, JANGAN REDIRECT
          this.errorMessage = result.message || 'Login gagal. Silakan cek username dan password Anda.';
          console.log('❌ Login error:', this.errorMessage);
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        
        // 🔥 TAMPILKAN ERROR DETAIL
        if (error.response?.status === 401) {
          this.errorMessage = '❌ Username atau password salah!';
        } else if (error.message === 'Network Error') {
          this.errorMessage = '❌ Tidak dapat terhubung ke server. Pastikan backend berjalan.';
        } else if (error.response?.data?.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      this.$router.push(`/register/${this.role}`);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.login-wrapper {
  --primary-purple: #7468f3;
  --dark-background: #1a1c29;
  --light-card: #ffffff;
  --text-label: #333333;
  --text-input: #666666;

  background-color: var(--dark-background);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-header {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background-color: var(--primary-purple);
  border-radius: 50%;
}

.app-title-header {
  color: #7971ea;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
}

.background-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none !important;
  z-index: 1;
}

.curve-left {
  position: absolute;
  top: 25%;
  left: -15%;
  width: 700px;
  height: 500px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50% 50% 0 0;
  transform: rotate(-15deg);
  pointer-events: none !important;
}

.curve-right {
  position: absolute;
  bottom: 20%;
  right: -10%;
  width: 600px;
  height: 400px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0 0 50% 50%;
  transform: rotate(-25deg);
  pointer-events: none !important;
}

.login-main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.login-card {
  background-color: var(--light-card);
  width: 100%;
  max-width: 440px;
  border-radius: 12px;
  padding: 40px 35px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border: 2px solid #00c2ff;
  position: relative;
  z-index: 10;
}

.card-logo-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 15px;
}

.logo-circle-small {
  width: 14px;
  height: 14px;
  background-color: var(--primary-purple);
  border-radius: 50%;
}

.app-title-card {
  color: var(--primary-purple);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.form-title {
  color: #333333;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: 0.5px;
}

.role-badge-container {
  text-align: center;
  margin-bottom: 20px;
}

.role-badge {
  display: inline-block;
  padding: 6px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.role-badge.siswa {
  background: #dbeafe;
  color: #1d4ed8;
}

.role-badge.guru {
  background: #fce7f3;
  color: #be185d;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
  position: relative;
  z-index: 20;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: var(--text-label);
  margin-bottom: 8px;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-input);
  background-color: #fff;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;
  position: relative;
  z-index: 20;
}

.input-group input:focus {
  outline: none;
  border-color: #00c2ff;
  box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1);
}

.password-wrapper {
  position: relative;
  z-index: 20;
}

.toggle-visibility {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease;
  z-index: 30;
}

.toggle-visibility:hover {
  color: #7468f3;
}

.btn-login-submit {
  width: 100%;
  background: linear-gradient(135deg, #7468f3 0%, #635bff 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 5px;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 20;
}

.btn-login-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(116, 104, 243, 0.3);
}

.btn-login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  text-align: center;
  border: 1px solid #fecaca;
  position: relative;
  z-index: 20;
}

.footer-text {
  margin-top: 20px;
  font-size: 13px;
  color: #666666;
  text-align: center;
  position: relative;
  z-index: 20;
}

.signup-link {
  color: #7468f3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: #635bff;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .app-header {
    top: 20px;
    left: 20px;
  }
  
  .app-title-header {
    font-size: 20px;
  }
  
  .logo-circle {
    width: 40px;
    height: 40px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .role-selector {
    flex-direction: column;
  }
}
</style>