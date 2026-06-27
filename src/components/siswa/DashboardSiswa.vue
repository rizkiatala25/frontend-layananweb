<template>
  <div class="student-dashboard">
    <header class="navbar">
      <div class="nav-left">
        <div class="logo">
          <div class="logo-circle"></div>
          <span class="logo-text">ZONEQUIZZZ</span>
        </div>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Find a quiz" v-model="searchQuery" />
        </div>
      </div>
      
      <nav class="nav-center">
        <a href="#" class="nav-link active" @click.prevent="currentTab = 'home'">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a href="#" class="nav-link" @click.prevent="currentTab = 'activity'">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Activity
        </a>
      </nav>

      <div class="nav-right">
        <div class="profile">
          <div class="avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <span class="profile-name">{{ studentName }}</span>
          <button @click="logout" class="logout-icon" title="Logout">🚪</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="currentTab === 'home'">
        <div class="top-row">
          <div class="join-card">
            <div class="join-wrapper">
              <input type="text" placeholder="Enter a join code" v-model="joinCode" class="join-input" @keyup.enter="handleJoin" />
              <button @click="handleJoin" class="btn-join">Join</button>
            </div>
          </div>

          <div class="welcome-banner">
            <div class="welcome-text">
              <span class="welcome-date">{{ currentDate }}</span>
              <h2>Welcome Back, {{ firstName }}</h2>
              <p>Start a quiz and challenge yourself today!</p>
            </div>
            <div class="welcome-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="72" height="72"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M4.5 12.06v3.63c0 2.05 3.36 3.81 7.5 3.81s7.5-1.76 7.5-3.81v-3.63l-7.5 4.09-7.5-4.09z"/></svg>
            </div>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Available Quizzes</h2>
          
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading quizzes...</p>
          </div>

          <div v-else-if="filteredQuizzes.length === 0" class="empty-state">
            <p>No quizzes available.</p>
            <p class="empty-sub">Ask your teacher for a join code!</p>
          </div>

          <div v-else class="card-grid">
            <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="subject-card" @click="openQuiz(quiz)">
              <div class="card-cover">
                <img v-if="quiz.cover_image" :src="quiz.cover_image" alt="Cover" class="cover-image" />
                <div v-else class="card-emoji">{{ quiz.emoji || '📝' }}</div>
              </div>
              <div class="card-body">
                <span class="card-badge">{{ quiz.total_questions || quiz.questions?.length || 0 }} Qs</span>
                <h3 class="card-title">{{ quiz.title }}</h3>
                <span class="quiz-source">👨‍🏫 Teacher</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Recent Activity</h2>
          <div v-if="recentActivities.length === 0" class="empty-state">
            <p>Belum ada kuis yang dikerjakan</p>
          </div>
          <div v-else class="card-grid">
            <div v-for="(item, index) in recentActivities" :key="index" class="activity-card">
              <div class="card-emoji">{{ item.emoji }}</div>
              <div class="card-body">
                <span class="card-badge">{{ item.questions }} Qs</span>
                <h3 class="card-title">{{ item.title }}</h3>
                <div class="card-accuracy" :class="item.accuracyClass">{{ item.accuracy }} accuracy</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-if="currentTab === 'activity'" class="activity-page">
        <h2 class="activity-title">Activity History</h2>
        <p class="activity-subtitle">Kuis yang sudah kamu kerjakan</p>
        
        <div v-if="allActivities.length === 0" class="empty-state">
          <p>Belum ada history aktivitas</p>
        </div>
        <div v-else class="activity-list">
          <div v-for="(item, index) in allActivities" :key="index" class="activity-item">
            <div class="activity-icon">{{ item.emoji }}</div>
            <div class="activity-info">
              <h4 class="activity-name">{{ item.title }}</h4>
              <span class="activity-date">{{ item.date }}</span>
            </div>
            <div class="activity-result">
              <span class="activity-score" :class="item.accuracyClass">{{ item.accuracy }}</span>
            </div>
            <button class="btn-delete-history" @click="deleteHistory(index)" title="Hapus history">✕</button>
          </div>
        </div>
        <button v-if="allActivities.length > 0" class="btn-clear-all" @click="clearAllHistory">Hapus Semua History</button>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js';

export default {
  name: 'DashboardSiswa',
  data() {
    return {
      currentTab: 'home',
      searchQuery: '',
      joinCode: '',
      loading: false,
      quizzes: [],
      recentActivities: [],
      allActivities: []
    };
  },
  computed: {
    studentName() {
      return localStorage.getItem('user_name') || 'Student';
    },
    firstName() {
      return this.studentName.split(' ')[0] || 'Student';
    },
    currentDate() {
      return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    filteredQuizzes() {
      if (!this.searchQuery.trim()) return this.quizzes;
      const query = this.searchQuery.toLowerCase();
      return this.quizzes.filter(q => q.title?.toLowerCase().includes(query));
    }
  },
  mounted() {
    this.loadQuizzes();
    this.loadFromStorage();
  },
  methods: {
    async loadQuizzes() {
      this.loading = true;
      // Simulasi loading
      setTimeout(() => {
        this.quizzes = [];
        this.loading = false;
      }, 1000);
    },
    loadFromStorage() {
      // Load from localStorage
    },
    handleJoin() {
      alert('Join feature coming soon!');
    },
    openQuiz(quiz) {
      alert(`Opening quiz: ${quiz.title}`);
    },
    deleteHistory(index) {
      this.allActivities.splice(index, 1);
    },
    clearAllHistory() {
      this.allActivities = [];
      this.recentActivities = [];
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.student-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 40px;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background: #7468f3;
  border-radius: 50%;
}

.logo-text {
  font-weight: 600;
  font-size: 18px;
  color: #7468f3;
  letter-spacing: 0.5px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 14px;
  margin-left: 8px;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  color: #334155;
  width: 180px;
  background: transparent;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.nav-center {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 4px;
  position: relative;
  transition: color 0.2s;
  cursor: pointer;
}

.nav-link:hover {
  color: #475569;
}

.nav-link.active {
  color: #7468f3;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  height: 2.5px;
  background: #7468f3;
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.logout-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 4px;
}

.logout-icon:hover {
  opacity: 1;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 40px;
}

.top-row {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 24px;
  margin-bottom: 36px;
}

.join-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
}

.join-wrapper {
  display: flex;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 4px;
  background: white;
}

.join-input {
  flex: 1;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  color: #334155;
  background: transparent;
}

.join-input::placeholder {
  color: #94a3b8;
}

.btn-join {
  background: #7468f3;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-join:hover {
  background: #635bff;
}

.welcome-banner {
  background: linear-gradient(135deg, #7468f3 0%, #635bff 100%);
  border-radius: 12px;
  padding: 24px 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(116, 104, 243, 0.25);
}

.welcome-date {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 400;
}

.welcome-text h2 {
  margin: 4px 0 2px 0;
  font-size: 20px;
  font-weight: 600;
}

.welcome-text p {
  margin: 0;
  font-size: 13px;
  opacity: 0.85;
  font-weight: 300;
}

.welcome-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section {
  margin-bottom: 36px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 18px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.25s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.activity-card .card-emoji {
  height: 100px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.activity-card .card-body {
  padding: 14px 16px 16px;
}

.activity-card .card-badge {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.activity-card .card-title {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin: 2px 0 10px 0;
  text-transform: capitalize;
}

.card-accuracy {
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
}

.accuracy-green {
  background: #4ade80;
}

.accuracy-red {
  background: #f87171;
}

.subject-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.25s ease;
}

.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.card-cover {
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-emoji {
  font-size: 48px;
}

.subject-card .card-body {
  padding: 14px 16px 16px;
}

.subject-card .card-badge {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.subject-card .card-title {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin: 2px 0 4px 0;
  text-transform: capitalize;
}

.quiz-source {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  background: #dbeafe;
  color: #1d4ed8;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-state p {
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-sub {
  font-size: 13px;
  margin-top: 4px;
  color: #cbd5e1;
}

.activity-page {
  padding: 10px 0;
}

.activity-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.activity-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 24px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.activity-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.activity-icon {
  font-size: 32px;
}

.activity-info {
  flex: 1;
}

.activity-name {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.activity-date {
  font-size: 12px;
  color: #94a3b8;
}

.activity-result {
  margin-right: 12px;
}

.activity-score {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  color: white;
}

.activity-score.accuracy-green {
  background: #4ade80;
}

.activity-score.accuracy-red {
  background: #f87171;
}

.btn-delete-history {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-delete-history:hover {
  background: #fee2e2;
  color: #dc2626;
}

.btn-clear-all {
  margin-top: 20px;
  padding: 10px 24px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-all:hover {
  background: #fecaca;
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 16px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .nav-center {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .search-box input {
    width: 120px;
  }

  .top-row {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .welcome-banner {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .welcome-icon svg {
    width: 56px;
    height: 56px;
  }

  .activity-item {
    flex-wrap: wrap;
  }

  .activity-result {
    margin-left: auto;
  }
}
</style>