<template>
  <div class="teacher-dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-circle"></div>
        <span class="logo-text">ZONEQUIZZZ</span>
      </div>

      <nav class="menu">
        <button class="menu-item" :class="{ active: currentTab === 'home' }" @click="currentTab = 'home'">
          <span>🏠</span> Home
        </button>
        <button class="menu-item" :class="{ active: currentTab === 'library' }" @click="currentTab = 'library'">
          <span>📚</span> My Library
        </button>
        <button class="menu-item" @click="handleLogout">
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
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="🔍 Search quizzes..."
            class="search-input"
          />
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
              <p v-else>
                <span class="private-hint">🔒 Private - Publish to get join code</span>
              </p>
            </div>
            <div class="quiz-actions">
              <button class="btn-view" @click="openDetailModal(quiz)">
                👁️ View Results
              </button>
              <button 
                class="btn-publish" 
                @click="toggleVisibility(quiz.id)"
                :class="quiz.visibility === 'publish' ? 'btn-private' : 'btn-publish-action'"
              >
                {{ quiz.visibility === 'publish' ? '🔒 Make Private' : '🌍 Publish' }}
              </button>
              <button class="btn-delete" @click="deleteQuiz(quiz.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ===== DETAIL MODAL ===== -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-detail">
        <button class="modal-close" @click="closeDetailModal">✕</button>
        
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedQuiz?.title || 'Quiz Details' }}</h2>
          <span class="modal-subject">📖 {{ selectedQuiz?.subject || 'General' }}</span>
        </div>

        <!-- Info Quiz -->
        <div class="quiz-info-detail">
          <div class="info-item">
            <span class="info-label">📝 Questions</span>
            <span class="info-value">{{ selectedQuiz?.questions?.length || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">⏱️ Duration</span>
            <span class="info-value">{{ selectedQuiz?.total_time || 0 }} min</span>
          </div>
          <div class="info-item">
            <span class="info-label">📊 Status</span>
            <span class="status-badge" :class="selectedQuiz?.visibility">
              {{ selectedQuiz?.visibility === 'publish' ? '✅ Published' : '🔒 Private' }}
            </span>
          </div>
          <div class="info-item" v-if="selectedQuiz?.visibility === 'publish'">
            <span class="info-label">🔑 Join Code</span>
            <span class="info-value code">{{ selectedQuiz?.join_code }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">👥 Total Siswa</span>
            <span class="info-value">{{ nilaiSiswa.length }}</span>
          </div>
        </div>

        <!-- Statistik Nilai -->
        <div v-if="nilaiSiswa.length > 0" class="stats-row">
          <div class="stat-box">
            <span class="stat-number">{{ averageScore }}%</span>
            <span class="stat-label">Rata-rata</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">{{ highestScore }}%</span>
            <span class="stat-label">Tertinggi</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">{{ lowestScore }}%</span>
            <span class="stat-label">Terendah</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">{{ nilaiSiswa.length }}</span>
            <span class="stat-label">Total Siswa</span>
          </div>
        </div>

        <!-- 🔥 TABS: FROM DATABASE vs FROM LOCALSTORAGE -->
        <div class="result-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'database' }"
            @click="activeTab = 'database'"
          >
            📊 Dari Database
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'local' }"
            @click="activeTab = 'local'"
          >
            💾 Dari LocalStorage (Backup)
          </button>
        </div>

        <!-- Daftar Nilai Siswa - DARI DATABASE -->
        <div v-if="activeTab === 'database'">
          <h3 class="section-title">📊 Daftar Nilai Siswa (Database)</h3>
          
          <div v-if="loadingNilai" class="loading-state">
            <div class="spinner-small"></div>
            <p>Loading data...</p>
          </div>

          <div v-else-if="nilaiSiswa.length === 0" class="empty-nilai">
            <p>📭 Belum ada siswa yang mengerjakan quiz ini.</p>
          </div>

          <div v-else class="nilai-table">
            <div class="table-header">
              <div class="col-rank">#</div>
              <div class="col-name">Nama Siswa</div>
              <div class="col-correct">✅ Benar</div>
              <div class="col-total">📝 Total</div>
              <div class="col-score">🎯 Nilai</div>
              <div class="col-status">Status</div>
              <div class="col-date">📅 Tanggal</div>
            </div>

            <div 
              v-for="(item, index) in sortedNilai" 
              :key="index"
              class="table-row"
              :class="{ 'row-top': index < 3 }"
            >
              <div class="col-rank">
                <span class="rank-number" :class="getRankClass(index)">
                  {{ index + 1 }}
                </span>
              </div>
              <div class="col-name">
                <span class="student-avatar">👤</span>
                {{ item.studentName }}
              </div>
              <div class="col-correct">{{ item.correct }}</div>
              <div class="col-total">{{ item.total }}</div>
              <div class="col-score">
                <span class="score-badge" :class="getScoreClass(item.score)">
                  {{ item.score }}%
                </span>
              </div>
              <div class="col-status">
                <span class="status-badge-small" :class="item.score >= 70 ? 'lulus' : 'gagal'">
                  {{ item.score >= 70 ? '✅ Lulus' : '❌ Gagal' }}
                </span>
              </div>
              <div class="col-date">
                <span class="date-text">{{ item.completed_at || item.date || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar Nilai Siswa - DARI LOCALSTORAGE (BACKUP) -->
        <div v-if="activeTab === 'local'">
          <h3 class="section-title">💾 Backup dari LocalStorage</h3>
          
          <div v-if="localResults.length === 0" class="empty-nilai">
            <p>📭 Tidak ada data backup di localStorage.</p>
          </div>

          <div v-else class="nilai-table">
            <div class="table-header">
              <div class="col-rank">#</div>
              <div class="col-name">Nama Siswa</div>
              <div class="col-correct">✅ Benar</div>
              <div class="col-total">📝 Total</div>
              <div class="col-score">🎯 Nilai</div>
              <div class="col-status">Status</div>
              <div class="col-date">📅 Tanggal</div>
            </div>

            <div 
              v-for="(item, index) in sortedLocalResults" 
              :key="index"
              class="table-row"
              :class="{ 'row-top': index < 3 }"
            >
              <div class="col-rank">
                <span class="rank-number" :class="getRankClass(index)">
                  {{ index + 1 }}
                </span>
              </div>
              <div class="col-name">
                <span class="student-avatar">👤</span>
                {{ item.studentName }}
              </div>
              <div class="col-correct">{{ item.correct }}</div>
              <div class="col-total">{{ item.total }}</div>
              <div class="col-score">
                <span class="score-badge" :class="getScoreClass(item.score)">
                  {{ item.score }}%
                </span>
              </div>
              <div class="col-status">
                <span class="status-badge-small" :class="item.score >= 70 ? 'lulus' : 'gagal'">
                  {{ item.score >= 70 ? '✅ Lulus' : '❌ Gagal' }}
                </span>
              </div>
              <div class="col-date">
                <span class="date-text">{{ item.date || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-close-modal" @click="closeDetailModal">Tutup</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useQuizStore } from '@/stores/quizStore.js';

export default {
  name: 'DashboardGuru',
  emits: ['logout', 'create-quiz'],
  data() {
    return {
      currentTab: 'home',
      searchQuery: '',
      loading: false,
      loadingNilai: false,
      quizzes: [],
      showDetailModal: false,
      selectedQuiz: null,
      nilaiSiswa: [],
      selectedQuizId: null,
      activeTab: 'database',
      localResults: []
    };
  },
  computed: {
    teacherName() {
      const authStore = useAuthStore();
      return authStore.user?.full_name || 
             authStore.user?.name || 
             localStorage.getItem('user_name') || 
             'Teacher';
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
    },
    sortedNilai() {
      return [...this.nilaiSiswa].sort((a, b) => b.score - a.score);
    },
    sortedLocalResults() {
      return [...this.localResults].sort((a, b) => b.score - a.score);
    },
    averageScore() {
      if (this.nilaiSiswa.length === 0) return 0;
      const total = this.nilaiSiswa.reduce((sum, n) => sum + n.score, 0);
      return Math.round(total / this.nilaiSiswa.length);
    },
    highestScore() {
      if (this.nilaiSiswa.length === 0) return 0;
      return Math.max(...this.nilaiSiswa.map(n => n.score));
    },
    lowestScore() {
      if (this.nilaiSiswa.length === 0) return 0;
      return Math.min(...this.nilaiSiswa.map(n => n.score));
    }
  },
  mounted() {
    this.loadQuizzes();
    this.refreshInterval = setInterval(() => {
      this.loadQuizzes();
    }, 5000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    // ===== LOAD QUIZZES =====
    async loadQuizzes() {
      this.loading = true;
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.fetchTeacherQuizzes();
        if (result.success) {
          this.quizzes = result.data || [];
          console.log('✅ Quizzes loaded:', this.quizzes.length);
        }
      } catch (error) {
        console.error('Error loading quizzes:', error);
      } finally {
        this.loading = false;
      }
    },

    // ===== OPEN DETAIL MODAL =====
    async openDetailModal(quiz) {
      this.selectedQuiz = quiz;
      this.selectedQuizId = quiz.id;
      this.showDetailModal = true;
      this.loadingNilai = true;
      this.activeTab = 'database';
      this.localResults = [];
      
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.fetchQuizResults(quiz.id);
        
        if (result.success) {
          this.nilaiSiswa = result.data || [];
          console.log('✅ Nilai loaded from database:', this.nilaiSiswa.length);
        } else {
          this.nilaiSiswa = [];
        }
      } catch (error) {
        console.error('Error loading nilai:', error);
        this.nilaiSiswa = [];
      } finally {
        this.loadingNilai = false;
      }

      // 🔥 LOAD DARI LOCALSTORAGE JUGA (BACKUP)
      this.loadLocalResults(quiz.id);
    },

    // ===== LOAD LOCAL RESULTS =====
    loadLocalResults(quizId) {
      try {
        const quizResults = JSON.parse(localStorage.getItem('quiz_results') || '{}');
        const results = quizResults[quizId] || [];
        
        this.localResults = results.map(item => ({
          studentName: item.studentName || 'Unknown',
          score: item.score || 0,
          correct: item.correct || 0,
          total: item.total || 0,
          date: item.date || new Date().toLocaleDateString(),
          completed_at: item.date || null
        }));
        
        console.log('💾 Local results loaded:', this.localResults.length);
      } catch (e) {
        console.error('Error loading local results:', e);
        this.localResults = [];
      }
    },

    // ===== CLOSE DETAIL MODAL =====
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedQuiz = null;
      this.nilaiSiswa = [];
      this.localResults = [];
      this.activeTab = 'database';
    },

    // ===== TOGGLE VISIBILITY =====
    async toggleVisibility(id) {
      try {
        const quizStore = useQuizStore();
        const quiz = this.quizzes.find(q => q.id === id);
        const action = quiz?.visibility === 'publish' ? 'private' : 'publish';
        
        const confirmMsg = action === 'publish' 
          ? '🌍 Publish quiz ini agar bisa diakses siswa?' 
          : '🔒 Private quiz ini? Siswa tidak akan bisa melihatnya.';
        
        if (!confirm(confirmMsg)) return;
        
        const result = await quizStore.toggleVisibility(id);
        
        if (result.success) {
          const newVisibility = result.data.visibility;
          const joinCode = result.data.join_code;
          
          if (newVisibility === 'publish') {
            alert(`✅ Quiz berhasil dipublikasikan!\n📋 Join Code: ${joinCode}`);
          } else {
            alert('🔒 Quiz berhasil di-private.');
          }
          
          await this.loadQuizzes();
        } else {
          alert('❌ Gagal mengubah visibility: ' + result.message);
        }
      } catch (error) {
        console.error('Error toggling visibility:', error);
        alert('❌ Terjadi kesalahan. Silakan coba lagi.');
      }
    },

    // ===== DELETE QUIZ =====
    async deleteQuiz(id) {
      if (!confirm('Are you sure you want to delete this quiz?')) return;
      
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.deleteQuiz(id);
        if (result.success) {
          await this.loadQuizzes();
          alert('✅ Quiz deleted!');
        } else {
          alert('❌ Failed to delete quiz: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('❌ Failed to delete quiz');
      }
    },

    // ===== COPY CODE =====
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('✅ Join code copied!');
      }).catch(() => {
        alert('📋 Join code: ' + code);
      });
    },

    // ===== GO TO CREATE QUIZ =====
    goToCreateQuiz() {
      console.log('📌 Navigating to create quiz...');
      this.$router.push('/create-quiz');
    },

    // ===== GET SCORE CLASS =====
    getScoreClass(score) {
      if (score >= 80) return 'score-very-good';
      if (score >= 70) return 'score-good';
      if (score >= 50) return 'score-medium';
      return 'score-bad';
    },

    // ===== GET RANK CLASS =====
    getRankClass(index) {
      if (index === 0) return 'rank-1';
      if (index === 1) return 'rank-2';
      if (index === 2) return 'rank-3';
      return '';
    },

    // ===== LOGOUT =====
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      window.location.href = 'http://localhost:3001/';
    }
  }
};
</script>

<style scoped>
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

/* ===== SIDEBAR ===== */
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
  background: rgba(255, 255, 255, 0.05);
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar {
  font-size: 32px;
}

.name {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* ===== MAIN CONTENT ===== */
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

/* ===== HOME TAB ===== */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

/* ===== LIBRARY TAB ===== */
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.quiz-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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

.private-hint {
  color: #f59e0b;
  font-style: italic;
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
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.btn-view {
  background: #e0e7ff;
  color: #4338ca;
}

.btn-view:hover {
  background: #c7d2fe;
}

.btn-publish-action {
  background: #d1fae5;
  color: #065f46;
}

.btn-publish-action:hover {
  background: #a7f3d0;
}

.btn-private {
  background: #fef3c7;
  color: #92400e;
}

.btn-private:hover {
  background: #fde68a;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* ===== DETAIL MODAL ===== */
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
  max-width: 750px;
  border-radius: 16px;
  padding: 28px 32px 24px;
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

.modal-header {
  margin-bottom: 16px;
  padding-right: 30px;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-subject {
  font-size: 14px;
  color: #6c5ce7;
  font-weight: 500;
}

.quiz-info-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.info-value.code {
  color: #6c5ce7;
  font-family: monospace;
  font-size: 16px;
  letter-spacing: 1px;
}

/* ===== STATS ROW ===== */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-box {
  flex: 1;
  min-width: 80px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #6c5ce7;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== SECTION TITLE ===== */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 16px 0 12px 0;
}

/* ===== NILAI TABLE ===== */
.nilai-table {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f8fafc;
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.row-top {
  background: #f0fdf4;
}

.table-row.row-top:hover {
  background: #dcfce7;
}

.col-rank { flex: 0.5; min-width: 35px; text-align: center; }
.col-name { flex: 2; min-width: 130px; display: flex; align-items: center; gap: 8px; }
.col-correct { flex: 0.8; min-width: 55px; text-align: center; }
.col-total { flex: 0.8; min-width: 55px; text-align: center; }
.col-score { flex: 1; min-width: 70px; text-align: center; }
.col-status { flex: 1; min-width: 80px; text-align: center; }
.col-date { flex: 1.2; min-width: 90px; text-align: center; }

.date-text {
  font-size: 11px;
  color: #94a3b8;
}

.rank-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
}

.rank-number.rank-1 {
  background: #fbbf24;
  color: #78350f;
}

.rank-number.rank-2 {
  background: #94a3b8;
  color: #1e293b;
}

.rank-number.rank-3 {
  background: #d97706;
  color: #fef3c7;
}

.student-avatar {
  font-size: 18px;
}

.score-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  min-width: 45px;
}

.score-very-good {
  background: #d1fae5;
  color: #065f46;
}

.score-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.score-medium {
  background: #fef3c7;
  color: #92400e;
}

.score-bad {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge-small {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge-small.lulus {
  background: #d1fae5;
  color: #065f46;
}

.status-badge-small.gagal {
  background: #fee2e2;
  color: #dc2626;
}

/* ===== RESULT TABS ===== */
.result-tabs {
  display: flex;
  gap: 10px;
  margin: 16px 0 12px 0;
}

.tab-btn {
  padding: 8px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
  color: #64748b;
}

.tab-btn:hover {
  border-color: #cbd5e1;
}

.tab-btn.active {
  border-color: #6c5ce7;
  background: #f0edff;
  color: #6c5ce7;
}

/* ===== LOADING ===== */
.loading-state {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-nilai {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 10px;
}

/* ===== MODAL FOOTER ===== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-close-modal {
  padding: 8px 28px;
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
  
  .modal-detail {
    padding: 20px 16px 16px;
  }
  
  .quiz-info-detail {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
  }
  
  .table-header, .table-row {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .col-rank, .col-name, .col-correct, .col-total, .col-score, .col-status, .col-date {
    flex: 1;
    min-width: 60px;
  }
  
  .stats-row {
    flex-wrap: wrap;
  }
  
  .stat-box {
    flex: 1;
    min-width: 60px;
    padding: 8px;
  }
  
  .stat-number {
    font-size: 18px;
  }

  .result-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
}
</style>