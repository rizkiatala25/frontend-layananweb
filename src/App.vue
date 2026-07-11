<template>
  <div id="app">
    <router-view @start-quiz="handleStartQuiz" />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    handleStartQuiz(quizId) {
      console.log('📌 handleStartQuiz - quizId:', quizId);
      
      // 🔥 PASTIKAN QUIZ ID VALID
      if (quizId) {
        // 🔥 KONVERSI KE NUMBER JIKA PERLU
        const id = typeof quizId === 'string' ? parseInt(quizId) : quizId;
        if (!isNaN(id) && id > 0) {
          this.$router.push(`/quiz/${id}`);
        } else {
          console.error('❌ Invalid quiz ID:', quizId);
          alert('❌ ID quiz tidak valid. Silakan coba lagi.');
        }
      } else {
        console.error('❌ Quiz ID is undefined or null');
        alert('❌ Gagal memulai quiz. ID quiz tidak ditemukan.');
      }
    }
  },
  mounted() {
    console.log('🚀 App mounted - ZONEQUIZZZ');
    
    // 🔥 CEK APAKAH ADA QUIZ ID DI URL
    const path = window.location.pathname;
    if (path.startsWith('/quiz/')) {
      const id = path.replace('/quiz/', '');
      console.log('📌 Quiz ID from URL:', id);
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  background: #f8fafc;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #7468f3;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a4bd1;
}

/* ===== UTILITY CLASSES ===== */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: 10px; }
.mt-2 { margin-top: 20px; }
.mt-3 { margin-top: 30px; }
.mb-1 { margin-bottom: 10px; }
.mb-2 { margin-bottom: 20px; }
.mb-3 { margin-bottom: 30px; }

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== LOADING SPINNER ===== */
.spinner-global {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1c29;
}

.spinner-global .spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #7468f3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== 404 PAGE ===== */
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1c29;
  color: white;
}

.not-found h1 {
  font-size: 80px;
  color: #7468f3;
  margin-bottom: 10px;
}

.not-found p {
  font-size: 20px;
  color: #94a3b8;
  margin-bottom: 30px;
}

.btn-back-home {
  padding: 12px 32px;
  background: #7468f3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.btn-back-home:hover {
  background: #635bff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(116, 104, 243, 0.3);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .not-found h1 {
    font-size: 50px;
  }
  
  .not-found p {
    font-size: 16px;
  }
}
</style>