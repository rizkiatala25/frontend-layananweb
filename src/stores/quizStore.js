import { defineStore } from 'pinia';
import { quizApi } from '@/api/quiz';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: [],
    results: null,
    loading: false,
    error: null,
    isQuizActive: false,
    timeRemaining: 0
  }),

  getters: {
    totalQuestions: (state) => state.currentQuiz?.questions?.length || 0,
    currentQuestion: (state) => {
      if (!state.currentQuiz?.questions) return null;
      return state.currentQuiz.questions[state.currentQuestionIndex] || null;
    },
    progress: (state) => {
      if (!state.currentQuiz?.questions) return 0;
      return ((state.currentQuestionIndex + 1) / state.currentQuiz.questions.length) * 100;
    },
    isLastQuestion: (state) => {
      if (!state.currentQuiz?.questions) return false;
      return state.currentQuestionIndex === state.currentQuiz.questions.length - 1;
    }
  },

  actions: {
    async fetchQuizzes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.getQuizzes();
        this.quizzes = response.data || [];
        return { success: true, data: this.quizzes };
      } catch (error) {
        console.error('Fetch quizzes error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal mengambil daftar kuis';
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async fetchQuizDetail(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.getQuizDetail(id);
        this.currentQuiz = response.data;
        this.currentQuestionIndex = 0;
        this.answers = [];
        return { success: true, data: this.currentQuiz };
      } catch (error) {
        console.error('Fetch quiz detail error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal mengambil detail kuis';
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async startQuiz(id) {
      this.loading = true;
      
      try {
        const response = await quizApi.startQuiz(id);
        this.isQuizActive = true;
        this.timeRemaining = response.data.duration * 60;
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Start quiz error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal memulai kuis';
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async submitAnswer(quizId, questionId, answer) {
      try {
        const response = await quizApi.submitAnswer(quizId, {
          question_id: questionId,
          answer: answer
        });
        
        this.answers.push({
          question_id: questionId,
          answer: answer,
          is_correct: response.data.is_correct
        });
        
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Submit answer error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal mengirim jawaban';
        return { success: false, message };
      }
    },

    async fetchResult(quizId) {
      this.loading = true;
      
      try {
        const response = await quizApi.getResult(quizId);
        this.results = response.data;
        this.isQuizActive = false;
        return { success: true, data: this.results };
      } catch (error) {
        console.error('Fetch result error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal mengambil hasil';
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async createQuiz(quizData) {
      this.loading = true;
      
      try {
        const response = await quizApi.createQuiz(quizData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Create quiz error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal membuat kuis';
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async deleteQuiz(id) {
      this.loading = true;
      
      try {
        const response = await quizApi.deleteQuiz(id);
        this.quizzes = this.quizzes.filter(q => q.id !== id);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Delete quiz error:', error);
        const message = error.response?.data?.message || error.message || 'Gagal menghapus kuis';
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.currentQuestionIndex++;
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },

    resetQuiz() {
      this.currentQuiz = null;
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.results = null;
      this.isQuizActive = false;
      this.timeRemaining = 0;
    }
  }
});