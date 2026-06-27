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
          <div class="timer-circle">
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
        
        <h2 class="question-text">{{ currentQuestion?.question || 'Loading...' }}</h2>
        
        <!-- Options -->
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
            :disabled="showResult"
            @click="selectOption(index)"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <!-- Gambar Option -->
            <div v-if="currentQuestion?.options_images && currentQuestion.options_images[index]" class="option-image-wrapper">
              <img :src="currentQuestion.options_images[index]" alt="Option image" class="option-image" />
            </div>
            <span class="option-text">{{ option }}</span>
            <span v-if="answersMap[currentIndex] !== undefined && answersMap[currentIndex] === index" class="option-check">✓</span>
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button 
            class="btn-nav prev" 
            @click="previousQuestion"
            :disabled="currentIndex === 0"
          >
            ← Previous
          </button>
          <button 
            class="btn-nav next" 
            @click="nextQuestion"
            :disabled="currentIndex === questions.length - 1"
          >
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
            {{ answeredCount }} / {{ questions.length }} answered
          </span>
          <span v-if="answeredCount < questions.length" class="warning-text">
            ⚠️ Answer all questions to submit
          </span>
          <span v-else class="success-text">
            ✅ All questions answered!
          </span>
        </div>
        <button 
          class="btn-submit" 
          :disabled="answeredCount < questions.length || submitting"
          @click="submitAllAnswers"
        >
          {{ submitting ? '⏳ Submitting...' : '📤 Submit Quiz' }}
        </button>
      </div>
    </footer>

    <!-- RESULT MODAL -->
    <div v-if="showResultModal" class="result-modal-overlay" @click.self="closeResult">
      <div class="result-modal">
        <div class="result-icon">{{ scorePercentage >= 70 ? '🎉' : '💪' }}</div>
        <h2 class="result-title">{{ scorePercentage >= 70 ? 'Great Job!' : 'Keep Practicing!' }}</h2>
        <div class="result-score">
          <span class="score-number">{{ correctCount }}</span>
          <span class="score-total">/ {{ questions.length }}</span>
        </div>
        <p class="result-percentage">{{ scorePercentage }}%</p>
        <div class="result-details">
          <span>✅ Correct: {{ correctCount }}</span>
          <span>❌ Wrong: {{ questions.length - correctCount }}</span>
        </div>
        <button class="btn-result-close" @click="closeResult">View Results</button>
      </div>
    </div>

  </div>
</template>

<script>
import { useQuizStore } from '@/stores/quizStore.js';
import { useAuthStore } from '@/stores/authStore.js';

export default {
  name: 'QuizPlayView',
  props: {
    quizId: {
      type: [Number, String],
      required: true
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
      answersMap: {}, // { questionIndex: selectedOptionIndex }
      timeRemaining: 600,
      timerInterval: null,
      showResultModal: false,
      correctCount: 0,
      scorePercentage: 0,
      submitting: false,
      quizStore: null,
      authStore: null
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
    }
  },
  mounted() {
    this.quizStore = useQuizStore();
    this.authStore = useAuthStore();
    
    const duration = parseInt(localStorage.getItem('current_quiz_duration')) || 10;
    this.timeRemaining = duration * 60;
    this.loadQuiz();
    this.startTimer();
  },
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    async loadQuiz() {
      try {
        const quizId = this.quizId;
        console.log('📌 Loading quiz ID:', quizId);
        
        // Cek localStorage dulu
        const savedQuestions = localStorage.getItem('current_quiz_questions');
        const savedTitle = localStorage.getItem('current_quiz_title') || 'Quiz';
        const savedDuration = parseInt(localStorage.getItem('current_quiz_duration')) || 10;
        
        if (savedQuestions) {
          try {
            const questions = JSON.parse(savedQuestions);
            if (questions && questions.length > 0) {
              console.log('📚 Loaded questions from localStorage:', questions.length);
              this.quizTitle = savedTitle;
              this.questions = questions.map(q => ({
                id: q.id || Date.now(),
                question: q.question || 'No question',
                options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
                question_image: q.question_image || null,
                options_images: q.options_images || [],
                correct_index: q.correct_index !== undefined ? q.correct_index : 0,
                points: q.points || 1
              }));
              this.timeRemaining = savedDuration * 60;
              this.answersMap = {};
              return;
            }
          } catch (e) {
            console.error('Error parsing saved questions:', e);
          }
        }
        
        // Coba dari store
        const result = await this.quizStore.fetchQuizDetail(quizId);
        
        if (result.success && result.data) {
          const data = result.data;
          this.quizTitle = data.title || 'Quiz';
          this.timeRemaining = (data.total_time || data.duration || 10) * 60;
          
          if (data.questions && data.questions.length > 0) {
            this.questions = data.questions.map(q => ({
              id: q.id || Date.now(),
              question: q.question || 'No question',
              options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              question_image: q.question_image || null,
              options_images: q.options_images || [],
              correct_index: q.correct_index !== undefined ? q.correct_index : 0,
              points: q.points || 1
            }));
            this.answersMap = {};
            return;
          }
        }
        
        // Fallback mock data
        this.loadMockData();
        
      } catch (error) {
        console.error('Error loading quiz:', error);
        this.loadMockData();
      }
    },

    loadMockData() {
      this.quizTitle = localStorage.getItem('current_quiz_title') || 'Quiz';
      const savedDuration = parseInt(localStorage.getItem('current_quiz_duration')) || 10;
      this.timeRemaining = savedDuration * 60;
      
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
          question: 'Siapa presiden pertama Indonesia?',
          options: ['Soekarno', 'Soeharto', 'Habibie', 'Gus Dur'],
          question_image: null,
          options_images: [],
          correct_index: 0,
          points: 1
        },
        {
          id: 3,
          question: 'Apa ibukota Indonesia?',
          options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
          question_image: null,
          options_images: [],
          correct_index: 0,
          points: 1
        }
      ];
      this.answersMap = {};
      console.log('📚 Loaded mock questions:', this.questions.length);
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.stopTimer();
          alert('⏰ Time is up! Submitting your answers...');
          this.submitAllAnswers();
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    selectOption(index) {
      if (!this.showResult) {
        this.selectedAnswer = index;
        // Simpan jawaban di map
        this.answersMap[this.currentIndex] = index;
        console.log('📌 Answer saved:', this.currentIndex, index);
        console.log('📌 All answers:', this.answersMap);
      }
    },

    // Navigasi antar soal
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedAnswer = this.answersMap[this.currentIndex] !== undefined ? 
          this.answersMap[this.currentIndex] : null;
        this.showResult = false;
      }
    },

    previousQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.selectedAnswer = this.answersMap[this.currentIndex] !== undefined ? 
          this.answersMap[this.currentIndex] : null;
        this.showResult = false;
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

    // Submit semua jawaban
    async submitAllAnswers() {
      // Cek apakah semua soal sudah dijawab
      if (this.answeredCount < this.questions.length) {
        alert(`⚠️ Anda belum menjawab semua soal! (${this.answeredCount}/${this.questions.length})`);
        return;
      }

      this.submitting = true;

      try {
        console.log('📌 Submitting all answers:', this.answersMap);

        // Hitung hasil
        let correct = 0;
        const answerDetails = [];

        for (let i = 0; i < this.questions.length; i++) {
          const question = this.questions[i];
          const selected = this.answersMap[i];
          const isCorrect = selected === question.correct_index;
          
          if (isCorrect) correct++;
          
          answerDetails.push({
            question_id: question.id,
            selected: selected,
            correct: question.correct_index,
            is_correct: isCorrect
          });
        }

        const totalQuestions = this.questions.length;
        const score = Math.round((correct / totalQuestions) * 100);

        this.correctCount = correct;
        this.scorePercentage = score;

        // Simpan hasil ke localStorage
        const studentName = this.authStore.user?.full_name || 
                           localStorage.getItem('user_name') || 
                           'Student';

        const quizResults = JSON.parse(localStorage.getItem('quiz_results') || '{}');
        const quizId = this.quizId;

        if (!quizResults[quizId]) {
          quizResults[quizId] = [];
        }

        // Format answers untuk ditampilkan
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
            user_answer: options[selectedIndex] || 'Not Answered'
          };
        });

        quizResults[quizId].push({
          studentName: studentName,
          score: score,
          correct: correct,
          total: totalQuestions,
          date: new Date().toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          answers: formattedAnswers
        });

        localStorage.setItem('quiz_results', JSON.stringify(quizResults));

        // Simpan result untuk ditampilkan
        const quizResult = {
          title: this.quizTitle,
          totalQuestions: totalQuestions,
          score: score,
          emoji: '📝'
        };
        localStorage.setItem('quiz_result', JSON.stringify(quizResult));

        this.stopTimer();
        this.showResultModal = true;

      } catch (error) {
        console.error('Submit error:', error);
        alert('❌ Gagal submit quiz. Silakan coba lagi.');
      } finally {
        this.submitting = false;
      }
    },

    closeResult() {
      this.showResultModal = false;
      
      // Kirim hasil ke parent
      const totalQuestions = this.questions.length;
      const score = this.scorePercentage;
      
      // Buat object answers untuk parent
      const answerList = [];
      for (let i = 0; i < this.questions.length; i++) {
        const question = this.questions[i];
        answerList.push({
          selected: this.answersMap[i],
          correct: question.correct_index,
          is_correct: this.answersMap[i] === question.correct_index
        });
      }
      
      this.$emit('finish', {
        correct: this.correctCount,
        total: totalQuestions,
        score: score,
        answers: answerList
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
  display: flex;
  align-items: center;
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

.timer-container {
  display: flex;
  align-items: center;
}

.timer-circle {
  width: 52px;
  height: 52px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.progress-text {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

.question-number {
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
  vertical-align: middle;
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
  transform: none;
}

.result-modal-overlay {
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
}

.result-modal {
  background: white;
  padding: 32px 28px 28px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
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

.result-icon {
  font-size: 52px;
  margin-bottom: 8px;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
}

.result-score {
  font-size: 40px;
  font-weight: 700;
  color: #1e293b;
}

.score-number {
  color: #6c5ce7;
}

.score-total {
  font-size: 22px;
  color: #94a3b8;
}

.result-percentage {
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  margin: 4px 0 12px 0;
}

.result-details {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 18px;
}

.btn-result-close {
  padding: 10px 44px;
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

.btn-result-close:hover {
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
}
</style>