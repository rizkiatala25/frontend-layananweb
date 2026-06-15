<template>
  <div class="login-wrapper">
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

    <main class="login-main">
      <div class="login-card">
        <div class="card-logo-center">
          <div class="logo-circle-small"></div>
          <span class="app-title-card">ZONEQUIZZZ</span>
        </div>

        <h1 class="form-title">Sign Up</h1>

        <form @submit.prevent="handleSignUp">
          <div class="input-group">
            <label for="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="formData.fullName" 
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
            <label for="password">Pasword</label> <div class="password-wrapper">
              <input 
                :type="passwordVisible ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                placeholder="Pasword" 
                required
              />
              <button 
                type="button" 
                class="toggle-visibility" 
                @click="passwordVisible = !passwordVisible"
              >
                <span v-if="passwordVisible">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirm Pasword</label>
            <div class="password-wrapper">
              <input 
                :type="confirmPasswordVisible ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="formData.confirmPassword" 
                placeholder="Confirm Pasword" 
                required
              />
              <button 
                type="button" 
                class="toggle-visibility" 
                @click="confirmPasswordVisible = !confirmPasswordVisible"
              >
                <span v-if="confirmPasswordVisible">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-signup">SignUp</button>
        </form>

        <p class="footer-text">
          Already have an account?<a href="#" class="login-link">Login</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SignUpView',
  // Deklarasi kecocokan event baru dengan App.vue yang mengarah ke arena kuis
  emits: ['navigate-to-quiz'], 
  data() {
    return {
      formData: {
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      passwordVisible: false,
      confirmPasswordVisible: false,
    };
  },
  methods: {
    handleSignUp() {
      // 1. Validasi kecocokan password di sisi frontend
      if (this.formData.password !== this.formData.confirmPassword) {
        alert("Konfirmasi password tidak cocok! Silakan cek kembali.");
        return;
      }

      // 2. Log data ke konsol untuk memastikan binding v-model aman
      console.log("Data pendaftaran berhasil diproses:", this.formData);
      
      // 3. Notifikasi sukses mockup sebelum diintegrasikan dengan Lumen
      alert(`Akun @${this.formData.username} berhasil dibuat! Menuju ke arena kuis...`);

      // 4. PENTING: Memicu event untuk langsung pindah ke halaman arena kuis di App.vue
      this.$emit('navigate-to-quiz');
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  --primary-purple: #7468f3;
  --dark-background: #1a1c29; /* Disamakan dengan warna gelap Navy Deep di HomeView kamu */
  --light-card: #ffffff;
  --text-label: #555555;
  --text-input: #333333;

  background-color: var(--dark-background);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* --- HEADER LOGO (Atas Kiri) --- */
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
  color: #7971ea; /* Mengikuti warna teks logo dari HomeView kamu */
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
}

/* --- BACKGROUND DECORATIONS (Garis melengkung estetik) --- */
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
  border-top: 1px solid rgba(255, 255, 255, 0.08); /* Mengikuti opasitas garis HomeView */
  border-radius: 50% 50% 0 0;
  transform: rotate(-15deg);
}

.curve-right {
  position: absolute;
  bottom: 20%;
  right: -10%;
  width: 600px;
  height: 400px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* Mengikuti opasitas garis HomeView */
  border-radius: 0 0 50% 50%;
  transform: rotate(-25deg);
}

/* --- KARTU TENGAH --- */
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
  padding: 35px 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

/* Logo Kecil di Dalam Kartu */
.card-logo-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
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
  color: #111;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
}

/* --- STYLE INPUT FIELD --- */
.input-group {
  margin-bottom: 18px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 13px;
  color: var(--text-label);
  margin-bottom: 6px;
  font-weight: 600;
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
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-purple);
}

/* Password Input Khusus */
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
  font-size: 16px;
  padding: 0;
}

/* --- TOMBOL SIGN UP --- */
.btn-signup {
  width: 100%;
  background-color: #554be6; /* Menggunakan warna tombol ungu primer milikmu */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;
}

.btn-signup:hover {
  background-color: #4338ca;
}

/* --- TEXT BAWAH --- */
.footer-text {
  margin-top: 15px;
  font-size: 12px;
  color: #555;
  text-align: center;
}

.login-link {
  color: #2b78a9;
  text-decoration: none;
  font-weight: bold;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}
</style>