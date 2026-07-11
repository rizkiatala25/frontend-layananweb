<template>
  <div class="quiz-play">
    
    <!-- HEADER -->
    <header class="quiz-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="quiz-title">{{ quizTitle }}</span>
      </div>
      <div class="header-right">
        <div class="timer-container">
          <div class="timer-circle" :class="{ warning: timeRemaining <= 10 }">
            <span class="timer-text">{{ formattedTime }}</span>
          </div>
        </div>
        <div class="progress-text">
          <span class="question-number">{{ currentIndex + 1 }}/{{ questions.length }}</span>
        </div>
      </div>
    </header>

    <!-- PROGRESS BAR -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <!-- BODY -->
    <main class="quiz-body">
      <div class="question-container">
        <!-- Gambar Soal -->
        <div v-if="currentQuestion?.question_image" class="question-image-wrapper">
          <img :src="currentQuestion.question_image" alt="Question image" class="question-image" />
        </div>
        
        <div class="question-meta">
          <span class="question-number-label">Soal {{ currentIndex + 1 }}</span>
          <span class="question-points">{{ currentQuestion?.points || 1 }} Poin</span>
        </div>
        
        <h2 class="question-text">{{ currentQuestion?.question || 'Loading...' }}</h2>
        
        <!-- OPTIONS -->
        <div class="options-grid">
          <button 
            v-for="(option, index) in currentQuestion?.options || []" 
            :key="index"
            class="option-btn"
            :class="{
              selected: selectedAnswer === index,
              correct: showResult && index === correctAnswerIndex,
              wrong: showResult && selectedAnswer === index && index !== correctAnswerIndex,
              answered: answersMap[currentIndex] !== undefined && answersMap[currentIndex] === index
            }"
            :disabled="showResult || timeUp"
            @click="selectOption(index)"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <div v-if="currentQuestion?.options_images && currentQuestion.options_images[index]" class="option-image-wrapper">
              <img :src="currentQuestion.options_images[index]" alt="Option image" class="option-image" />
            </div>
            <span class="option-text">{{ option }}</span>
            <span v-if="answersMap[currentIndex] !== undefined && answersMap[currentIndex] === index" class="option-check">✓</span>
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button class="btn-nav prev" @click="previousQuestion" :disabled="currentIndex === 0">
            ← Previous
          </button>
          <button class="btn-nav next" @click="nextQuestion" :disabled="currentIndex === questions.length - 1">
            Next →
          </button>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="quiz-footer">
      <div class="footer-actions">
        <div class="answer-status">
          <span class="answered-count">
            {{ answeredCount }} / {{ questions.length }} terjawab
          </span>
          <span v-if="answeredCount < questions.length" class="warning-text">
            ⚠️ Jawab semua soal untuk submit
          </span>
          <span v-else class="success-text">
            ✅ Semua soal terjawab!
          </span>
        </div>
        <button 
          class="btn-submit" 
          :disabled="answeredCount < questions.length || submitting"
          @click="submitAllAnswers"
        >
          {{ submitting ? '⏳ Mengirim...' : '📤 Submit Quiz' }}
        </button>
      </div>
    </footer>

    <!-- POPUP QUIZ END -->
    <div v-if="showQuizEndPopup" class="quiz-end-overlay">
      <div class="quiz-end-card">
        <div class="quiz-end-icon">🎉</div>
        <h2 class="quiz-end-title">Quiz End!</h2>
        <p class="quiz-end-subtitle">Selamat! Kamu telah menyelesaikan semua soal.</p>
        <div class="quiz-end-timer">
          <div class="timer-circle-end">
            <span class="timer-text-end">{{ countdown }}</span>
          </div>
          <p class="timer-label">Redirecting to result...</p>
        </div>
        <div class="quiz-end-progress">
          <div class="progress-bar-end">
            <div class="progress-fill-end" :style="{ width: countdownPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT MODAL -->
    <div v-if="showResultModal" class="result-overlay" @click.self="closeResult">
      <div class="result-card">
        <div class="result-header">
          <h1 class="result-congrats">🎉 Congratulations {{ studentName }}</h1>
          <p class="result-sub">Good job</p>
        </div>

        <div class="result-accuracy">
          <h3 class="result-section-title">Let's check your statistic</h3>
          <div class="accuracy-circle">
            <span class="accuracy-number">{{ scorePercentage }}%</span>
          </div>
          <p class="accuracy-label">Accuracy</p>
        </div>

        <div class="result-performance">
          <h4 class="performance-title">Performance Quiz</h4>
          <div class="performance-item">
            <span class="performance-icon">✅</span>
            <span class="performance-label">Correct: {{ correctCount }}</span>
          </div>
          <div class="performance-item">
            <span class="performance-icon">❌</span>
            <span class="performance-label">Incorrect: {{ questions.length - correctCount }}</span>
          </div>
          <div class="performance-item">
            <span class="performance-icon">📊</span>
            <span class="performance-label">{{ scorePercentage }}% score</span>
          </div>
        </div>

        <div class="result-review">
          <h4 class="review-title">Review Question</h4>
          <p class="review-sub">Your results are ready.</p>
          
          <div 
            v-for="(item, index) in reviewAnswers" 
            :key="index"
            class="review-item"
          >
            <p class="review-question">{{ index + 1 }}. {{ item.question }}</p>
            <div class="review-options">
              <div 
                v-for="(opt, optIndex) in item.options" 
                :key="optIndex"
                class="review-option"
                :class="{
                  'review-correct': optIndex === item.correctIndex,
                  'review-wrong': optIndex === item.selectedIndex && optIndex !== item.correctIndex,
                  'review-selected': optIndex === item.selectedIndex
                }"
              >
                <span class="review-option-marker">
                  {{ optIndex === item.correctIndex ? '✅' : optIndex === item.selectedIndex && optIndex !== item.correctIndex ? '❌' : '○' }}
                </span>
                {{ opt }}
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn-result-done" @click="closeResult">Done</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useQuizStore } from '@/stores/quizStore.js';
import { useAuthStore } from '@/stores/auth.js';

export default {
  name: 'Quiz',
  props: {
    quizId: {
      type: [Number, String],
      required: false
    }
  },
  emits: ['finish', 'back'],
  data() {
    return {
      quizTitle: 'Quiz',
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      showResult: false,
      correctAnswerIndex: null,
      answersMap: {},
      timeRemaining: 60,
      timerInterval: null,
      showResultModal: false,
      correctCount: 0,
      scorePercentage: 0,
      submitting: false,
      timeUp: false,
      isTeacherQuiz: false,
      totalDuration: 0,
      studentName: 'Student',
      reviewAnswers: [],
      
      showQuizEndPopup: false,
      countdown: 10,
      countdownInterval: null
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || null;
    },
    isLastQuestion() {
      return this.currentIndex === this.questions.length - 1;
    },
    formattedTime() {
      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    progressPercentage() {
      return ((this.currentIndex + 1) / this.questions.length) * 100;
    },
    answeredCount() {
      return Object.keys(this.answersMap).length;
    },
    countdownPercentage() {
      return ((10 - this.countdown) / 10) * 100;
    }
  },
  mounted() {
    this.loadQuiz();
    this.startTimer();
    
    const authStore = useAuthStore();
    this.studentName = authStore.user?.full_name || localStorage.getItem('user_name') || 'Student';
  },
  beforeUnmount() {
    this.stopTimer();
    this.stopCountdown();
  },
  methods: {
    async loadQuiz() {
      try {
        const quizId = this.quizId;
        console.log('📌 Loading quiz ID:', quizId);
        
        if (quizId) {
          localStorage.setItem('current_quiz_id', String(quizId));
        }
        
        const savedQuestions = localStorage.getItem('current_quiz_questions');
        const savedTitle = localStorage.getItem('current_quiz_title') || 'Quiz';
        const savedDuration = parseInt(localStorage.getItem('current_quiz_duration')) || 60;
        
        if (savedQuestions) {
          try {
            const questions = JSON.parse(savedQuestions);
            if (questions && questions.length > 0) {
              console.log('📚 Loaded from localStorage:', questions);
              this.quizTitle = savedTitle;
              this.questions = questions.map(q => ({
                id: q.id || Date.now(),
                question: q.question || 'No question',
                options: Array.isArray(q.options) ? q.options.map(opt => typeof opt === 'string' ? opt : opt.option_text || opt) : ['Option A', 'Option B', 'Option C', 'Option D'],
                question_image: q.question_image || null,
                options_images: Array.isArray(q.options_images) ? q.options_images : [],
                correct_index: q.correct_index !== undefined ? q.correct_index : 0,
                points: q.points || 1
              }));
              this.answersMap = {};
              this.timeRemaining = savedDuration;
              console.log('✅ Questions loaded from localStorage:', this.questions.length);
              return;
            }
          } catch (e) {
            console.error('Error parsing saved questions:', e);
          }
        }
        
        const quizStore = useQuizStore();
        const result = await quizStore.fetchQuizDetail(quizId);
        console.log('📥 Result from backend:', result);
        
        if (result.success && result.data) {
          const data = result.data;
          this.quizTitle = data.title || 'Quiz';
          this.timeRemaining = data.duration || 60;
          
          if (data.questions && data.questions.length > 0) {
            this.questions = data.questions.map(q => {
              let options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
              if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object') {
                options = options.map(opt => opt.option_text || opt.text || opt);
              }
              if (typeof options === 'string') {
                try {
                  options = JSON.parse(options);
                } catch (e) {
                  options = ['Option A', 'Option B', 'Option C', 'Option D'];
                }
              }
              return {
                id: q.id || Date.now(),
                question: q.question || 'No question',
                options: Array.isArray(options) ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
                question_image: q.question_image || null,
                options_images: Array.isArray(q.options_images) ? q.options_images : [],
                correct_index: q.correct_index !== undefined ? q.correct_index : 0,
                points: q.points || 1
              };
            });
            this.answersMap = {};
            console.log('✅ Questions loaded from backend:', this.questions.length);
            return;
          }
        }
        
        console.log('⚠️ No data found, using mock data');
        this.loadMockData();
        
      } catch (error) {
        console.error('Error loading quiz:', error);
        this.loadMockData();
      }
    },

    loadMockData() {
      this.quizTitle = localStorage.getItem('current_quiz_title') || 'Quiz';
      this.timeRemaining = 60;
      
      this.questions = [
        {
          id: 1,
          question: 'Tanggal berapa Indonesia merdeka?',
          options: ['17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947', '17 Agustus 1944'],
          question_image: null,
          options_images: [],
          correct_index: 0,
          points: 1
        },
        {
          id: 2,
          question: 'Siapa presiden ke 3 Indonesia?',
          options: ['Megawati', 'B.J. Habibie', 'Jokowi', 'SBY'],
          question_image: null,
          options_images: [],
          correct_index: 1,
          points: 1
        }
      ];
      this.answersMap = {};
    },

    startTimer() {
      this.stopTimer();
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.timeUp = true;
          this.stopTimer();
          setTimeout(() => {
            this.autoNextQuestion();
          }, 1000);
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    autoNextQuestion() {
      this.timeUp = false;
      this.selectedAnswer = null;
      this.showResult = false;
      this.correctAnswerIndex = null;
      this.timeRemaining = 60;
      
      if (this.isLastQuestion) {
        this.submitAllAnswers();
      } else {
        this.currentIndex++;
        this.startTimer();
      }
    },

    selectOption(index) {
      if (!this.showResult && !this.timeUp) {
        this.selectedAnswer = index;
        this.answersMap[this.currentIndex] = index;
      }
    },

    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.selectedAnswer = this.answersMap[this.currentIndex + 1] !== undefined ? 
          this.answersMap[this.currentIndex + 1] : null;
        this.showResult = false;
        this.correctAnswerIndex = null;
        this.timeUp = false;
        this.currentIndex++;
        this.timeRemaining = 60;
        this.startTimer();
      }
    },

    previousQuestion() {
      if (this.currentIndex > 0) {
        this.selectedAnswer = this.answersMap[this.currentIndex - 1] !== undefined ? 
          this.answersMap[this.currentIndex - 1] : null;
        this.showResult = false;
        this.correctAnswerIndex = null;
        this.timeUp = false;
        this.currentIndex--;
        this.timeRemaining = 60;
        this.startTimer();
      }
    },

    goBack() {
      if (Object.keys(this.answersMap).length > 0) {
        if (confirm('Anda sudah mengerjakan beberapa soal. Yakin ingin keluar?')) {
          this.stopTimer();
          this.$emit('back');
        }
      } else {
        this.stopTimer();
        this.$emit('back');
      }
    },

    // ===== SUBMIT ALL ANSWERS - UPDATED =====
    async submitAllAnswers() {
      if (this.answeredCount < this.questions.length) {
        alert(`⚠️ Anda belum menjawab semua soal! (${this.answeredCount}/${this.questions.length})`);
        return;
      }

      this.submitting = true;

      try {
        // 🔥 HITUNG JAWABAN
        let correct = 0;
        const formattedAnswers = [];
        const reviewData = [];

        for (let i = 0; i < this.questions.length; i++) {
          const question = this.questions[i];
          const selected = this.answersMap[i];
          const isCorrect = selected === question.correct_index;
          
          if (isCorrect) correct++;
          
          formattedAnswers.push({
            question_id: question.id,
            selected: selected !== undefined ? selected : 0
          });

          reviewData.push({
            question: question.question,
            options: question.options || [],
            correctIndex: question.correct_index,
            selectedIndex: selected !== undefined ? selected : -1
          });
        }

        const totalQuestions = this.questions.length;
        const score = Math.round((correct / totalQuestions) * 100);

        this.correctCount = correct;
        this.scorePercentage = score;
        this.reviewAnswers = reviewData;

        // 🔥 CEK APAKAH INI QUIZ DEFAULT ATAU DARI GURU
        let quizId = this.quizId;
        
        // 🔥 CEK APAKAH QUIZ DARI GURU (ID > 1000 ATAU ADA join_code)
        const isTeacherQuiz = quizId && 
                             quizId !== 'undefined' && 
                             quizId !== 'default' &&
                             !String(quizId).startsWith('default') &&
                             Number(quizId) >= 1000;

        console.log('📌 Is teacher quiz?', isTeacherQuiz);
        console.log('📌 Quiz ID:', quizId);

        // 🔥 SELALU SIMPAN KE LOCALSTORAGE (BACKUP)
        this.saveResultToLocalStorage(score, correct, totalQuestions);

        // 🔥 JIKA QUIZ DARI GURU, KIRIM KE BACKEND
        if (isTeacherQuiz) {
          try {
            const numericId = Number(quizId);
            if (!isNaN(numericId) && numericId > 0) {
              const quizStore = useQuizStore();
              const result = await quizStore.submitQuiz(numericId, formattedAnswers);
              console.log('📥 Backend submit result:', result);
              
              if (result.success) {
                console.log('✅ Quiz result saved to database!');
              } else {
                console.warn('⚠️ Backend save failed but data saved locally:', result.message);
              }
            }
          } catch (backendError) {
            console.error('❌ Backend error:', backendError);
            // Data sudah tersimpan di localStorage sebagai backup
          }
        } else {
          console.log('📌 Quiz default, hanya simpan ke localStorage');
        }

        // 🔥 TAMPILKAN POPUP END
        this.stopTimer();
        this.showQuizEndPopup = true;
        this.countdown = 10;
        this.startCountdown();

      } catch (error) {
        console.error('❌ Submit error:', error);
        
        // 🔥 FALLBACK: HITUNG ULANG DAN SIMPAN KE LOCALSTORAGE
        let correct = 0;
        const reviewData = [];
        
        for (let i = 0; i < this.questions.length; i++) {
          const q = this.questions[i];
          const selectedIndex = this.answersMap[i];
          const isCorrect = selectedIndex === q.correct_index;
          
          if (isCorrect) correct++;
          
          reviewData.push({
            question: q.question,
            options: q.options || [],
            correctIndex: q.correct_index,
            selectedIndex: selectedIndex !== undefined ? selectedIndex : -1
          });
        }

        const score = Math.round((correct / this.questions.length) * 100);
        this.correctCount = correct;
        this.scorePercentage = score;
        this.reviewAnswers = reviewData;
        
        this.saveResultToLocalStorage(score, correct, this.questions.length);
        
        this.stopTimer();
        this.showQuizEndPopup = true;
        this.countdown = 10;
        this.startCountdown();
      } finally {
        this.submitting = false;
      }
    },

    // 🔥 SAVE TO LOCALSTORAGE
    saveResultToLocalStorage(score, correct, totalQuestions) {
      const studentName = this.studentName || localStorage.getItem('user_name') || 'Student';
      const quizId = this.quizId || localStorage.getItem('current_quiz_id') || 'default_' + Date.now();

      const quizResults = JSON.parse(localStorage.getItem('quiz_results') || '{}');
      
      if (!quizResults[quizId]) {
        quizResults[quizId] = [];
      }

      const formattedAnswers = this.questions.map((q, index) => {
        const options = q.options || [];
        const correctIndex = q.correct_index !== undefined ? q.correct_index : 0;
        const selectedIndex = this.answersMap[index];
        
        return {
          question: q.question || `Soal ${index + 1}`,
          question_image: q.question_image || null,
          options: options,
          options_images: q.options_images || [],
          correct_answer: options[correctIndex] || 'Correct Answer',
          user_answer: options[selectedIndex] !== undefined ? options[selectedIndex] : 'Tidak Dijawab'
        };
      });

      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Cek duplikasi
      const exists = quizResults[quizId].some(item => 
        item.studentName === studentName && 
        item.score === score && 
        item.date === dateStr
      );

      if (!exists) {
        quizResults[quizId].push({
          studentName: studentName,
          score: score,
          correct: correct,
          total: totalQuestions,
          date: dateStr,
          answers: formattedAnswers,
          quizTitle: this.quizTitle || localStorage.getItem('current_quiz_title') || 'Quiz',
          quizId: quizId
        });
        localStorage.setItem('quiz_results', JSON.stringify(quizResults));
      }

      // Simpan result terakhir
      const quizResult = {
        title: this.quizTitle || localStorage.getItem('current_quiz_title') || 'Quiz',
        totalQuestions: totalQuestions,
        score: score,
        correct: correct,
        emoji: '📝',
        cover_image: localStorage.getItem('current_quiz_cover') || null,
        subject: localStorage.getItem('current_quiz_subject') || 'General',
        quizId: quizId
      };
      localStorage.setItem('quiz_result', JSON.stringify(quizResult));

      console.log('✅ Result saved to localStorage:', quizResult);
    },

    startCountdown() {
      this.countdown = 10;
      this.stopCountdown();
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.stopCountdown();
          this.showQuizEndPopup = false;
          
          // 🔥 SETELAH COUNTDOWN SELESAI, TAMPILKAN RESULT MODAL
          console.log('📊 Showing result modal with data:', {
            correct: this.correctCount,
            total: this.questions.length,
            score: this.scorePercentage,
            reviewAnswers: this.reviewAnswers
          });
          
          // 🔥 PASTIKAN DATA SUDAH SIAP
          if (this.reviewAnswers.length === 0) {
            for (let i = 0; i < this.questions.length; i++) {
              const q = this.questions[i];
              const selectedIndex = this.answersMap[i];
              this.reviewAnswers.push({
                question: q.question,
                options: q.options || [],
                correctIndex: q.correct_index,
                selectedIndex: selectedIndex !== undefined ? selectedIndex : -1
              });
            }
          }
          
          this.showResultModal = true;
        }
      }, 1000);
    },

    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    },

    closeResult() {
      this.showResultModal = false;
      this.$router.push('/dashboard/siswa');
      this.$emit('finish', {
        correct: this.correctCount,
        total: this.questions.length,
        score: this.scorePercentage,
        answers: []
      });
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

.quiz-play {
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.quiz-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timer-circle {
  width: 52px;
  height: 52px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.timer-circle.warning {
  background: #fee2e2;
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.timer-text {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.timer-circle.warning .timer-text {
  color: #dc2626;
}

.progress-text {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  margin: 12px 0 16px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.quiz-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
  overflow-y: auto;
}

.question-container {
  max-width: 680px;
  width: 100%;
}

.question-image-wrapper {
  margin-bottom: 16px;
  text-align: center;
}

.question-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  object-fit: contain;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.question-points {
  font-size: 13px;
  color: #6c5ce7;
  font-weight: 600;
}

.question-text {
  font-size: 20px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.option-btn {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  color: #1e293b;
  width: 100%;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  border-color: #6c5ce7;
  background: #f8f7ff;
}

.option-btn.selected {
  border-color: #6c5ce7;
  background: #f0edff;
}

.option-btn.answered {
  border-color: #10b981;
  background: #ecfdf5;
}

.option-btn.correct {
  border-color: #10b981;
  background: #ecfdf5;
}

.option-btn.wrong {
  border-color: #ef4444;
  background: #fef2f2;
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-label {
  font-weight: 600;
  color: #94a3b8;
  min-width: 24px;
}

.option-image-wrapper {
  display: inline-block;
  flex-shrink: 0;
}

.option-image {
  max-width: 40px;
  max-height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.option-text {
  flex: 1;
  font-size: 15px;
  font-weight: 400;
  color: #1e293b;
}

.option-check {
  color: #10b981;
  font-weight: 700;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.btn-nav {
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #6c5ce7;
  color: #6c5ce7;
}

.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quiz-footer {
  padding: 12px 0 0 0;
  border-top: 1px solid #f1f5f9;
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.answer-status {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.answered-count {
  font-weight: 500;
  color: #1e293b;
}

.warning-text {
  color: #f59e0b;
}

.success-text {
  color: #10b981;
}

.btn-submit {
  padding: 10px 32px;
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

.btn-submit:hover:not(:disabled) {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quiz-end-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;
}

.quiz-end-card {
  background: white;
  padding: 40px 48px;
  border-radius: 24px;
  text-align: center;
  max-width: 420px;
  width: 90%;
  animation: slideUp 0.5s ease;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
}

.quiz-end-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.quiz-end-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.quiz-end-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.quiz-end-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.timer-circle-end {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-text-end {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.timer-label {
  font-size: 12px;
  color: #94a3b8;
}

.quiz-end-progress {
  width: 100%;
}

.progress-bar-end {
  width: 100%;
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-end {
  height: 100%;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  border-radius: 2px;
  transition: width 1s linear;
}

.result-overlay {
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
  overflow-y: auto;
  padding: 20px;
}

.result-card {
  background: white;
  border-radius: 20px;
  padding: 32px 32px 24px;
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.4s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-header {
  text-align: left;
  margin-bottom: 20px;
}

.result-congrats {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.result-sub {
  font-size: 14px;
  color: #64748b;
  margin: 2px 0 0 0;
}

.result-accuracy {
  text-align: center;
  margin-bottom: 20px;
}

.result-section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
}

.accuracy-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #6c5ce7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.accuracy-number {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.accuracy-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.result-performance {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
}

.performance-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.performance-icon {
  font-size: 16px;
}

.performance-label {
  font-size: 14px;
  color: #1e293b;
}

.result-review {
  margin-bottom: 20px;
}

.review-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.review-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 12px;
}

.review-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 10px;
}

.review-question {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 6px;
}

.review-options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-option {
  font-size: 13px;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-option-marker {
  font-size: 14px;
  min-width: 20px;
}

.review-correct {
  background: #ecfdf5;
  color: #065f46;
}

.review-wrong {
  background: #fef2f2;
  color: #dc2626;
}

.review-selected {
  font-weight: 500;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-result-done {
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

.btn-result-done:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .quiz-play {
    padding: 12px 14px 16px;
  }
  
  .quiz-title {
    font-size: 14px;
  }
  
  .timer-circle {
    width: 44px;
    height: 44px;
  }
  
  .timer-text {
    font-size: 14px;
  }
  
  .question-text {
    font-size: 17px;
  }
  
  .option-btn {
    padding: 12px 14px;
    font-size: 14px;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-submit {
    width: 100%;
  }
  
  .quiz-end-card {
    padding: 28px 20px;
  }
  
  .result-card {
    padding: 20px 16px;
  }
  
  .result-congrats {
    font-size: 18px;
  }
}
</style>  