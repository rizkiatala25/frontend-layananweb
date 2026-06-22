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
          <input 
            type="text" 
            placeholder="Find a quiz" 
            v-model="searchQuery"
            @input="filterQuizzes"
          />
        </div>
      </div>
      
      <nav class="nav-center">
        <a href="#" class="nav-link" :class="{ active: currentTab === 'home' }" @click.prevent="currentTab = 'home'">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a href="#" class="nav-link" :class="{ active: currentTab === 'activity' }" @click.prevent="currentTab = 'activity'">
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
          <button @click="handleLogout" class="logout-icon" title="Logout">🚪</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      
      <div v-if="currentTab === 'home'">
        
        <div class="top-row">
          <div class="join-card">
            <div class="join-wrapper">
              <input 
                type="text" 
                placeholder="Enter a join code" 
                v-model="joinCode" 
                class="join-input"
                @keyup.enter="handleJoinCode"
              />
              <button @click="handleJoinCode" class="btn-join">Join</button>
            </div>
          </div>

          <div class="welcome-banner">
            <div class="welcome-text">
              <span class="welcome-date">{{ currentDate }}</span>
              <h2>Welcome Back, {{ firstName }}</h2>
              <p>Start a quiz and challenge yourself today!</p>
            </div>
            <div class="welcome-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="72" height="72">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M4.5 12.06v3.63c0 2.05 3.36 3.81 7.5 3.81s7.5-1.76 7.5-3.81v-3.63l-7.5 4.09-7.5-4.09z"/>
              </svg>
            </div>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Recent activity</h2>
          <div class="card-grid">
            <div 
              v-for="(item, index) in recentActivities" 
              :key="index" 
              class="activity-card"
              @click="openQuiz(item)"
            >
              <div class="card-emoji">{{ item.emoji }}</div>
              <div class="card-body">
                <span class="card-badge">{{ item.questions }} Qs</span>
                <h3 class="card-title">{{ item.title }}</h3>
                <div class="card-accuracy" :class="item.accuracyClass">
                  {{ item.accuracy }} accuracy
                </div>
              </div>
            </div>
            <div v-if="recentActivities.length === 0" class="empty-state">
              <p>Belum ada kuis yang dikerjakan</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Available Quizzes</h2>
          <div class="card-grid">
            <div 
              v-for="(quiz, index) in filteredQuizzes" 
              :key="index" 
              class="subject-card"
              @click="openQuiz(quiz)"
            >
              <div class="card-cover">
                <img v-if="quiz.cover_image" :src="quiz.cover_image" alt="Cover" class="cover-image" />
                <div v-else class="card-emoji">{{ quiz.emoji }}</div>
              </div>
              <div class="card-body">
                <span class="card-badge">{{ quiz.total_questions || quiz.questions || 0 }} Qs</span>
                <h3 class="card-title">{{ quiz.title }}</h3>
                <span class="quiz-source" :class="quiz.source">
                  {{ quiz.source === 'teacher' ? '👨‍🏫 Teacher' : '📚 Default' }}
                </span>
              </div>
            </div>
            <div v-if="filteredQuizzes.length === 0" class="empty-state">
              <p>Tidak ada kuis yang ditemukan</p>
            </div>
          </div>
        </section>

      </div>

      <div v-if="currentTab === 'activity'" class="activity-page">
        <h2 class="activity-title">Activity History</h2>
        <p class="activity-subtitle">Kuis yang sudah kamu kerjakan</p>
        
        <div class="activity-list">
          <div 
            v-for="(item, index) in allActivities" 
            :key="index"
            class="activity-item"
          >
            <div class="activity-icon">{{ item.emoji }}</div>
            <div class="activity-info">
              <h4 class="activity-name">{{ item.title }}</h4>
              <span class="activity-date">{{ item.date }}</span>
            </div>
            <div class="activity-result">
              <span class="activity-score" :class="item.accuracyClass">
                {{ item.accuracy }}
              </span>
            </div>
            <button class="btn-delete-history" @click="deleteHistory(index)" title="Hapus history">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          <div v-if="allActivities.length === 0" class="empty-state">
            <p>Belum ada history aktivitas</p>
          </div>
        </div>
        
        <button v-if="allActivities.length > 0" class="btn-clear-all" @click="clearAllHistory">
          Hapus Semua History
        </button>
      </div>

    </main>

    <QuizDetailModal 
      v-if="selectedQuiz" 
      :quiz="selectedQuiz"
      @close="selectedQuiz = null"
      @start="handleStartQuiz"
    />

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js';
import QuizDetailModal from '@/components/QuizDetailModal.vue';

export default {
  name: 'StudentDashboardView',
  components: {
    QuizDetailModal
  },
  emits: ['logout', 'start-quiz'],
  data() {
    return {
      currentTab: 'home',
      searchQuery: '',
      joinCode: '',
      studentName: 'Akmal Randi',
      selectedQuiz: null,

      defaultQuizzes: [
        { 
          id: 1, 
          title: 'Sejarah Indonesia', 
          total_questions: 5, 
          emoji: '🇲🇨',
          cover_image: null,
          description: 'Test your knowledge about Indonesian history',
          duration: 10,
          source: 'default'
        },
        { 
          id: 2, 
          title: 'Pengetahuan Sosial', 
          total_questions: 5, 
          emoji: '🧠',
          cover_image: null,
          description: 'Social knowledge quiz',
          duration: 10,
          source: 'default'
        },
        { 
          id: 3, 
          title: 'Matematika', 
          total_questions: 5, 
          emoji: '📐',
          cover_image: null,
          description: 'Math quiz for you',
          duration: 10,
          source: 'default'
        },
        { 
          id: 4, 
          title: 'Pengetahuan Alam', 
          total_questions: 5, 
          emoji: '🌱',
          cover_image: null,
          description: 'Science quiz',
          duration: 10,
          source: 'default'
        },
        { 
          id: 5, 
          title: 'Pendidikan Kewarganegaraan', 
          total_questions: 5, 
          emoji: '🦅',
          cover_image: null,
          description: 'Civics education quiz',
          duration: 10,
          source: 'default'
        }
      ],

      teacherQuizzes: [],
      recentActivities: [],
      allActivities: []
    };
  },
  computed: {
    firstName() {
      return this.studentName.split(' ')[0] || 'Student';
    },
    currentDate() {
      const now = new Date();
      return now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    allQuizzes() {
      return [...this.defaultQuizzes, ...this.teacherQuizzes];
    },
    filteredQuizzes() {
      if (!this.searchQuery.trim()) {
        return this.allQuizzes;
      }
      const query = this.searchQuery.toLowerCase();
      return this.allQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(query) ||
        (quiz.description && quiz.description.toLowerCase().includes(query))
      );
    }
  },
  mounted() {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.studentName = savedName;
    }
    
    this.checkQuizResult();
    this.loadFromStorage();
    this.loadTeacherQuizzes();
  },
  methods: {
    loadTeacherQuizzes() {
      const sharedQuizzes = JSON.parse(localStorage.getItem('shared_quizzes') || '[]');
      console.log('📚 Loading shared quizzes:', sharedQuizzes);
      
      if (sharedQuizzes.length === 0) {
        console.log('ℹ️ No shared quizzes found');
        return;
      }
      
      sharedQuizzes.forEach(sharedQuiz => {
        const exists = this.teacherQuizzes.some(q => q.id === sharedQuiz.id);
        if (!exists) {
          this.teacherQuizzes.push({
            id: sharedQuiz.id,
            title: sharedQuiz.title,
            total_questions: sharedQuiz.total_questions || 5,
            emoji: sharedQuiz.emoji || '📝',
            cover_image: sharedQuiz.cover_image || null,
            description: sharedQuiz.description || 'Quiz from teacher',
            duration: sharedQuiz.duration || 10,
            source: 'teacher',
            join_code: sharedQuiz.join_code,
            questions: sharedQuiz.questions || []
          });
          console.log('✅ Added quiz:', sharedQuiz.title);
        }
      });
      
      this.saveToStorage();
    },

    checkQuizResult() {
      const quizResult = localStorage.getItem('quiz_result');
      if (quizResult) {
        try {
          const result = JSON.parse(quizResult);
          console.log('📌 Found quiz result in localStorage:', result);
          this.addToRecent(result);
          localStorage.removeItem('quiz_result');
        } catch (e) {
          console.error('Error parsing quiz result:', e);
        }
      }
    },

    loadFromStorage() {
      const savedTeacherQuizzes = localStorage.getItem('teacher_quizzes');
      if (savedTeacherQuizzes) {
        try {
          this.teacherQuizzes = JSON.parse(savedTeacherQuizzes);
        } catch (e) {
          console.error('Error loading teacher quizzes:', e);
        }
      }
      
      const savedRecent = localStorage.getItem('recent_activities');
      if (savedRecent) {
        try {
          this.recentActivities = JSON.parse(savedRecent);
        } catch (e) {
          console.error('Error loading recent activities:', e);
        }
      }
      
      const savedAll = localStorage.getItem('all_activities');
      if (savedAll) {
        try {
          this.allActivities = JSON.parse(savedAll);
        } catch (e) {
          console.error('Error loading all activities:', e);
        }
      }
    },

    saveToStorage() {
      localStorage.setItem('teacher_quizzes', JSON.stringify(this.teacherQuizzes));
      localStorage.setItem('recent_activities', JSON.stringify(this.recentActivities));
      localStorage.setItem('all_activities', JSON.stringify(this.allActivities));
      console.log('📌 Data saved to localStorage');
    },

    addToRecent(quizResult) {
      const accuracy = quizResult.score + '%';
      const accuracyClass = quizResult.score >= 70 ? 'accuracy-green' : 'accuracy-red';
      
      const activity = {
        id: Date.now(),
        title: quizResult.title || 'Quiz',
        questions: quizResult.totalQuestions || 5,
        accuracy: accuracy,
        accuracyClass: accuracyClass,
        emoji: quizResult.emoji || '📝',
        date: new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      console.log('📌 Adding to recent activity:', activity);
      
      this.recentActivities.unshift(activity);
      if (this.recentActivities.length > 5) {
        this.recentActivities.pop();
      }
      
      this.allActivities.unshift(activity);
      this.saveToStorage();
    },

    handleJoinCode() {
      if (!this.joinCode.trim()) {
        alert('Masukkan kode join terlebih dahulu!');
        return;
      }
      
      const code = this.joinCode.trim().toUpperCase();
      console.log('🔍 Searching for join code:', code);
      
      const sharedQuizzes = JSON.parse(localStorage.getItem('shared_quizzes') || '[]');
      const foundQuiz = sharedQuizzes.find(q => q.join_code === code);
      
      if (foundQuiz) {
        const exists = this.teacherQuizzes.some(q => q.id === foundQuiz.id);
        if (!exists) {
          const newQuiz = {
            id: foundQuiz.id,
            title: foundQuiz.title,
            total_questions: foundQuiz.total_questions || 5,
            emoji: foundQuiz.emoji || '📝',
            cover_image: foundQuiz.cover_image || null,
            description: foundQuiz.description || 'Quiz from teacher',
            duration: foundQuiz.duration || 10,
            source: 'teacher',
            join_code: foundQuiz.join_code,
            questions: foundQuiz.questions || []
          };
          
          this.teacherQuizzes.push(newQuiz);
          this.saveToStorage();
          
          alert(`✅ Berhasil join kuis: ${foundQuiz.title}`);
          this.openQuiz(newQuiz);
        } else {
          alert('⚠️ Kuis sudah ada di daftar Anda');
          const existingQuiz = this.teacherQuizzes.find(q => q.id === foundQuiz.id);
          if (existingQuiz) {
            this.openQuiz(existingQuiz);
          }
        }
      } else {
        alert(`❌ Kode join "${code}" tidak valid!`);
      }
      
      this.joinCode = '';
    },

    filterQuizzes() {
      // Sudah dihandle oleh computed filteredQuizzes
    },

    openQuiz(item) {
      const publishedQuizzes = JSON.parse(localStorage.getItem('published_quizzes') || '[]');
      const fullQuiz = publishedQuizzes.find(q => q.id === item.id);
      
      this.selectedQuiz = {
        id: item.id,
        title: item.title,
        description: item.description || 'Test your knowledge!',
        total_questions: item.total_questions || 5,
        duration: item.duration || 10,
        emoji: item.emoji || '📝',
        source: item.source || 'default',
        cover_image: item.cover_image || null,
        questions: fullQuiz?.questions || item.questions || []
      };
    },

    handleStartQuiz(quiz) {
      localStorage.setItem('current_quiz_title', quiz.title);
      localStorage.setItem('current_quiz_duration', quiz.duration || 10);
      
      const publishedQuizzes = JSON.parse(localStorage.getItem('published_quizzes') || '[]');
      const foundQuiz = publishedQuizzes.find(q => q.id === quiz.id);
      
      if (foundQuiz && foundQuiz.questions) {
        const questionsWithImages = foundQuiz.questions.map(q => ({
          id: q.id || Date.now(),
          question: q.question || 'No question',
          question_image: q.question_image || null,
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          options_images: q.options_images || [],
          correct_index: q.correct_index || 0,
          points: q.points || 1
        }));
        localStorage.setItem('current_quiz_questions', JSON.stringify(questionsWithImages));
        console.log('📚 Questions with images saved:', questionsWithImages);
      } else if (quiz.questions && quiz.questions.length > 0) {
        const questionsWithImages = quiz.questions.map(q => ({
          ...q,
          question_image: q.question_image || null,
          options_images: q.options_images || []
        }));
        localStorage.setItem('current_quiz_questions', JSON.stringify(questionsWithImages));
      } else {
        const mockQuestions = this.getMockQuestions(quiz);
        localStorage.setItem('current_quiz_questions', JSON.stringify(mockQuestions));
      }
      
      this.$emit('start-quiz', quiz.id);
      this.selectedQuiz = null;
    },

    getMockQuestions(quiz) {
      const subjects = {
        'sejarah': [
          { 
            question: 'Tanggal berapa Indonesia merdeka?', 
            options: ['17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947', '17 Agustus 1944'], 
            correct_index: 0,
            question_image: null,
            options_images: []
          },
          { 
            question: 'Siapa proklamator Indonesia?', 
            options: ['Soekarno-Hatta', 'Soeharto', 'Habibie', 'Megawati'], 
            correct_index: 0,
            question_image: null,
            options_images: []
          }
        ],
        'matematika': [
          { 
            question: 'Berapa hasil 2 + 2?', 
            options: ['3', '4', '5', '6'], 
            correct_index: 1,
            question_image: null,
            options_images: []
          },
          { 
            question: 'Berapa hasil 5 x 5?', 
            options: ['20', '25', '30', '35'], 
            correct_index: 1,
            question_image: null,
            options_images: []
          }
        ]
      };
      
      const lowerTitle = quiz.title.toLowerCase();
      let questions = subjects['sejarah'];
      
      for (const [key, value] of Object.entries(subjects)) {
        if (lowerTitle.includes(key)) {
          questions = value;
          break;
        }
      }
      
      return questions.map((q, index) => ({
        id: index + 1,
        ...q
      }));
    },

    deleteHistory(index) {
      if (confirm('Hapus history ini?')) {
        this.allActivities.splice(index, 1);
        this.recentActivities = this.allActivities.slice(0, 5);
        this.saveToStorage();
      }
    },

    clearAllHistory() {
      if (confirm('Hapus semua history aktivitas?')) {
        this.allActivities = [];
        this.recentActivities = [];
        this.saveToStorage();
      }
    },

    // 🔥 LOGOUT - PASTIKAN EMIT TERKIRIM
    handleLogout() {
      console.log('📌 Student logout clicked');
      const authStore = useAuthStore();
      authStore.logout();
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
/* ... style sama seperti sebelumnya ... */
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

.search-icon {
  font-size: 14px;
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

.nav-icon {
  flex-shrink: 0;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s ease;
}

.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
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
}

.quiz-source.default {
  background: #e2e8f0;
  color: #64748b;
}

.quiz-source.teacher {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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