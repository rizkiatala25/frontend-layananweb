<template>
  <div class="signup-wrapper">
    <header class="app-header">
      <div class="logo-group">
        <div class="logo-circle"></div>
        <span class="app-title-header">ZONEQUIZZZ</span>
      </div>
    </header>

    <div class="background-decorations">
      <div class="curve-left"></div>
      <div class="curve-right"></div>
    </div>

    <main class="signup-main">
      <div class="signup-card">
        <div class="card-logo-center">
          <div class="logo-circle-small"></div>
          <span class="app-title-card">ZONEQUIZZZ</span>
        </div>

        <h1 class="form-title">Sign Up</h1>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSignUp">
          <div class="input-group">
            <label for="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="formData.full_name" 
              placeholder="Full Name" 
              required
            />
          </div>

          <div class="input-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="formData.username" 
              placeholder="Username" 
              required
            />
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              placeholder="Email" 
              required
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
                minlength="6"
              />
              <button 
                type="button" 
                class="toggle-visibility" 
                @click="passwordVisible = !passwordVisible"
                aria-label="Toggle Password Visibility"
              >
                <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-wrapper">
              <input 
                :type="confirmPasswordVisible ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="formData.confirm_password" 
                placeholder="Confirm Password" 
                required
              />
              <button 
                type="button" 
                class="toggle-visibility" 
                @click="confirmPasswordVisible = !confirmPasswordVisible"
                aria-label="Toggle Confirm Password Visibility"
              >
                <svg v-if="confirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-signup" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Sign Up' }}
          </button>
        </form>

        <p class="footer-text">
          Already have an account? 
          <a href="#" @click.prevent="$emit('navigate-to-login', 'student')" class="login-link">
            Login
          </a>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js';

export default {
  name: 'SignUpView',
  emits: ['navigate-to-quiz', 'navigate-to-login'],
  data() {
    return {
      formData: {
        full_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
      },
      passwordVisible: false,
      confirmPasswordVisible: false,
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async handleSignUp() {
      // Reset messages
      this.errorMessage = '';
      this.successMessage = '';

      // Validasi password match
      if (this.formData.password !== this.formData.confirm_password) {
        this.errorMessage = "Konfirmasi password tidak cocok!";
        return;
      }

      // Validasi password minimal 6 karakter
      if (this.formData.password.length < 6) {
        this.errorMessage = "Password minimal 6 karakter!";
        return;
      }

      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.errorMessage = "Format email tidak valid!";
        return;
      }

      this.loading = true;

      try {
        const authStore = useAuthStore();
        
        // Siapkan data untuk register
        const registerData = {
          full_name: this.formData.full_name,
          username: this.formData.username,
          email: this.formData.email,
          role: 'student',
          password: this.formData.password
        };

        console.log('📤 Register data:', registerData);

        // 🔥 REGISTER TANPA AUTO LOGIN
        const response = await authStore.registerOnly(registerData);

        console.log('📥 Register response:', response);

        if (response.success) {
          this.successMessage = `Akun @${this.formData.username} berhasil dibuat! Silakan login.`;
          
          // 🔥 SETELAH 1.5 DETIK, ARRAH KE HALAMAN LOGIN STUDENT
          setTimeout(() => {
            this.$emit('navigate-to-login', 'student');
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Registrasi gagal. Silakan coba lagi.';
        }
      } catch (error) {
        console.error('Register error:', error);
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          const messages = Object.values(errors).flat().join(', ');
          this.errorMessage = messages;
        } else {
          this.errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* ... style sama seperti sebelumnya ... */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.signup-wrapper {
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
  pointer-events: none;
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
}

.signup-main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.signup-card {
  background-color: var(--light-card);
  width: 100%;
  max-width: 440px;
  border-radius: 12px;
  padding: 40px 35px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border: 2px solid #00c2ff;
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
  margin-bottom: 25px;
  text-align: center;
  letter-spacing: 0.5px;
}

.input-group {
  margin-bottom: 18px;
  text-align: left;
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
}

.input-group input:focus {
  outline: none;
  border-color: #00c2ff;
  box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1);
}

.password-wrapper {
  position: relative;
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
}

.toggle-visibility:hover {
  color: #7468f3;
}

.btn-signup {
  width: 100%;
  background: linear-gradient(135deg, #7468f3 0%, #635bff 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.btn-signup:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(116, 104, 243, 0.3);
}

.btn-signup:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  text-align: center;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  text-align: center;
}

.footer-text {
  margin-top: 20px;
  font-size: 13px;
  color: #666666;
  text-align: center;
}

.login-link {
  color: #7468f3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.login-link:hover {
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
  
  .signup-card {
    padding: 30px 20px;
  }
  
  .form-title {
    font-size: 20px;
  }
}
</style>