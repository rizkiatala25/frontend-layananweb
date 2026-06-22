<template>
  <div class="teacher-dashboard" :class="{ 'library-view-active': currentMenu === 'library' }">
    
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
          <button class="btn-create" @click="openMultipleChoiceModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
            </svg>
            Create
          </button>
        </div>

        <!-- Question Creator Card -->
        <div class="creator-card-wrapper" @mouseenter="isCreatingQuestion = true" @mouseleave="isCreatingQuestion = false">
          <div class="creator-card" :class="{ active: isCreatingQuestion }" @click="openMultipleChoiceModal">
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
              placeholder="Search by activity name..." 
              class="search-input"
              @input="filterQuizzes"
            />
          </div>
        </div>

        <div class="library-content">
          <h2 class="library-title">My Library</h2>
          
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              :class="{ active: filterType === 'all' }"
              @click="filterType = 'all'"
            >
              All ({{ publishedQuizzes.length }})
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: filterType === 'published' }"
              @click="filterType = 'published'"
            >
              Published ({{ publishedQuizzes.filter(q => q.visibility === 'publish').length }})
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: filterType === 'private' }"
              @click="filterType = 'private'"
            >
              Private ({{ publishedQuizzes.filter(q => q.visibility === 'private').length }})
            </button>
          </div>

          <div class="quiz-table">
            <div class="table-header">
              <div class="col-title">Activity detail</div>
              <div class="col-status">Status</div>
              <div class="col-code">Join Code</div>
              <div class="col-actions">Actions</div>
            </div>

            <div class="table-body">
              <div v-for="quiz in filteredPublishedQuizzes" :key="quiz.id" class="table-row">
                <div class="col-title">
                  <div class="quiz-icon" :style="{ background: quiz.cover_image ? 'transparent' : '#6c5ce7' }">
                    <img v-if="quiz.cover_image" :src="quiz.cover_image" alt="cover" class="quiz-cover-thumb" />
                    <span v-else class="quiz-emoji">{{ getEmojiForSubject(quiz.subject) }}</span>
                  </div>
                  <div class="quiz-meta">
                    <h4 class="quiz-name">{{ quiz.title }}</h4>
                    <span class="quiz-tags">
                      <span class="dot-green">●</span>
                      {{ quiz.questions?.length || 0 }} Qs • {{ quiz.subject || 'General' }}
                    </span>
                  </div>
                </div>
                <div class="col-status">
                  <button 
                    class="status-btn" 
                    :class="quiz.visibility"
                    @click="toggleVisibility(quiz.id)"
                  >
                    {{ quiz.visibility === 'publish' ? '✅ Published' : '🔒 Private' }}
                  </button>
                </div>
                <div class="col-code">
                  <span v-if="quiz.visibility === 'publish'" class="join-code">
                    {{ quiz.join_code }}
                    <button class="btn-copy" @click="copyCode(quiz.join_code)" title="Copy code">
                      📋
                    </button>
                  </span>
                  <span v-else class="no-code">—</span>
                </div>
                <div class="col-actions">
                  <button class="btn-view" @click="viewQuizDetails(quiz)" title="View details & students">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    View
                  </button>
                  <button class="btn-delete" @click="deletePublishedQuiz(quiz.id)" title="Delete quiz">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Delete
                  </button>
                </div>
              </div>

              <div v-if="filteredPublishedQuizzes.length === 0" class="empty-state">
                <p>No quiz found.</p>
                <p class="empty-sub">Create your first quiz by clicking "Create" on the Home tab.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ===== MODAL MULTIPLE CHOICE ===== -->
    <MultipleChoiceModal 
      v-if="showModal" 
      @close="showModal = false"
      @start="handleStartCreating"
    />

    <!-- ===== MODAL VIEW QUIZ DETAILS ===== -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-detail">
        <button class="modal-close" @click="showDetailModal = false">✕</button>
        
        <h2 class="modal-title">{{ selectedQuiz?.title || 'Quiz Details' }}</h2>
        
        <div class="quiz-info-detail">
          <span>📚 {{ selectedQuiz?.subject || 'General' }}</span>
          <span>📝 {{ selectedQuiz?.questions?.length || 0 }} Questions</span>
          <span>⏱️ {{ selectedQuiz?.total_time || 0 }} min</span>
          <span class="status-badge" :class="selectedQuiz?.visibility">
            {{ selectedQuiz?.visibility === 'publish' ? 'Published' : 'Private' }}
          </span>
          <span v-if="selectedQuiz?.visibility === 'publish'" class="join-code-detail">
            Code: {{ selectedQuiz?.join_code }}
          </span>
        </div>

        <h3 class="section-subtitle">Students Who Have Completed</h3>
        
        <div class="students-list">
          <div v-if="getQuizResults(selectedQuiz?.id).length === 0" class="empty-students">
            <p>No students have completed this quiz yet.</p>
          </div>
          <div 
            v-for="(result, index) in getQuizResults(selectedQuiz?.id)" 
            :key="index"
            class="student-item"
          >
            <div class="student-avatar">👤</div>
            <div class="student-info">
              <span class="student-name">{{ result.studentName }}</span>
              <span class="student-date">{{ result.date }}</span>
            </div>
            <div class="student-score">
              <span class="score-badge" :class="result.score >= 70 ? 'high' : 'low'">
                {{ result.score }}%
              </span>
            </div>
            <div class="student-detail">
              <span>{{ result.correct }}/{{ result.total }} correct</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-close-modal" @click="showDetailModal = false">Close</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js';
import { useQuizStore } from '@/stores/quizStore.js';
import MultipleChoiceModal from '@/components/MultipleChoiceModal.vue';

export default {
  name: 'TeacherDashboardView',
  components: {
    MultipleChoiceModal
  },
  emits: ['logout', 'create-quiz', 'view-quiz'],
  data() {
    return {
      currentMenu: 'home',
      isCreatingQuestion: false,
      searchLibraryQuery: '',
      filterType: 'all',
      quizzes: [],
      publishedQuizzes: [],
      loading: false,
      error: null,
      showModal: false,
      showDetailModal: false,
      selectedQuiz: null,
      
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
             'Teacher User';
    },
    
    filteredQuizzes() {
      return this.quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(this.searchLibraryQuery.toLowerCase())
      );
    },

    filteredPublishedQuizzes() {
      let filtered = this.publishedQuizzes;
      
      if (this.filterType === 'published') {
        filtered = filtered.filter(q => q.visibility === 'publish');
      } else if (this.filterType === 'private') {
        filtered = filtered.filter(q => q.visibility === 'private');
      }
      
      if (this.searchLibraryQuery.trim()) {
        const query = this.searchLibraryQuery.toLowerCase();
        filtered = filtered.filter(q => 
          q.title.toLowerCase().includes(query) ||
          q.subject?.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
  },
  mounted() {
    this.fetchTeacherData();
    this.loadPublishedQuizzes();
    
    // 🔥 TAMBAHKAN REFRESH OTOMATIS SETIAP 5 DETIK
    this.refreshInterval = setInterval(() => {
      this.loadPublishedQuizzes();
    }, 5000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    // ===== OPEN MODAL =====
    openMultipleChoiceModal() {
      this.showModal = true;
    },
    
    handleStartCreating() {
      this.$emit('create-quiz');
    },

    // ===== LOAD PUBLISHED QUIZZES =====
    loadPublishedQuizzes() {
      const saved = localStorage.getItem('published_quizzes');
      if (saved) {
        try {
          this.publishedQuizzes = JSON.parse(saved);
          console.log('📚 Loaded published quizzes:', this.publishedQuizzes);
        } catch (e) {
          console.error('Error loading published quizzes:', e);
        }
      }
    },

    // ===== FILTER QUIZZES =====
    filterQuizzes() {
      // Sudah dihandle oleh computed filteredPublishedQuizzes
    },

    // ===== FETCH DATA =====
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

    getEmojiForSubject(subject) {
      const emojis = {
        'Matematika': '📐',
        'Bahasa Indonesia': '🇮🇩',
        'Bahasa Inggris': '🇬🇧',
        'IPA': '🔬',
        'IPS': '🌍',
        'Sejarah': '📜',
        'PKN': '🦅',
        'Seni Budaya': '🎭',
        'Agama': '📖',
        'Penjaskes': '⚽'
      };
      return emojis[subject] || '📝';
    },

    // ===== TOGGLE VISIBILITY (Publish/Private) =====
    toggleVisibility(quizId) {
      console.log('📌 Toggling visibility for quiz:', quizId);
      
      const quizIndex = this.publishedQuizzes.findIndex(q => q.id === quizId);
      if (quizIndex === -1) {
        console.log('❌ Quiz not found:', quizId);
        return;
      }
      
      const quiz = this.publishedQuizzes[quizIndex];
      const newVisibility = quiz.visibility === 'publish' ? 'private' : 'publish';
      quiz.visibility = newVisibility;
      
      // Update localStorage
      localStorage.setItem('published_quizzes', JSON.stringify(this.publishedQuizzes));
      console.log('✅ Updated published_quizzes:', this.publishedQuizzes);
      
      // 🔥 UPDATE SHARED QUIZZES
      let sharedQuizzes = JSON.parse(localStorage.getItem('shared_quizzes') || '[]');
      const sharedIndex = sharedQuizzes.findIndex(q => q.id === quizId);
      
      if (newVisibility === 'publish') {
        // Tambahkan ke shared quizzes
        if (sharedIndex === -1) {
          sharedQuizzes.push({
            id: quiz.id,
            title: quiz.title,
            total_questions: quiz.questions?.length || 0,
            emoji: this.getEmojiForSubject(quiz.subject),
            description: `Quiz ${quiz.subject}`,
            duration: quiz.total_time || 10,
            join_code: quiz.join_code,
            cover_image: quiz.cover_image,
            questions: quiz.questions || []
          });
          console.log('✅ Quiz published to shared_quizzes:', quiz.title);
          console.log('📋 Join code:', quiz.join_code);
        }
      } else {
        // Hapus dari shared quizzes
        if (sharedIndex !== -1) {
          sharedQuizzes.splice(sharedIndex, 1);
          console.log('🔒 Quiz removed from shared_quizzes:', quiz.title);
        }
      }
      
      localStorage.setItem('shared_quizzes', JSON.stringify(sharedQuizzes));
      console.log('📊 Total shared quizzes:', sharedQuizzes.length);
      
      alert(`Quiz "${quiz.title}" is now ${newVisibility === 'publish' ? 'Published' : 'Private'}!`);
    },

    // ===== COPY JOIN CODE =====
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('✅ Join code copied to clipboard!');
      }).catch(() => {
        alert('📋 Join code: ' + code);
      });
    },

    // ===== VIEW QUIZ DETAILS =====
    viewQuizDetails(quiz) {
      this.selectedQuiz = quiz;
      this.showDetailModal = true;
    },

    // ===== GET QUIZ RESULTS =====
    getQuizResults(quizId) {
      const results = JSON.parse(localStorage.getItem('quiz_results') || '{}');
      return results[quizId] || [];
    },

    // ===== DELETE PUBLISHED QUIZ =====
    deletePublishedQuiz(id) {
      console.log('📌 Deleting quiz:', id);
      
      if (confirm('Are you sure you want to delete this quiz?')) {
        this.publishedQuizzes = this.publishedQuizzes.filter(q => q.id !== id);
        localStorage.setItem('published_quizzes', JSON.stringify(this.publishedQuizzes));
        
        // Hapus dari shared quizzes
        let sharedQuizzes = JSON.parse(localStorage.getItem('shared_quizzes') || '[]');
        const updatedShared = sharedQuizzes.filter(q => q.id !== id);
        localStorage.setItem('shared_quizzes', JSON.stringify(updatedShared));
        console.log('✅ Quiz deleted from shared_quizzes');
        
        alert('Quiz deleted successfully!');
      }
    },

    // ===== SAVE QUESTION (untuk create cepat) =====
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

    // ===== DELETE QUIZ FROM BACKEND =====
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

    // ===== LOGOUT =====
    async handleLogout() {
      console.log('📌 Teacher logout clicked');
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

.creator-card:hover {
  border-color: #6c5ce7;
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.1);
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
  max-width: 1100px;
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
  flex-wrap: wrap;
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
  border-color: #6c5ce7;
  color: #6c5ce7;
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
  background: #f8fafc;
  padding: 12px 20px;
  border-bottom: 1px solid #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-header .col-title { flex: 2.5; }
.table-header .col-status { flex: 1; }
.table-header .col-code { flex: 1; }
.table-header .col-actions { flex: 1; text-align: right; }

.table-row {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .col-title {
  flex: 2.5;
  display: flex;
  align-items: center;
  gap: 14px;
}

.table-row .col-status {
  flex: 1;
}

.table-row .col-code {
  flex: 1;
}

.table-row .col-actions {
  flex: 1;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.quiz-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.quiz-cover-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quiz-emoji {
  font-size: 20px;
}

.quiz-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.quiz-tags {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot-green {
  color: #2ecc71;
}

.status-btn {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.status-btn.publish {
  background: #d1fae5;
  color: #065f46;
}

.status-btn.publish:hover {
  background: #a7f3d0;
}

.status-btn.private {
  background: #fef3c7;
  color: #92400e;
}

.status-btn.private:hover {
  background: #fde68a;
}

.join-code {
  font-size: 13px;
  color: #6c5ce7;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: #f1f5f9;
}

.no-code {
  color: #94a3b8;
  font-size: 13px;
}

.btn-view {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  background: #f0edff;
  border: 1px solid #6c5ce7;
  color: #6c5ce7;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #6c5ce7;
  color: white;
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  background: white;
  border: 1px solid #fecaca;
  color: #ef4444;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #fecaca;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.empty-sub {
  font-size: 13px;
  margin-top: 4px !important;
}

/* ===== MODAL DETAIL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-detail {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 16px;
  padding: 32px 28px 28px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.35s ease-out;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1e293b;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-right: 30px;
}

.quiz-info-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #475569;
}

.quiz-info-detail span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.publish {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.private {
  background: #fef3c7;
  color: #92400e;
}

.join-code-detail {
  font-weight: 600;
  color: #6c5ce7;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 20px 0 12px 0;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.student-avatar {
  font-size: 24px;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.student-date {
  font-size: 11px;
  color: #94a3b8;
}

.student-score {
  margin-right: 12px;
}

.score-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.score-badge.high {
  background: #d1fae5;
  color: #065f46;
}

.score-badge.low {
  background: #fee2e2;
  color: #dc2626;
}

.student-detail {
  font-size: 12px;
  color: #64748b;
}

.empty-students {
  padding: 20px;
  text-align: center;
  color: #94a3b8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-close-modal {
  padding: 8px 24px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close-modal:hover {
  background: #5a4bd1;
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
  
  .table-header {
    display: none;
  }
  
  .table-row .col-title {
    width: 100%;
  }
  
  .table-row .col-status {
    width: 100%;
  }
  
  .table-row .col-code {
    width: 100%;
  }
  
  .table-row .col-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .modal-detail {
    padding: 24px 18px 18px;
  }
}
</style>