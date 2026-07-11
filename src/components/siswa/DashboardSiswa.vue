<template>
  <div class="student-dashboard">
    <!-- NAVBAR -->
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
            placeholder="Find a quiz by title or subject..." 
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

    <!-- MAIN CONTENT -->
    <main class="main-content">
      
      <!-- HOME TAB -->
      <div v-if="currentTab === 'home'">
        
        <!-- TOP ROW -->
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

        <!-- RECENT ACTIVITY -->
        <section class="section">
          <h2 class="section-title">Recent activity</h2>
          <div class="card-grid">
            <div 
              v-for="(item, index) in recentActivities" 
              :key="index" 
              class="activity-card"
              @click="openQuiz(item)"
            >
              <div class="card-cover" :style="{ backgroundImage: item.cover_image ? `url(${item.cover_image})` : 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' }">
                <span class="card-emoji" v-if="!item.cover_image">{{ item.emoji || '📝' }}</span>
              </div>
              <div class="card-body">
                <span class="card-badge">{{ item.questions }} Qs</span>
                <h3 class="card-title">{{ item.title }}</h3>
                <span class="quiz-subject">{{ item.subject || 'General' }}</span>
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

        <!-- AVAILABLE QUIZZES -->
        <section class="section">
          <h2 class="section-title">Available Quizzes</h2>
          
          <!-- 🔥 TAMPILKAN FILTER SUBJECT -->
          <div class="filter-container">
            <div class="filter-buttons">
              <button 
                class="filter-btn" 
                :class="{ active: selectedFilter === 'all' }"
                @click="selectedFilter = 'all'"
              >
                📚 All
              </button>
              <button 
                v-for="subject in availableSubjects" 
                :key="subject"
                class="filter-btn" 
                :class="{ active: selectedFilter === subject }"
                @click="selectedFilter = subject"
              >
                {{ getSubjectEmoji(subject) }} {{ subject }}
              </button>
            </div>
            <span class="filter-count">{{ filteredQuizzes.length }} quiz ditemukan</span>
          </div>

          <div class="card-grid">
            <!-- QUIZ DEFAULT -->
            <div 
              v-for="(quiz, index) in filteredDefaultQuizzes" 
              :key="'default-' + index" 
              class="subject-card"
              @click="openQuiz(quiz, 'default')"
            >
              <div class="card-cover">
                <img v-if="quiz.cover_image" :src="quiz.cover_image" alt="Cover" class="cover-image" />
                <div v-else class="card-emoji">{{ quiz.emoji }}</div>
                <span class="quiz-source-badge default">📚 Default</span>
              </div>
              <div class="card-body">
                <span class="card-badge">{{ quiz.total_questions || quiz.questions?.length || 0 }} Qs</span>
                <h3 class="card-title">{{ quiz.title }}</h3>
                <span class="quiz-subject">{{ quiz.subject || 'General' }}</span>
              </div>
            </div>

            <!-- QUIZ DARI GURU -->
            <div 
              v-for="(quiz, index) in filteredTeacherQuizzes" 
              :key="'teacher-' + index" 
              class="subject-card"
              @click="openQuiz(quiz, 'teacher')"
            >
              <div class="card-cover">
                <img v-if="quiz.cover_image" :src="quiz.cover_image" alt="Cover" class="cover-image" />
                <div v-else class="card-emoji">{{ quiz.emoji }}</div>
                <span class="quiz-source-badge teacher">👨‍🏫 Teacher</span>
              </div>
              <div class="card-body">
                <span class="card-badge">{{ quiz.total_questions || quiz.questions?.length || 0 }} Qs</span>
                <h3 class="card-title">{{ quiz.title }}</h3>
                <span class="quiz-subject">{{ quiz.subject || 'General' }}</span>
              </div>
            </div>

            <div v-if="filteredQuizzes.length === 0" class="empty-state">
              <p>📭 Tidak ada kuis yang ditemukan</p>
              <p class="empty-sub">Coba cari dengan kata kunci lain atau cek kembali</p>
            </div>
          </div>
        </section>

      </div>

      <!-- ACTIVITY TAB -->
      <div v-if="currentTab === 'activity'" class="activity-page">
        <h2 class="activity-title">Activity History</h2>
        <p class="activity-subtitle">Kuis yang sudah kamu kerjakan</p>
        
        <div class="activity-list">
          <div 
            v-for="(item, index) in allActivities" 
            :key="index"
            class="activity-item"
          >
            <div class="activity-icon" :style="{ backgroundImage: item.cover_image ? `url(${item.cover_image})` : 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' }">
              <span v-if="!item.cover_image">{{ item.emoji || '📝' }}</span>
            </div>
            <div class="activity-info">
              <h4 class="activity-name">{{ item.title }}</h4>
              <span class="activity-subject">{{ item.subject || 'General' }}</span>
              <span class="activity-date">{{ item.date }}</span>
            </div>
            <div class="activity-result">
              <span class="activity-score" :class="item.accuracyClass">
                {{ item.accuracy }}
              </span>
            </div>
            <div class="activity-actions">
              <button class="btn-view-result" @click="viewResult(item)" title="Lihat hasil">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="btn-delete-history" @click="deleteHistory(index)" title="Hapus history">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
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

    <!-- QUIZ DETAIL MODAL -->
    <div v-if="selectedQuiz" class="modal-overlay" @click.self="selectedQuiz = null">
      <div class="modal-card">
        <div class="modal-cover" :style="{ backgroundImage: selectedQuiz.cover_image ? `url(${selectedQuiz.cover_image})` : 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' }">
          <span class="modal-emoji" v-if="!selectedQuiz.cover_image">{{ selectedQuiz.emoji || '📝' }}</span>
          <span class="quiz-type-badge" :class="selectedQuiz.source">{{ selectedQuiz.source === 'teacher' ? '👨‍🏫 Teacher' : '📚 Default' }}</span>
        </div>
        
        <div class="modal-body">
          <h2 class="modal-title">{{ selectedQuiz.title }}</h2>
          <p class="modal-questions">{{ selectedQuiz.total_questions || 0 }} questions</p>
          <p class="modal-subject">📖 {{ selectedQuiz.subject || 'General' }}</p>
          <p class="modal-description">{{ selectedQuiz.description || 'Test your knowledge!' }}</p>
          
          <div class="modal-actions">
            <button class="btn-start" @click="startQuiz">Start</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT MODAL -->
    <div v-if="showResultModal" class="modal-overlay" @click.self="showResultModal = false">
      <div class="modal-card result-modal">
        <h2 class="result-title">📊 Hasil Kuis</h2>
        <div class="result-score">
          <span class="score-number">{{ selectedResult?.score || 0 }}%</span>
        </div>
        <div class="result-details">
          <p>✅ Benar: {{ selectedResult?.correct || 0 }}</p>
          <p>❌ Salah: {{ (selectedResult?.total || 0) - (selectedResult?.correct || 0) }}</p>
          <p>📝 Total: {{ selectedResult?.total || 0 }}</p>
        </div>
        <button class="btn-close-result" @click="showResultModal = false">Tutup</button>
      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useQuizStore } from '@/stores/quizStore.js';

export default {
  name: 'DashboardSiswa',
  emits: ['logout', 'start-quiz'],
  data() {
    return {
      currentTab: 'home',
      searchQuery: '',
      joinCode: '',
      selectedFilter: 'all', // 🔥 FILTER SUBJECT
      studentName: 'Akmal Randa',
      selectedQuiz: null,
      showResultModal: false,
      selectedResult: null,

      // QUIZ DEFAULT
      defaultQuizzes: [
        { 
          id: 1, 
          title: 'Sejarah Indonesia', 
          subject: 'Sejarah',
          total_questions: 5, 
          emoji: '📜',
          cover_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop',
          description: 'Test your knowledge about Indonesian history',
          duration: 10,
          source: 'default',
          questions: [
            { id: 101, question: 'Tanggal berapa Indonesia merdeka?', options: ['17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947', '17 Agustus 1944'], options_images: [], correct_index: 0, points: 1 },
            { id: 102, question: 'Siapa proklamator Indonesia?', options: ['Soekarno-Hatta', 'Soeharto', 'Habibie', 'Megawati'], options_images: [], correct_index: 0, points: 1 },
            { id: 103, question: 'Apa ibukota Indonesia?', options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'], options_images: [], correct_index: 0, points: 1 }
          ]
        },
        { 
          id: 2, 
          title: 'Pengetahuan Sosial', 
          subject: 'IPS',
          total_questions: 5, 
          emoji: '🌍',
          cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
          description: 'Social knowledge quiz',
          duration: 10,
          source: 'default',
          questions: [
            { id: 201, question: 'Apa ibukota Jepang?', options: ['Tokyo', 'Osaka', 'Nagoya', 'Kyoto'], options_images: [], correct_index: 0, points: 1 },
            { id: 202, question: 'Benua apa yang terluas?', options: ['Asia', 'Afrika', 'Amerika', 'Europa'], options_images: [], correct_index: 0, points: 1 }
          ]
        },
        { 
          id: 3, 
          title: 'Matematika', 
          subject: 'Matematika',
          total_questions: 5, 
          emoji: '📐',
          cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop',
          description: 'Math quiz for you',
          duration: 10,
          source: 'default',
          questions: [
            { id: 301, question: 'Berapa hasil 2 + 2?', options: ['3', '4', '5', '6'], options_images: [], correct_index: 1, points: 1 },
            { id: 302, question: 'Berapa hasil 5 x 5?', options: ['20', '25', '30', '35'], options_images: [], correct_index: 1, points: 1 }
          ]
        },
        { 
          id: 4, 
          title: 'Pengetahuan Alam', 
          subject: 'IPA',
          total_questions: 5, 
          emoji: '🔬',
          cover_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop',
          description: 'Science quiz',
          duration: 10,
          source: 'default',
          questions: [
            { id: 401, question: 'Planet terdekat dengan matahari?', options: ['Venus', 'Merkurius', 'Bumi', 'Mars'], options_images: [], correct_index: 1, points: 1 },
            { id: 402, question: 'Apa yang membuat tumbuhan hijau?', options: ['Air', 'Klorofil', 'Tanah', 'Matahari'], options_images: [], correct_index: 1, points: 1 }
          ]
        },
        { 
          id: 5, 
          title: 'Pendidikan Kewarganegaraan', 
          subject: 'PKN',
          total_questions: 5, 
          emoji: '🦅',
          cover_image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&h=200&fit=crop',
          description: 'Civics education quiz',
          duration: 10,
          source: 'default',
          questions: [
            { id: 501, question: 'Apa dasar negara Indonesia?', options: ['Pancasila', 'UUD 1945', 'Bhinneka Tunggal Ika', 'Sumpah Pemuda'], options_images: [], correct_index: 0, points: 1 },
            { id: 502, question: 'Siapa presiden pertama Indonesia?', options: ['Soekarno', 'Soeharto', 'Habibie', 'Megawati'], options_images: [], correct_index: 0, points: 1 }
          ]
        },
        { 
          id: 6, 
          title: 'Bahasa Indonesia', 
          subject: 'Bahasa Indonesia',
          total_questions: 5, 
          emoji: '🇮🇩',
          cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop',
          description: 'Test your Indonesian language skills',
          duration: 10,
          source: 'default',
          questions: [
            { id: 601, question: 'Apa sinonim dari "cantik"?', options: ['Indah', 'Jelek', 'Besar', 'Kecil'], options_images: [], correct_index: 0, points: 1 },
            { id: 602, question: 'Apa antonim dari "besar"?', options: ['Tinggi', 'Pendek', 'Kecil', 'Lebar'], options_images: [], correct_index: 2, points: 1 }
          ]
        },
        { 
          id: 7, 
          title: 'Bahasa Inggris', 
          subject: 'Bahasa Inggris',
          total_questions: 5, 
          emoji: '🇬🇧',
          cover_image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&h=200&fit=crop',
          description: 'Test your English skills',
          duration: 10,
          source: 'default',
          questions: [
            { id: 701, question: 'What is the meaning of "Cat"?', options: ['Kucing', 'Anjing', 'Burung', 'Ikan'], options_images: [], correct_index: 0, points: 1 },
            { id: 702, question: 'What is the past tense of "Go"?', options: ['Goed', 'Went', 'Gone', 'Going'], options_images: [], correct_index: 1, points: 1 }
          ]
        }
      ],

      teacherQuizzes: [],
      recentActivities: [],
      allActivities: [],
      loading: false
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
    defaultQuizzesDisplay() {
      return this.defaultQuizzes;
    },
    teacherQuizzesDisplay() {
      return this.teacherQuizzes;
    },
    // 🔥 AMBIL SEMUA SUBJECT UNIK UNTUK FILTER
    availableSubjects() {
      const subjects = new Set();
      this.defaultQuizzes.forEach(q => subjects.add(q.subject));
      this.teacherQuizzes.forEach(q => subjects.add(q.subject));
      return Array.from(subjects).filter(Boolean).sort();
    },
    // 🔥 FILTER BERDASARKAN SEARCH QUERY DAN SUBJECT
    filteredDefaultQuizzes() {
      return this.defaultQuizzes.filter(quiz => {
        const matchSearch = !this.searchQuery || 
          quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          quiz.subject?.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchFilter = this.selectedFilter === 'all' || quiz.subject === this.selectedFilter;
        return matchSearch && matchFilter;
      });
    },
    filteredTeacherQuizzes() {
      return this.teacherQuizzes.filter(quiz => {
        const matchSearch = !this.searchQuery || 
          quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          quiz.subject?.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchFilter = this.selectedFilter === 'all' || quiz.subject === this.selectedFilter;
        return matchSearch && matchFilter;
      });
    },
    // 🔥 GABUNGAN UNTUK TOTAL
    filteredQuizzes() {
      return [...this.filteredDefaultQuizzes, ...this.filteredTeacherQuizzes];
    },
    allQuizzes() {
      return [...this.defaultQuizzes, ...this.teacherQuizzes];
    }
  },
  mounted() {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.studentName = savedName;
    }
    
    this.loadFromStorage();
    this.loadTeacherQuizzes();
    this.checkQuizResult();
    
    this.refreshInterval = setInterval(() => {
      this.loadTeacherQuizzes();
    }, 5000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    // ===== LOAD TEACHER QUIZZES =====
    async loadTeacherQuizzes() {
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.fetchStudentQuizzes();
        
        if (result.success) {
          this.teacherQuizzes = result.data.map(q => ({
            id: q.id,
            title: q.title,
            subject: q.subject || 'General',
            total_questions: q.total_questions || q.questions?.length || 0,
            emoji: q.emoji || '📝',
            cover_image: q.cover_image || null,
            description: q.description || 'Quiz from teacher',
            duration: q.duration || q.total_time || 10,
            source: 'teacher',
            join_code: q.join_code,
            questions: q.questions ? q.questions.map(qq => ({
              id: qq.id || Date.now(),
              question: qq.question || 'No question',
              options: Array.isArray(qq.options) ? qq.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              options_images: Array.isArray(qq.options_images) ? qq.options_images : [],
              correct_index: qq.correct_index !== undefined ? qq.correct_index : 0,
              points: qq.points || 1
            })) : []
          }));
          console.log('✅ Teacher quizzes loaded:', this.teacherQuizzes.length);
        }
      } catch (error) {
        console.error('Error loading teacher quizzes:', error);
      }
    },

    // ===== JOIN QUIZ VIA CODE =====
    async handleJoinCode() {
      if (!this.joinCode.trim()) {
        alert('Masukkan kode join terlebih dahulu!');
        return;
      }
      
      try {
        const quizStore = useQuizStore();
        const result = await quizStore.joinQuiz(this.joinCode.trim());
        
        if (result.success) {
          alert(`✅ Berhasil join kuis: ${result.data.title}`);
          this.joinCode = '';
          
          const newQuiz = {
            id: result.data.id,
            title: result.data.title,
            subject: result.data.subject || 'General',
            total_questions: result.data.total_questions || result.data.questions?.length || 0,
            emoji: result.data.emoji || '📝',
            cover_image: result.data.cover_image || null,
            description: result.data.description || 'Quiz from teacher',
            duration: result.data.duration || result.data.total_time || 10,
            source: 'teacher',
            join_code: result.data.join_code,
            questions: result.data.questions ? result.data.questions.map(q => ({
              id: q.id || Date.now(),
              question: q.question || 'No question',
              options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              options_images: Array.isArray(q.options_images) ? q.options_images : [],
              correct_index: q.correct_index !== undefined ? q.correct_index : 0,
              points: q.points || 1
            })) : []
          };
          
          const exists = this.teacherQuizzes.some(q => q.id === newQuiz.id);
          if (!exists) {
            this.teacherQuizzes.push(newQuiz);
            this.saveToStorage();
          }
          
          this.openQuiz(newQuiz, 'teacher');
        } else {
          alert('❌ ' + result.message);
        }
      } catch (error) {
        console.error('Join error:', error);
        alert('❌ Gagal join kuis. Silakan coba lagi.');
      }
    },

    // ===== OPEN QUIZ DETAIL =====
    openQuiz(quiz, source = 'default') {
      const isTeacher = source === 'teacher' || quiz.source === 'teacher';
      
      let questions = [];
      if (isTeacher) {
        questions = quiz.questions ? quiz.questions.map(q => ({
          id: q.id || Date.now(),
          question: q.question || 'No question',
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          question_image: q.question_image || null,
          options_images: Array.isArray(q.options_images) ? q.options_images : [],
          correct_index: q.correct_index !== undefined ? q.correct_index : 0,
          points: q.points || 1
        })) : [];
      } else {
        const defaultQuiz = this.defaultQuizzes.find(q => q.id === quiz.id);
        questions = defaultQuiz?.questions ? defaultQuiz.questions.map(q => ({
          id: q.id || Date.now(),
          question: q.question || 'No question',
          options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          question_image: q.question_image || null,
          options_images: q.options_images || [],
          correct_index: q.correct_index !== undefined ? q.correct_index : 0,
          points: q.points || 1
        })) : [];
      }
      
      this.selectedQuiz = {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject || 'General',
        description: quiz.description || 'Test your knowledge!',
        total_questions: quiz.total_questions || questions.length || 0,
        duration: quiz.duration || 10,
        emoji: quiz.emoji || '📝',
        cover_image: quiz.cover_image || null,
        questions: questions,
        source: isTeacher ? 'teacher' : 'default'
      };
    },

    // ===== START QUIZ =====
    startQuiz() {
      if (!this.selectedQuiz) return;
      
      const quiz = this.selectedQuiz;
      const quizId = quiz.id;
      
      console.log('📌 Starting quiz with ID:', quizId);
      
      localStorage.setItem('current_quiz_id', String(quizId));
      localStorage.setItem('current_quiz_title', quiz.title);
      localStorage.setItem('current_quiz_duration', quiz.duration || 10);
      localStorage.setItem('current_quiz_cover', quiz.cover_image || '');
      localStorage.setItem('current_quiz_subject', quiz.subject || 'General');
      
      const questions = quiz.questions?.map(q => ({
        id: q.id || Date.now(),
        question: q.question || 'No question',
        question_image: q.question_image || null,
        options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        options_images: Array.isArray(q.options_images) ? q.options_images : [],
        correct_index: q.correct_index || 0,
        points: q.points || 1
      })) || [];
      
      localStorage.setItem('current_quiz_questions', JSON.stringify(questions));
      
      this.$emit('start-quiz', quizId);
      this.selectedQuiz = null;
    },

    // ===== CHECK QUIZ RESULT =====
    checkQuizResult() {
      const quizResult = localStorage.getItem('quiz_result');
      if (quizResult) {
        try {
          const result = JSON.parse(quizResult);
          this.addToRecent(result);
          localStorage.removeItem('quiz_result');
        } catch (e) {
          console.error('Error parsing quiz result:', e);
        }
      }
    },

    // ===== ADD TO RECENT ACTIVITY =====
    addToRecent(quizResult) {
      const accuracy = quizResult.score + '%';
      const accuracyClass = quizResult.score >= 70 ? 'accuracy-green' : 'accuracy-red';
      
      const activity = {
        id: Date.now(),
        title: quizResult.title || 'Quiz',
        subject: quizResult.subject || localStorage.getItem('current_quiz_subject') || 'General',
        questions: quizResult.totalQuestions || 5,
        accuracy: accuracy,
        accuracyClass: accuracyClass,
        emoji: quizResult.emoji || '📝',
        cover_image: quizResult.cover_image || localStorage.getItem('current_quiz_cover') || null,
        score: quizResult.score || 0,
        correct: quizResult.correct || 0,
        total: quizResult.totalQuestions || 5,
        date: new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      this.recentActivities.unshift(activity);
      if (this.recentActivities.length > 5) {
        this.recentActivities.pop();
      }
      
      this.allActivities.unshift(activity);
      this.saveToStorage();
    },

    // ===== STORAGE =====
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
    },

    // ===== ACTIVITY =====
    viewResult(item) {
      this.selectedResult = {
        score: item.score || 0,
        correct: item.correct || 0,
        total: item.total || 5
      };
      this.showResultModal = true;
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

    filterQuizzes() {
      // 🔥 FILTER DI HANDLE OLEH COMPUTED PROPERTY
      console.log('🔍 Searching for:', this.searchQuery);
    },

    // 🔥 GET EMOJI UNTUK SUBJECT
    getSubjectEmoji(subject) {
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
      return emojis[subject] || '📚';
    },

    // ===== LOGOUT =====
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
/* ... style sama seperti sebelumnya dengan tambahan filter ... */
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
  width: 250px;
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

/* 🔥 FILTER CONTAINER */
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  color: #64748b;
}

.filter-btn:hover {
  border-color: #7468f3;
  color: #7468f3;
}

.filter-btn.active {
  background: #7468f3;
  border-color: #7468f3;
  color: white;
}

.filter-count {
  font-size: 13px;
  color: #94a3b8;
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

.activity-card .card-cover {
  height: 100px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.activity-card .card-cover .card-emoji {
  font-size: 40px;
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
  margin: 2px 0 4px 0;
  text-transform: capitalize;
}

.activity-card .quiz-subject {
  font-size: 11px;
  color: #6c5ce7;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
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

.subject-card .card-cover {
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-emoji {
  font-size: 48px;
}

.quiz-source-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  color: white;
}

.quiz-source-badge.default {
  background: rgba(108, 92, 231, 0.8);
}

.quiz-source-badge.teacher {
  background: rgba(239, 68, 68, 0.8);
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

.subject-card .quiz-subject {
  font-size: 11px;
  color: #6c5ce7;
  font-weight: 500;
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

.empty-sub {
  font-size: 13px;
  color: #cbd5e1;
  margin-top: 4px;
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
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
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

.activity-subject {
  font-size: 12px;
  color: #6c5ce7;
  font-weight: 500;
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

.activity-actions {
  display: flex;
  gap: 8px;
}

.btn-view-result {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c5ce7;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-view-result:hover {
  background: #f0edff;
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

.modal-card {
  background: white;
  width: 90%;
  max-width: 380px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-cover {
  height: 140px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.modal-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.quiz-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.quiz-type-badge.default {
  background: rgba(108, 92, 231, 0.8);
}

.quiz-type-badge.teacher {
  background: rgba(239, 68, 68, 0.8);
}

.modal-body {
  padding: 20px 24px 28px;
  text-align: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
  text-transform: capitalize;
}

.modal-questions {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 4px 0;
}

.modal-subject {
  font-size: 13px;
  color: #6c5ce7;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.modal-description {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn-start {
  width: 100%;
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-start:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
}

.result-modal {
  padding: 32px 28px 28px;
  text-align: center;
}

.result-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.result-score {
  font-size: 48px;
  font-weight: 700;
  color: #6c5ce7;
  margin-bottom: 12px;
}

.score-number {
  font-size: 48px;
}

.result-details {
  text-align: left;
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.result-details p {
  font-size: 14px;
  color: #1e293b;
  margin: 4px 0;
}

.btn-close-result {
  padding: 10px 36px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close-result:hover {
  background: #5a4bd1;
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
    width: 140px;
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

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }

  .filter-count {
    text-align: center;
  }
}
</style>