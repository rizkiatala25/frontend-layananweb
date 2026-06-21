<template>
  <div class="teacher-dashboard">
    
    <!-- SIDEBAR KIRI -->
    <aside class="sidebar-main">
      <div class="sidebar-brand">
        <div class="logo-circle"></div>
        <span class="brand-text">ZONEQUIZZZ</span>
      </div>

      <nav class="sidebar-menu">
        <a href="#" class="menu-item active" @click.prevent="currentMenu = 'home'">
          <svg class="menu-icon-svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="menu-text">Home</span>
        </a>
        
        <a href="#" class="menu-item" @click.prevent="currentMenu = 'library'">
          <svg class="menu-icon-svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span class="menu-text">My library</span>
        </a>
      </nav>

      <!-- Profile di bawah -->
      <div class="sidebar-footer">
        <div class="profile-card">
          <div class="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="profile-info">
            <span class="profile-name">{{ teacherName }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      
      <!-- HOME PAGE -->
      <div v-if="currentMenu === 'home'" class="home-page">
        <header class="content-header">
          <h1>Hello, {{ teacherName.split(' ')[0] || teacherName }} Let's get started</h1>
        </header>

        <div class="create-section">
          <button class="btn-create" @click="isCreatingQuestion = !isCreatingQuestion">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
            </svg>
            Create
          </button>
        </div>

        <!-- Question Creator Card -->
        <div class="creator-card-wrapper" @mouseenter="isCreatingQuestion = true" @mouseleave="isCreatingQuestion = false">
          <div class="creator-card" :class="{ active: isCreatingQuestion }">
            <div class="creator-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <line x1="9" y1="10" x2="12" y2="10"></line>
                <line x1="9" y1="14" x2="14" y2="14"></line>
                <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="17" cy="14" r="1" fill="currentColor"></circle>
              </svg>
            </div>
            <div class="creator-info">
              <h3>Multiple choice</h3>
              <p>Pick the right answer and test your knowledge!</p>
            </div>
          </div>

          <!-- Editor Box -->
          <transition name="slide-up">
            <div v-if="isCreatingQuestion" class="editor-box">
              <div class="editor-content">
                <div class="question-input-wrapper">
                  <input 
                    type="text" 
                    v-model="questionForm.text" 
                    placeholder="Write the text" 
                    class="question-input"
                  />
                </div>
                
                <div class="options-grid">
                  <div class="option-item option-a">
                    <input type="text" v-model="questionForm.option_a" placeholder="A" />
                  </div>
                  <div class="option-item option-b">
                    <input type="text" v-model="questionForm.option_b" placeholder="B" />
                  </div>
                  <div class="option-item option-c">
                    <input type="text" v-model="questionForm.option_c" placeholder="C" />
                  </div>
                  <div class="option-item option-d">
                    <input type="text" v-model="questionForm.option_d" placeholder="D" />
                  </div>
                </div>
                
                <div class="editor-actions">
                  <button class="btn-cancel" @click="isCreatingQuestion = false">Cancel</button>
                  <button class="btn-save" @click="saveQuestion">Save Question</button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- LIBRARY PAGE -->
      <div v-if="currentMenu === 'library'" class="library-page">
        <div class="search-bar">
          <div class="search-wrapper">
            <span class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              v-model="searchLibraryQuery" 
              placeholder="Search by activity name" 
              class="search-input"
            />
          </div>
        </div>

        <div class="library-content">
          <h2 class="library-title">Created by me</h2>
          
          <div class="filter-tabs">
            <button class="filter-tab active">Created ({{ filteredQuizzes.length }})</button>
            <button class="filter-tab">Draft</button>
          </div>

          <div class="quiz-table">
            <div class="table-header">
              <div class="col-title">Activity detail</div>
              <div class="col-time">Creation time</div>
            </div>

            <div class="table-body">
              <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="table-row">
                <div class="col-title">
                  <div class="quiz-icon"></div>
                  <div class="quiz-meta">
                    <h4 class="quiz-name">{{ quiz.title }}</h4>
                    <span class="quiz-tags">
                      <span class="dot-green">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 2px;">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      • {{ quiz.questions_count || 0 }} Qs • Grade {{ quiz.grade || 1 }}
                    </span>
                  </div>
                </div>
                <div class="col-time">
                  <span class="time-text">{{ quiz.creation_time || 'Just now' }}</span>
                  <div class="action-buttons">
                    <button class="btn-play" @click="playQuiz(quiz.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Play
                    </button>
                    <button class="btn-delete" @click="deleteQuizFromBackend(quiz.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="filteredQuizzes.length === 0" class="empty-state">
                No activity found.
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js';
import { useQuizStore } from '@/stores/quizStore.js';

export default {
  name: 'TeacherDashboardView',
  emits: ['logout ', 'create-quiz'],
  data() {
    return {
      currentMenu: 'home',
      isCreatingQuestion: false,
      searchLibraryQuery: '',
      quizzes: [],
      loading: false,
      error: null,
      
      questionForm: { 
        text: '', 
        option_a: '', 
        option_b: '', 
        option_c: '', 
        option_d: '', 
        correct_answer: 'A' 
      }
    };
  },
  computed: {
    teacherName() {
      const authStore = useAuthStore();
      return authStore.user?.full_name || 
             authStore.user?.name || 
             localStorage.getItem('user_name') || 
             'Akmal Randi';
    },
    
    filteredQuizzes() {
      return this.quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(this.searchLibraryQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchTeacherData();
  },
  methods: {
    async fetchTeacherData() {
      this.loading = true;
      
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.fetchQuizzes();
        
        if (result.success) {
          this.quizzes = result.data.map(q => ({
            id: q.id,
            title: q.title,
            questions_count: q.total_questions || 0,
            grade: q.grade || 1,
            creation_time: this.formatTime(q.created_at),
            status: q.status || 'available'
          }));
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        this.loading = false;
      }
    },

    formatTime(dateString) {
      if (!dateString) return 'Just now';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
      if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
      if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
      return 'Just now';
    },

    async saveQuestion() {
      if (!this.questionForm.text) {
        alert('Please enter a question');
        return;
      }
      
      try {
        const quizStore = useQuizStore();
        
        const quizData = {
          title: this.questionForm.text || 'Untitled Quiz',
          description: 'Quiz created from teacher dashboard',
          duration: 10,
          questions: [{
            question: this.questionForm.text,
            options: [
              this.questionForm.option_a || 'Option A',
              this.questionForm.option_b || 'Option B',
              this.questionForm.option_c || 'Option C',
              this.questionForm.option_d || 'Option D'
            ],
            correct_answer: this.questionForm.correct_answer
          }]
        };
        
        const result = await quizStore.createQuiz(quizData);
        
        if (result.success) {
          alert('Quiz berhasil dibuat!');
          await this.fetchTeacherData();
          this.questionForm = { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' };
          this.isCreatingQuestion = false;
        } else {
          alert(result.message || 'Gagal membuat quiz');
        }
      } catch (error) {
        console.error('Create quiz error:', error);
        alert('Gagal membuat quiz. Silakan coba lagi.');
      }
    },

    async deleteQuizFromBackend(id) {
      if (confirm("Are you sure you want to delete this activity?")) {
        try {
          const quizStore = useQuizStore();
          const result = await quizStore.deleteQuiz(id);
          
          if (result.success) {
            this.quizzes = this.quizzes.filter(q => q.id !== id);
            alert('Quiz berhasil dihapus!');
          } else {
            alert(result.message || 'Gagal menghapus quiz');
          }
        } catch (error) {
          console.error('Delete quiz error:', error);
          alert('Gagal menghapus quiz. Silakan coba lagi.');
        }
      }
    },

    playQuiz(id) {
      alert(`Playing quiz ID: ${id}`);
    },

    async handleLogout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.teacher-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: #ffffff;
}

/* ===== SIDEBAR ===== */
.sidebar-main {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  padding: 28px 20px;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 50;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding-left: 8px;
}

.logo-circle {
  width: 36px;
  height: 36px;
  background: #6c5ce7;
  border-radius: 50%;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #6c5ce7;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.menu-item.active {
  background: #f1f5f9;
  color: #6c5ce7;
}

.menu-icon-svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.menu-text {
  font-size: 14px;
}

/* ===== SIDEBAR FOOTER ===== */
.sidebar-footer {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: #ffffff;
}

/* ===== HOME PAGE ===== */
.home-page {
  max-width: 650px;
  margin: 0 auto;
  padding: 40px 24px;
}

.content-header h1 {
  font-size: 16px;
  font-weight: 400;
  color: #334155;
  margin-bottom: 24px;
}

.create-section {
  margin-bottom: 16px;
}

.btn-create {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 14px 45px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
  transition: all 0.3s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.35);
}

/* ===== CREATOR CARD ===== */
.creator-card-wrapper {
  width: 100%;
  margin-top: 20px;
}

.creator-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 35px;
  display: flex;
  align-items: center;
  gap: 24px;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.creator-card.active {
  background: #6c5ce7;
  border-color: #6c5ce7;
  color: #ffffff;
  box-shadow: 0 20px 25px -5px rgba(108, 92, 231, 0.3), 0 10px 10px -5px rgba(108, 92, 231, 0.2);
}

.creator-card.active .creator-info h3,
.creator-card.active .creator-info p {
  color: white;
}

.creator-card.active .creator-icon svg {
  stroke: white;
}

.creator-icon svg {
  stroke: #334155;
  transition: stroke 0.3s;
}

.creator-info h3 {
  font-size: 24px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.creator-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* ===== EDITOR BOX ===== */
.editor-box {
  margin-top: 25px;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.editor-content {
  background: #1a1c2e;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.question-input-wrapper {
  margin-bottom: 20px;
}

.question-input {
  width: 100%;
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 22px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
}

.question-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.option-item {
  border-radius: 8px;
  padding: 6px 16px;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.option-item input {
  background: transparent;
  border: none;
  color: #1e202c;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  outline: none;
  width: 100%;
  text-align: center;
}

.option-item input::placeholder {
  color: rgba(30, 32, 44, 0.6);
}

.option-a { background: #4cd137; }
.option-b { background: #5856d6; }
.option-c { background: #ff9f43; }
.option-d { background: #e84118; }

.option-b input,
.option-d input {
  color: white;
}

.option-b input::placeholder,
.option-d input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #475569;
  color: #94a3b8;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #334155;
}

.btn-save {
  background: #10b981;
  border: none;
  color: white;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #059669;
}

/* ===== LIBRARY PAGE ===== */
.library-page {
  padding: 0;
}

.search-bar {
  padding: 12px 40px;
  border-bottom: 1px solid #f1f5f9;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 24px;
  padding: 6px 18px;
  max-width: 650px;
}

.search-icon {
  display: flex;
  align-items: center;
  color: #94a3b8;
}

.search-input {
  border: none;
  outline: none;
  padding: 6px 0;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  color: #334155;
  width: 100%;
  background: transparent;
}

.library-content {
  padding: 40px;
  max-width: 950px;
}

.library-title {
  font-size: 26px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 25px;
  letter-spacing: -0.5px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.filter-tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background: transparent;
  color: #64748b;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #1e293b;
  font-weight: 500;
}

/* ===== QUIZ TABLE ===== */
.quiz-table {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #ffffff;
  padding: 12px 20px;
  border-bottom: 1px solid #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.table-header .col-title {
  flex: 2;
}

.table-header .col-time {
  flex: 1.2;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #cbd5e1;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .col-title {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 14px;
}

.table-row .col-time {
  flex: 1.2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-icon {
  width: 32px;
  height: 32px;
  background: #6c5ce7;
  border-radius: 28%;
  opacity: 0.85;
  flex-shrink: 0;
}

.quiz-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.quiz-tags {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot-green {
  display: inline-flex;
  align-items: center;
}

.time-text {
  font-size: 12px;
  color: #475569;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-play, .btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  background: white;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  transition: all 0.2s;
}

.btn-play:hover {
  background: #f1f5f9;
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

/* ===== TRANSITION ===== */
.slide-up-enter-active {
  transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .sidebar-main {
    width: 72px;
    padding: 20px 12px;
  }
  
  .brand-text, .menu-text, .profile-name {
    display: none;
  }
  
  .main-content {
    margin-left: 72px;
  }
  
  .home-page {
    padding: 20px 16px;
  }
  
  .creator-card {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .library-content {
    padding: 16px;
  }
  
  .search-bar {
    padding: 12px 16px;
  }
  
  .table-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .table-row .col-time {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .action-buttons {
    margin-left: auto;
  }
}
</style>