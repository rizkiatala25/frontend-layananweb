<template>
  <div id="app">
    <HomeView 
      v-if="currentPage === 'home'" 
      @navigate-to-signup="changePage('signup')" 
    />

    <SignUpView 
      v-else-if="currentPage === 'signup'" 
      @navigate-to-quiz="changePage('quiz')" 
    />

    <div v-else-if="currentPage === 'quiz'" class="quiz-arena">
      <div class="quiz-placeholder-card">
        <h2>🎮 Selamat Datang di Arena Kuis ZONEQUIZZZ!</h2>
        <p>Frontend siap digunakan. Tunggu temanmu menyelesaikan fungsi API Lumen ya!</p>
        <button @click="changePage('home')" class="btn-back">Kembali ke Beranda 🔄</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import SignUpView from './views/SignUpView.vue';

// State untuk mengatur halaman aktif: 'home', 'signup', atau 'quiz'
const currentPage = ref('home');

const changePage = (pageName) => {
  currentPage.value = pageName;
};
</script>

<style>
/* Style global untuk reset dan testing page */
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #1a1c29;
}

.quiz-arena {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
  color: white;
}

.quiz-placeholder-card {
  background: white;
  color: #333;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.btn-back {
  background-color: #635bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
</style>