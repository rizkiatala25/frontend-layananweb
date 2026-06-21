<template>
  <div class="zonequiz-container">
    <header class="navbar">
      <div class="logo-area">
        <div class="circle-logo"></div>
        <span class="logo-text">ZONEQUIZZZ</span>
      </div>
      <div class="nav-links">
        <a href="#" class="nav-link">Enter code</a>
        <button @click="$emit('navigate-to-signup')" class="btn-signup">SignUp</button>
      </div>
    </header>

    <main class="main-content">
      <div class="bg-line line-1"></div>
      <div class="bg-line line-2"></div>

      <div class="hero-section">
        <h1 class="big-logo">
          Z<span class="brain-emoji">🧠</span>NEQUIZZZ
        </h1>
        
        <p class="tagline-1">Fun, Fast, and Brain-Boosting!</p>
        <p class="tagline-2">Challenge Your Mind, Own the Zone!</p>

        <div class="button-group">
          <button @click="$emit('navigate-to-login', 'teacher')" class="btn-login teacher">
            <span class="bold-text">Teacher</span>
            <span class="sub-text">Login</span>
          </button>
          
          <button @click="$emit('navigate-to-login', 'student')" class="btn-login student">
            <span class="bold-text">Student</span>
            <span class="sub-text">Login</span>
          </button>
        </div>
      </div>
    </main>

    <footer class="bottom-bar"></footer>
  </div>
</template>

<script setup>
defineEmits(['navigate-to-signup', 'navigate-to-login']);
</script>

<style scoped>
/* Reset dasar & warna background gelap sesuai gambar */
.zonequiz-container {
  background-color: #1a1c29;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* NAVBAR STYLING */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  z-index: 10;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.circle-logo {
  width: 45px;
  height: 45px;
  background-color: #635bff;
  border-radius: 50%;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 2px;
  color: #7971ea;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.btn-signup {
  background-color: #554be6;
  color: white;
  border: none;
  padding: 10px 22px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-signup:hover {
  background-color: #4338ca;
}

/* MAIN CONTENT & HERO STYLING */
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-section {
  text-align: center;
  z-index: 5;
}

.big-logo {
  font-size: 5.5rem;
  font-weight: normal;
  letter-spacing: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.brain-emoji {
  font-size: 4.5rem;
  display: inline-block;
  animation: pulse 2s infinite ease-in-out;
}

.tagline-1 {
  font-size: 1.6rem;
  color: #e2e8f0;
  margin: 0;
}

.tagline-2 {
  font-size: 1.6rem;
  color: #e2e8f0;
  margin: 5px 0 40px 0;
}

/* BUTTON LOGIN GROUP */
.button-group {
  display: flex;
  justify-content: center;
  gap: 15px; 
}

.btn-login {
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 170px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.btn-login .bold-text {
  font-size: 1.3rem;
  font-weight: bold;
}

.btn-login .sub-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Warna Tombol Spesifik */
.btn-login.teacher {
  background-color: #635bff;
  color: white;
}

.btn-login.student {
  background-color: #f1f5f9;
  color: #1e293b;
}

/* BACKGROUND DECORATIVE LINES */
.bg-line {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.line-1 {
  width: 800px;
  height: 400px;
  top: 10%;
  left: -10%;
  transform: rotate(-15deg);
}

.line-2 {
  width: 900px;
  height: 300px;
  bottom: 15%;
  right: -5%;
  transform: rotate(20deg);
}

/* FOOTER BAR */
.bottom-bar {
  background-color: #635bff;
  height: 25px;
  width: 100%;
}

/* Animasi Otak Berdenyut */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>