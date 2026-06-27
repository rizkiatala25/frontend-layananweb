<template>
  <div class="teacher-dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-circle"></div>
        <span class="logo-text">ZONEQUIZZZ</span>
      </div>

      <nav class="menu">
        <button class="menu-item active" @click="currentTab = 'home'">
          <span>🏠</span> Home
        </button>
        <button class="menu-item" @click="currentTab = 'library'">
          <span>📚</span> My Library
        </button>
        <button class="menu-item" @click="logout">
          <span>🚪</span> Logout
        </button>
      </nav>

      <div class="profile">
        <div class="avatar">👤</div>
        <span class="name">{{ teacherName }}</span>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content">
      <!-- HOME TAB -->
      <div v-if="currentTab === 'home'" class="home-tab">
        <h1>Hello, {{ teacherName }}! 👋</h1>
        <p class="subtitle">Let's create a new quiz!</p>

        <!-- 🔥 TOMBOL CREATE QUIZ - LANGSUNG KE HALAMAN CREATE -->
        <button class="btn-create" @click="goToCreateQuiz">
          ✏️ Create New Quiz
        </button>

        <div class="info-card">
          <h3>📊 Quick Stats</h3>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">{{ quizzes.length }}</span>
              <span class="stat-label">Total Quizzes</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ publishedCount }}</span>
              <span class="stat-label">Published</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ privateCount }}</span>
              <span class="stat-label">Private</span>
            </div>
          </div>
        </div>
      </div>

      <!-- LIBRARY TAB -->
      <div v-if="currentTab === 'library'" class="library-tab">
        <h1>📚 My Library</h1>
        
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="🔍 Search quizzes..." class="search-input" />
          <button class="btn-refresh" @click="loadQuizzes">🔄 Refresh</button>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>

        <div v-else-if="filteredQuizzes.length === 0" class="empty-state">
          <p>📭 No quizzes found.</p>
          <p class="hint">Create your first quiz by clicking "Create New Quiz" on the Home tab.</p>
        </div>

        <div v-else class="quiz-grid">
          <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="quiz-card">
            <div class="quiz-header">
              <h3>{{ quiz.title }}</h3>
              <span class="status-badge" :class="quiz.visibility">
                {{ quiz.visibility === 'publish' ? '✅ Published' : '🔒 Private' }}
              </span>
            </div>
            <div class="quiz-body">
              <p>📖 {{ quiz.subject || 'General' }}</p>
              <p>📝 {{ quiz.questions?.length || 0 }} Questions</p>
              <p>⏱️ {{ quiz.total_time || 10 }} minutes</p>
              <p v-if="quiz.visibility === 'publish'">
                🔑 Join Code: <strong>{{ quiz.join_code }}</strong>
                <button class="btn-copy" @click="copyCode(quiz.join_code)">📋</button>
              </p>
            </div>
            <div class="quiz-actions">
              <button class="btn-toggle" @click="toggleVisibility(quiz.id)">
                {{ quiz.visibility === 'publish' ? '🔒 Make Private' : '🌍 Publish' }}
              </button>
              <button class="btn-delete" @click="deleteQuiz(quiz.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js';

export default {
  name: 'DashboardGuru',
  data() {
    return {
      currentTab: 'home',
      searchQuery: '',
      loading: false,
      quizzes: []
    };
  },
  computed: {
    teacherName() {
      return localStorage.getItem('user_name') || 'Teacher';
    },
    publishedCount() {
      return this.quizzes.filter(q => q.visibility === 'publish').length;
    },
    privateCount() {
      return this.quizzes.filter(q => q.visibility === 'private').length;
    },
    filteredQuizzes() {
      if (!this.searchQuery.trim()) return this.quizzes;
      const query = this.searchQuery.toLowerCase();
      return this.quizzes.filter(q => 
        q.title?.toLowerCase().includes(query) ||
        q.subject?.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.loadQuizzes();
  },
  methods: {
    async loadQuizzes() {
      this.loading = true;
      setTimeout(() => {
        this.quizzes = [];
        this.loading = false;
      }, 1000);
    },
    
    // 🔥 PERBAIKI INI - LANGSUNG KE HALAMAN CREATE QUIZ
    goToCreateQuiz() {
      this.$router.push('/create-quiz');
    },
    
    toggleVisibility(id) {
      alert(`Toggle visibility for quiz ${id}`);
    },
    deleteQuiz(id) {
      if (confirm('Are you sure you want to delete this quiz?')) {
        alert(`Quiz ${id} deleted`);
      }
    },
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('✅ Join code copied!');
      });
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
/* STYLE SAMA SEPERTI SEBELUMNYA */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.teacher-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: #f0f2f5;
}

.sidebar {
  width: 250px;
  background: #1a1c29;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-circle {
  width: 40px;
  height: 40px;
  background: #6c5ce7;
  border-radius: 50%;
}

.logo-text {
  color: #7971ea;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.menu-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.menu-item.active {
  background: rgba(108, 92, 231, 0.2);
  color: #6c5ce7;
}

.menu-item span {
  font-size: 20px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.avatar {
  font-size: 32px;
}

.name {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.content {
  margin-left: 250px;
  flex: 1;
  padding: 40px;
  min-height: 100vh;
}

h1 {
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  margin-bottom: 30px;
}

.btn-create {
  padding: 14px 40px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
  margin-bottom: 30px;
}

.btn-create:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.3);
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.info-card h3 {
  color: #1e293b;
  margin-bottom: 16px;
}

.stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #6c5ce7;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
}

.library-tab h1 {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: border 0.3s;
}

.search-input:focus {
  border-color: #6c5ce7;
}

.btn-refresh {
  padding: 10px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: #e2e8f0;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.quiz-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.3s;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.quiz-header h3 {
  font-size: 16px;
  color: #1e293b;
  flex: 1;
  margin-right: 10px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.publish {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.private {
  background: #fef3c7;
  color: #92400e;
}

.quiz-body p {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}

.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: #f1f5f9;
}

.quiz-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.quiz-actions button {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.btn-toggle {
  background: #f0edff;
  color: #6c5ce7;
}

.btn-toggle:hover {
  background: #e0dbff;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
}

.spinner {
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

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  color: #94a3b8;
}

.empty-state .hint {
  font-size: 13px;
  color: #cbd5e1;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    padding: 20px 12px;
  }
  
  .logo-text, .menu-item span:last-child, .name {
    display: none;
  }
  
  .content {
    margin-left: 70px;
    padding: 20px;
  }
  
  .stats {
    gap: 20px;
  }
  
  .quiz-grid {
    grid-template-columns: 1fr;
  }
}
</style>