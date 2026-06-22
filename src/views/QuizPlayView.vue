<template>
  <div class="quiz-play">
    
    <header class="quiz-header">
      <div class="timer-container">
        <div class="timer-circle">
          <span class="timer-text">{{ formattedTime }}</span>
        </div>
      </div>
      <div class="progress-text">
        <span class="question-number">{{ currentIndex + 1 }}/{{ questions.length }}</span>
      </div>
    </header>

    <main class="quiz-body">
      <div class="question-container">
        <!-- 🔥 GAMBAR SOAL -->
        <div v-if="currentQuestion?.question_image" class="question-image-wrapper">
          <img :src="currentQuestion.question_image" alt="Question image" class="question-image" />
        </div>
        
        <h2 class="question-text">{{ currentQuestion?.question || 'Loading...' }}</h2>
        
        <div class="options-grid">
          <button 
            v-for="(option, index) in currentQuestion?.options || []" 
            :key="index"
            class="option-btn"
            :class="{
              selected: selectedAnswer === index,
              correct: showResult && index === correctAnswerIndex,
              wrong: showResult && selectedAnswer === index && index !== correctAnswerIndex
            }"
            :disabled="showResult"
            @click="selectOption(index)"
          >
            <!-- 🔥 GAMBAR OPTION -->
            <div v-if="currentQuestion?.options_images && currentQuestion.options_images[index]" class="option-image-wrapper">
              <img :src="currentQuestion.options_images[index]" alt="Option image" class="option-image" />
            </div>
            <span class="option-text">{{ option }}</span>
          </button>
        </div>
      </div>
    </main>

    <footer class="quiz-footer">
      <div class="footer-actions">
        <button 
          v-if="!showResult"
          class="btn-submit" 
          :disabled="selectedAnswer === null"
          @click="submitAnswer"
        >
          Submit Answer
        </button>
        <button 
          v-else
          class="btn-next" 
          @click="nextQuestion"
        >
          {{ isLastQuestion ? 'See Results' : 'Next Question →' }}
        </button>
      </div>
    </footer>

    <div v-if="showResultModal" class="result-modal-overlay" @click.self="closeResult">
      <div class="result-modal">
        <div class="result-icon">{{ scorePercentage >= 70 ? '🎉' : '💪' }}</div>
        <h2 class="result-title">{{ scorePercentage >= 70 ? 'Great Job!' : 'Keep Practicing!' }}</h2>
        <div class="result-score">
          <span class="score-number">{{ correctCount }}</span>
          <span class="score-total">/ {{ questions.length }}</span>
        </div>
        <p class="result-percentage">{{ scorePercentage }}%</p>
        <button class="btn-result-close" @click="closeResult">Close</button>
      </div>
    </div>

  </div>
</template>

<script>
import { useQuizStore } from '@/stores/quizStore.js';

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
      answers: [],
      timeRemaining: 600,
      timerInterval: null,
      showResultModal: false,
      correctCount: 0,
      scorePercentage: 0
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
    }
  },
  mounted() {
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
        const quizStore = useQuizStore();
        const result = await quizStore.fetchQuizDetail(this.quizId);
        
        if (result.success && result.data.questions && result.data.questions.length > 0) {
          const data = result.data;
          this.quizTitle = data.title || 'Quiz';
          this.questions = data.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            question_image: q.question_image || null,
            options_images: q.options_images || [],
            correct_index: q.correct_index !== undefined ? q.correct_index : 0
          }));
          this.timeRemaining = (data.total_time || data.duration || 10) * 60;
        } else {
          this.loadMockData();
        }
      } catch (error) {
        console.error('Error loading quiz, using mock data:', error);
        this.loadMockData();
      }
    },

    loadMockData() {
      const savedTitle = localStorage.getItem('current_quiz_title') || 'Quiz';
      const savedQuestions = localStorage.getItem('current_quiz_questions');
      const savedDuration = parseInt(localStorage.getItem('current_quiz_duration')) || 10;
      
      this.quizTitle = savedTitle;
      this.timeRemaining = savedDuration * 60;
      
      if (savedQuestions) {
        try {
          const questions = JSON.parse(savedQuestions);
          if (questions && questions.length > 0) {
            this.questions = questions.map(q => ({
              ...q,
              question_image: q.question_image || null,
              options_images: q.options_images || []
            }));
            console.log('📚 Loaded questions with images:', this.questions);
            return;
          }
        } catch (e) {
          console.error('Error parsing questions:', e);
        }
      }
      
      this.questions = [
        {
          id: 1,
          question: 'Tanggal berapa indonesia merdeka',
          options: ['17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947', '17 Agustus 1944'],
          question_image: null,
          options_images: [],
          correct_index: 0
        },
        {
          id: 2,
          question: 'Siapa presiden pertama Indonesia?',
          options: ['Soekarno', 'Soeharto', 'Habibie', 'Gus Dur'],
          question_image: null,
          options_images: [],
          correct_index: 0
        }
      ];
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.stopTimer();
          this.finishQuiz();
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
      }
    },

    submitAnswer() {
      if (this.selectedAnswer === null) {
        alert('Silakan pilih jawaban terlebih dahulu!');
        return;
      }
      
      const currentQ = this.currentQuestion;
      const isCorrect = this.selectedAnswer === currentQ.correct_index;
      
      this.correctAnswerIndex = currentQ.correct_index;
      this.showResult = true;
      
      this.answers.push({
        question_id: currentQ.id,
        selected: this.selectedAnswer,
        correct: currentQ.correct_index,
        is_correct: isCorrect
      });
      
      if (isCorrect) {
        this.correctCount++;
      }
    },

    nextQuestion() {
      this.showResult = false;
      this.selectedAnswer = null;
      this.correctAnswerIndex = null;
      
      if (this.isLastQuestion) {
        this.finishQuiz();
      } else {
        this.currentIndex++;
      }
    },

    finishQuiz() {
      this.stopTimer();
      this.scorePercentage = Math.round((this.correctCount / this.questions.length) * 100);
      this.showResultModal = true;
    },

    closeResult() {
      this.showResultModal = false;
      this.$emit('finish', {
        correct: this.correctCount,
        total: this.questions.length,
        score: this.scorePercentage,
        answers: this.answers
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

.timer-container {
  display: flex;
  align-items: center;
}

.timer-circle {
  position: relative;
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

.quiz-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.question-container {
  max-width: 680px;
  width: 100%;
}

/* 🔥 GAMBAR SOAL */
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
  text-align: left;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* 🔥 GAMBAR OPTION */
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
  font-size: 15px;
  font-weight: 400;
  color: #1e293b;
}

.option-btn.selected .option-text {
  color: #6c5ce7;
  font-weight: 500;
}

.option-btn.correct .option-text {
  color: #10b981;
  font-weight: 500;
}

.option-btn.wrong .option-text {
  color: #ef4444;
  font-weight: 500;
}

.quiz-footer {
  padding: 12px 0 0 0;
  border-top: 1px solid #f1f5f9;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  padding: 10px 28px;
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
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-next {
  padding: 10px 28px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-next:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
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
  max-width: 360px;
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
  margin: 4px 0 18px 0;
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
</style>