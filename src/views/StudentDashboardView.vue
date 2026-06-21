<template>
  <div class="student-dashboard">
    
    <!-- ===== NAVBAR ===== -->
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
        <a href="#" class="nav-link active">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a href="#" class="nav-link">
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

    <!-- ===== MAIN CONTENT ===== -->
    <main class="main-content">
      
      <!-- ===== TOP ROW: Join Code + Welcome ===== -->
      <div class="top-row">
        <div class="join-card">
          <div class="join-wrapper">
            <input type="text" placeholder="Enter a join code" v-model="joinCode" class="join-input" />
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

      <!-- ===== RECENT ACTIVITY ===== -->
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
        </div>
      </section>

      <!-- ===== SUBJECTS ===== -->
      <section class="section">
        <h2 class="section-title">Subjects</h2>
        <div class="card-grid">
          <div 
            v-for="(subject, index) in subjects" 
            :key="index" 
            class="subject-card"
            @click="openQuiz(subject)"
          >
            <div class="card-emoji">{{ subject.emoji }}</div>
            <div class="card-body">
              <span class="card-badge">{{ subject.questions }} Qs</span>
              <h3 class="card-title">{{ subject.title }}</h3>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- ===== MODAL DETAIL QUIZ ===== -->
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

// 🔥 DATA SOAL LENGKAP PER MATA PELAJARAN
const quizData = {
  // ===== SEJARAH INDONESIA =====
  'sejarah indonesia': {
    title: 'Sejarah Indonesia',
    emoji: '🇲🇨',
    questions: [
      {
        question: 'Tanggal berapa Indonesia merdeka?',
        options: ['17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947', '17 Agustus 1944'],
        correct_index: 0
      },
      {
        question: 'Siapa yang membacakan teks proklamasi?',
        options: ['Soekarno', 'Mohammad Hatta', 'Ahmad Soebarjo', 'Ki Hajar Dewantara'],
        correct_index: 0
      },
      {
        question: 'Di mana teks proklamasi dibacakan?',
        options: ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya'],
        correct_index: 0
      },
      {
        question: 'Siapa yang mengetik teks proklamasi?',
        options: ['Sayuti Melik', 'Mohammad Hatta', 'Soekarno', 'Ahmad Soebarjo'],
        correct_index: 0
      },
      {
        question: 'Apa nama rumusan dasar negara yang diusulkan oleh Soekarno?',
        options: ['Pancasila', 'Piagam Jakarta', 'UUD 1945', 'Proklamasi'],
        correct_index: 0
      }
    ]
  },

  // ===== PENGETAHUAN SOSIAL =====
  'pengetahuan sosial': {
    title: 'Pengetahuan Sosial',
    emoji: '🧠',
    questions: [
      {
        question: 'Apa ibu kota Indonesia?',
        options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
        correct_index: 0
      },
      {
        question: 'Berapa jumlah provinsi di Indonesia saat ini?',
        options: ['34', '35', '33', '32'],
        correct_index: 0
      },
      {
        question: 'Apa bahasa persatuan Indonesia?',
        options: ['Bahasa Indonesia', 'Bahasa Jawa', 'Bahasa Sunda', 'Bahasa Melayu'],
        correct_index: 0
      },
      {
        question: 'Siapa presiden ke-3 Indonesia?',
        options: ['B.J. Habibie', 'Abdurrahman Wahid', 'Megawati Soekarnoputri', 'Susilo Bambang Yudhoyono'],
        correct_index: 0
      },
      {
        question: 'Apa lambang negara Indonesia?',
        options: ['Garuda Pancasila', 'Banteng', 'Elang', 'Komodo'],
        correct_index: 0
      }
    ]
  },

  // ===== MATEMATIKA =====
  'matematika': {
    title: 'Matematika',
    emoji: '📐',
    questions: [
      {
        question: 'Berapakah hasil dari 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct_index: 1
      },
      {
        question: 'Berapakah hasil dari 5 × 5?',
        options: ['20', '25', '30', '35'],
        correct_index: 1
      },
      {
        question: 'Berapakah hasil dari 10 ÷ 2?',
        options: ['2', '3', '5', '7'],
        correct_index: 2
      },
      {
        question: 'Apa hasil dari 3²?',
        options: ['3', '6', '9', '12'],
        correct_index: 2
      },
      {
        question: 'Berapakah akar kuadrat dari 64?',
        options: ['6', '7', '8', '9'],
        correct_index: 2
      }
    ]
  },

  // ===== PENGETAHUAN ALAM =====
  'pengetahuan alam': {
    title: 'Pengetahuan Alam',
    emoji: '🌱',
    questions: [
      {
        question: 'Planet terbesar di tata surya adalah?',
        options: ['Jupiter', 'Saturnus', 'Uranus', 'Neptunus'],
        correct_index: 0
      },
      {
        question: 'Apa yang menyebabkan siang dan malam?',
        options: ['Rotasi Bumi', 'Revolusi Bumi', 'Gravitasi Bumi', 'Bulan'],
        correct_index: 0
      },
      {
        question: 'Berapa lama waktu yang dibutuhkan Bumi untuk berevolusi mengelilingi Matahari?',
        options: ['365 hari', '360 hari', '370 hari', '355 hari'],
        correct_index: 0
      },
      {
        question: 'Apa nama satelit alami Bumi?',
        options: ['Matahari', 'Bulan', 'Mars', 'Venus'],
        correct_index: 1
      },
      {
        question: 'Air memiliki berapa wujud?',
        options: ['2', '3', '4', '5'],
        correct_index: 1
      }
    ]
  },

  // ===== PENDIDIKAN KEWARGANEGARAAN =====
  'pendidikan kewarganegaraan': {
    title: 'Pendidikan Kewarganegaraan',
    emoji: '🦅',
    questions: [
      {
        question: 'Apa semboyan negara Indonesia?',
        options: ['Bhinneka Tunggal Ika', 'Merdeka', 'Bersatu Kita Teguh', 'Indonesia Raya'],
        correct_index: 0
      },
      {
        question: 'Berapa sila dalam Pancasila?',
        options: ['4', '5', '6', '7'],
        correct_index: 1
      },
      {
        question: 'Sila ke-3 Pancasila berbunyi?',
        options: ['Persatuan Indonesia', 'Kemanusiaan yang adil dan beradab', 'Kerakyatan', 'Keadilan sosial'],
        correct_index: 0
      },
      {
        question: 'Hari Kebangkitan Nasional diperingati pada tanggal?',
        options: ['20 Mei', '21 Mei', '22 Mei', '23 Mei'],
        correct_index: 0
      },
      {
        question: 'Bendera Indonesia memiliki warna?',
        options: ['Merah dan Putih', 'Merah dan Biru', 'Biru dan Putih', 'Kuning dan Merah'],
        correct_index: 0
      }
    ]
  },

  // ===== SENI BUDAYA =====
  'seni budaya': {
    title: 'Seni Budaya',
    emoji: '🎭',
    questions: [
      {
        question: 'Tari tradisional dari Bali adalah?',
        options: ['Kecak', 'Jaipong', 'Saman', 'Pendet'],
        correct_index: 0
      },
      {
        question: 'Alat musik tradisional dari Jawa Barat adalah?',
        options: ['Angklung', 'Gamelan', 'Kolintang', 'Tifa'],
        correct_index: 0
      },
      {
        question: 'Wayang adalah kesenian dari daerah?',
        options: ['Jawa', 'Sumatra', 'Kalimantan', 'Sulawesi'],
        correct_index: 0
      },
      {
        question: 'Tari Saman berasal dari daerah?',
        options: ['Jawa', 'Aceh', 'Bali', 'Sumatra Utara'],
        correct_index: 1
      },
      {
        question: 'Rumah adat Honai berasal dari?',
        options: ['Papua', 'Jawa', 'Sumatra', 'Kalimantan'],
        correct_index: 0
      }
    ]
  },

  // ===== PENDIDIKAN AGAMA =====
  'pendidikan agama': {
    title: 'Pendidikan Agama',
    emoji: '📖',
    questions: [
      {
        question: 'Agama Islam memiliki berapa rukun iman?',
        options: ['5', '6', '7', '8'],
        correct_index: 1
      },
      {
        question: 'Agama Kristen memiliki kitab suci yang disebut?',
        options: ['Alkitab', 'Al-Quran', 'Wedha', 'Tripitaka'],
        correct_index: 0
      },
      {
        question: 'Agama Hindu memiliki kitab suci yang disebut?',
        options: ['Wedha', 'Tripitaka', 'Alkitab', 'Al-Quran'],
        correct_index: 0
      },
      {
        question: 'Tempat ibadah agama Buddha adalah?',
        options: ['Vihara', 'Masjid', 'Gereja', 'Pura'],
        correct_index: 0
      },
      {
        question: 'Agama yang memiliki kitab suci Wedha adalah?',
        options: ['Hindu', 'Buddha', 'Islam', 'Kristen'],
        correct_index: 0
      }
    ]
  },

  // ===== PENJASKES =====
  'penjaskes': {
    title: 'Penjaskes',
    emoji: '⚽',
    questions: [
      {
        question: 'Olahraga sepak bola dimainkan oleh berapa orang?',
        options: ['9', '10', '11', '12'],
        correct_index: 2
      },
      {
        question: 'Bulu tangkis menggunakan alat pemukul yang disebut?',
        options: ['Raket', 'Bet', 'Tongkat', 'Kayu'],
        correct_index: 0
      },
      {
        question: 'Renang gaya punggung adalah gaya renang yang dilakukan dengan posisi?',
        options: ['Telentang', 'Tengkurap', 'Miring', 'Berbaring'],
        correct_index: 0
      },
      {
        question: 'Permainan bola basket dimainkan oleh berapa orang per tim?',
        options: ['4', '5', '6', '7'],
        correct_index: 1
      },
      {
        question: 'Olahraga atletik terdiri dari?',
        options: ['Lari, Lompat, Lempar', 'Renang, Sepak Bola, Bola Basket', 'Bulu Tangkis, Tenis, Golf', 'Bola Voli, Futsal, Bola Tangan'],
        correct_index: 0
      }
    ]
  },

  // ===== BAHASA INDONESIA =====
  'bahasa indonesia': {
    title: 'Bahasa Indonesia',
    emoji: '🇮🇩',
    questions: [
      {
        question: 'Kalimat yang memiliki predikat adalah?',
        options: ['Kalimat berita', 'Kalimat tanya', 'Kalimat perintah', 'Kalimat seru'],
        correct_index: 0
      },
      {
        question: 'Kata "makan" termasuk jenis kata?',
        options: ['Verba', 'Nomina', 'Adjektiva', 'Numeralia'],
        correct_index: 0
      },
      {
        question: 'Apa sinonim dari kata "gembira"?',
        options: ['Sedih', 'Marah', 'Senang', 'Bingung'],
        correct_index: 2
      },
      {
        question: 'Tanda baca yang digunakan untuk mengakhiri kalimat berita adalah?',
        options: ['Titik (.)', 'Koma (,)', 'Tanda tanya (?)', 'Tanda seru (!)'],
        correct_index: 0
      },
      {
        question: 'Pantun memiliki berapa baris?',
        options: ['2', '3', '4', '5'],
        correct_index: 2
      }
    ]
  },

  // ===== BAHASA SUNDA =====
  'bahasa sunda': {
    title: 'Bahasa Sunda',
    emoji: '🧱',
    questions: [
      {
        question: 'Apa arti "Wilujeng enjing" dalam bahasa Sunda?',
        options: ['Selamat pagi', 'Selamat siang', 'Selamat sore', 'Selamat malam'],
        correct_index: 0
      },
      {
        question: '"Kumaha damang?" dalam bahasa Sunda artinya?',
        options: ['Apa kabar?', 'Sudah makan?', 'Mau ke mana?', 'Siapa nama kamu?'],
        correct_index: 0
      },
      {
        question: 'Apa arti "Maneh" dalam bahasa Sunda?',
        options: ['Kamu', 'Saya', 'Mereka', 'Kita'],
        correct_index: 0
      },
      {
        question: '"Nuhun" dalam bahasa Sunda artinya?',
        options: ['Terima kasih', 'Maaf', 'Permisi', 'Tolong'],
        correct_index: 0
      },
      {
        question: 'Apa arti "Abdi" dalam bahasa Sunda?',
        options: ['Saya', 'Kamu', 'Mereka', 'Kita'],
        correct_index: 0
      }
    ]
  }
};

export default {
  name: 'StudentDashboardView',
  components: {
    QuizDetailModal
  },
  emits: ['logout', 'start-quiz'],
  data() {
    return {
      searchQuery: '',
      joinCode: '',
      studentName: 'Akmal Randi',
      selectedQuiz: null,

      recentActivities: [
        { 
          id: 1, 
          title: 'sejarah indonesia', 
          questions: 5, 
          accuracy: '50%', 
          accuracyClass: 'accuracy-red', 
          emoji: '🇲🇨',
          description: 'Test your knowledge about Indonesian history',
          duration: 10,
          total_questions: 5
        },
        { 
          id: 2, 
          title: 'pengetahuan sosial', 
          questions: 5, 
          accuracy: '100%', 
          accuracyClass: 'accuracy-green', 
          emoji: '🧠',
          description: 'Social knowledge quiz',
          duration: 10,
          total_questions: 5
        },
        { 
          id: 3, 
          title: 'matematika', 
          questions: 5, 
          accuracy: '100%', 
          accuracyClass: 'accuracy-green', 
          emoji: '📐',
          description: 'Math quiz for you',
          duration: 10,
          total_questions: 5
        },
        { 
          id: 4, 
          title: 'pengetahuan alam', 
          questions: 5, 
          accuracy: '100%', 
          accuracyClass: 'accuracy-green', 
          emoji: '🌱',
          description: 'Science quiz',
          duration: 10,
          total_questions: 5
        },
        { 
          id: 5, 
          title: 'pendidikan kewarganegaraan', 
          questions: 5, 
          accuracy: '100%', 
          accuracyClass: 'accuracy-green', 
          emoji: '🦅',
          description: 'Civics education quiz',
          duration: 10,
          total_questions: 5
        }
      ],

      subjects: [
        { id: 6, title: 'pengetahuan alam', questions: 5, emoji: '🌱', description: 'Science quiz', duration: 10, total_questions: 5 },
        { id: 7, title: 'pendidikan kewarganegaraan', questions: 5, emoji: '🦅', description: 'Civics education quiz', duration: 10, total_questions: 5 },
        { id: 8, title: 'seni budaya', questions: 5, emoji: '🎭', description: 'Art and culture quiz', duration: 10, total_questions: 5 },
        { id: 9, title: 'pendidikan agama', questions: 5, emoji: '📖', description: 'Religion education quiz', duration: 10, total_questions: 5 },
        { id: 10, title: 'penjaskes', questions: 5, emoji: '⚽', description: 'Physical education quiz', duration: 10, total_questions: 5 },
        { id: 11, title: 'bahasa indonesia', questions: 5, emoji: '🇮🇩', description: 'Indonesian language quiz', duration: 10, total_questions: 5 },
        { id: 12, title: 'bahasa sunda', questions: 5, emoji: '🧱', description: 'Sundanese language quiz', duration: 10, total_questions: 5 }
      ]
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
    }
  },
  mounted() {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.studentName = savedName;
    }
  },
  methods: {
    handleJoinCode() {
      if (this.joinCode.trim()) {
        alert(`Joining room: ${this.joinCode}`);
      }
    },

    openQuiz(item) {
      // 🔥 AMBIL DATA SOAL DARI quizData
      const key = item.title.toLowerCase();
      const quiz = quizData[key] || quizData['sejarah indonesia'];
      
      this.selectedQuiz = {
        id: item.id,
        title: item.title,
        description: item.description || 'Test your knowledge!',
        total_questions: item.total_questions || item.questions || 5,
        duration: item.duration || 10,
        emoji: item.emoji || '📝',
        // 🔥 TAMBAHKAN SOAL
        questions: quiz.questions || []
      };
    },

    handleStartQuiz(quiz) {
      // 🔥 SIMPAN SOAL KE LOCALSTORAGE UNTUK DIPAKAI DI QUIZ PLAY
      localStorage.setItem('current_quiz_title', quiz.title);
      localStorage.setItem('current_quiz_questions', JSON.stringify(quiz.questions || []));
      
      this.$emit('start-quiz', quiz.id);
      this.selectedQuiz = null;
    },

    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
/* Style sama seperti sebelumnya */
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
  width: 160px;
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

.subject-card .card-emoji {
  height: 100px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin: 2px 0 0 0;
  text-transform: capitalize;
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
    width: 100px;
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
}
</style>