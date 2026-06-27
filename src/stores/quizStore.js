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
    timeRemaining: 0,
    syncMode: true, // 🔥 DEFAULT TRUE - LANGSUNG KE BACKEND
    teacherQuizzes: [],
    studentQuizzes: []
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
    // ===== SET SYNC MODE =====
    setSyncMode(enabled) {
      this.syncMode = enabled;
      console.log('📌 Sync mode:', enabled ? '✅ BACKEND (Database)' : '💾 LOCALSTORAGE');
    },

    // ===== TEACHER: FETCH QUIZZES =====
    async fetchTeacherQuizzes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.getTeacherQuizzes();
        this.teacherQuizzes = response.data || [];
        return { success: true, data: this.teacherQuizzes };
      } catch (error) {
        console.error('Fetch teacher quizzes error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil daftar kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== TEACHER: CREATE QUIZ =====
    async createQuiz(quizData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Creating quiz to BACKEND...', quizData);
        
        // 🔥 FORMAT DATA UNTUK BACKEND
        const formattedData = {
          title: quizData.title,
          subject: quizData.subject,
          cover_image: quizData.cover_image || null,
          visibility: 'private', // Default private
          total_time: quizData.total_time || 10,
          description: quizData.description || '',
          questions: quizData.questions.map(q => ({
            question: q.question,
            question_image: q.question_image || null,
            options: q.options || [],
            options_images: q.options_images || [],
            correct_index: q.correct_index || 0,
            points: q.points || 1
          }))
        };
        
        const response = await quizApi.createQuiz(formattedData);
        console.log('✅ Quiz created in BACKEND:', response);
        
        if (response.success) {
          this.teacherQuizzes.unshift(response.data);
          return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Gagal membuat kuis' };
      } catch (error) {
        console.error('Create quiz error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal membuat kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== TEACHER: DELETE QUIZ =====
    async deleteQuiz(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🗑️ Deleting quiz from BACKEND:', id);
        const response = await quizApi.deleteQuiz(id);
        console.log('✅ Quiz deleted from BACKEND:', response);
        
        if (response.success) {
          this.teacherQuizzes = this.teacherQuizzes.filter(q => q.id !== id);
          this.studentQuizzes = this.studentQuizzes.filter(q => q.id !== id);
          return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Gagal menghapus kuis' };
      } catch (error) {
        console.error('Delete quiz error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal menghapus kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== TEACHER: TOGGLE VISIBILITY =====
    async toggleVisibility(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 Toggling visibility in BACKEND:', id);
        const response = await quizApi.toggleVisibility(id);
        console.log('✅ Visibility toggled in BACKEND:', response);
        
        if (response.success) {
          const index = this.teacherQuizzes.findIndex(q => q.id === id);
          if (index >= 0) {
            this.teacherQuizzes[index].visibility = response.data.visibility;
          }
          
          // 🔥 UPDATE STUDENT QUIZZES
          if (response.data.visibility === 'private') {
            this.studentQuizzes = this.studentQuizzes.filter(q => q.id !== id);
          } else {
            const quiz = this.teacherQuizzes.find(q => q.id === id);
            if (quiz) {
              const exists = this.studentQuizzes.some(q => q.id === id);
              if (!exists) {
                this.studentQuizzes.push(quiz);
              }
            }
          }
          
          return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Gagal mengubah visibility' };
      } catch (error) {
        console.error('Toggle visibility error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengubah visibility';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== TEACHER: PUBLISH QUIZ =====
    async publishQuiz(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Publishing quiz:', id);
        const response = await quizApi.publishQuiz(id);
        console.log('✅ Quiz published:', response);
        
        if (response.success) {
          // Update teacher quizzes
          const index = this.teacherQuizzes.findIndex(q => q.id === id);
          if (index >= 0) {
            this.teacherQuizzes[index].visibility = 'publish';
            this.teacherQuizzes[index].join_code = response.data.join_code;
          }
          
          // Add to student quizzes
          const quiz = this.teacherQuizzes.find(q => q.id === id);
          if (quiz) {
            const exists = this.studentQuizzes.some(q => q.id === id);
            if (!exists) {
              this.studentQuizzes.push({
                ...quiz,
                visibility: 'publish'
              });
            }
          }
          
          return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Gagal mempublish kuis' };
      } catch (error) {
        console.error('Publish quiz error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mempublish kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== STUDENT: FETCH QUIZZES =====
    async fetchStudentQuizzes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.getQuizzes();
        this.studentQuizzes = response.data || [];
        return { success: true, data: this.studentQuizzes };
      } catch (error) {
        console.error('Fetch student quizzes error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil daftar kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== STUDENT: GET QUIZ DETAIL =====
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
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil detail kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== STUDENT: JOIN QUIZ =====
    async joinQuiz(joinCode) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔗 Joining quiz with code:', joinCode);
        const response = await quizApi.joinQuiz(joinCode);
        console.log('✅ Joined quiz:', response);
        
        if (response.success) {
          const exists = this.studentQuizzes.some(q => q.id === response.data.id);
          if (!exists) {
            this.studentQuizzes.push(response.data);
          }
          return { success: true, data: response.data };
        }
        return { success: false, message: response.message || 'Kode join tidak valid' };
      } catch (error) {
        console.error('Join quiz error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal join kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== STUDENT: START QUIZ =====
    async startQuiz(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.startQuiz(id);
        this.isQuizActive = true;
        this.timeRemaining = response.data.duration * 60;
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Start quiz error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal memulai kuis';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== STUDENT: SUBMIT ANSWER =====
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
        return { 
          success: false, 
          message: error.response?.data?.message || error.message || 'Gagal mengirim jawaban' 
        };
      }
    },

    // ===== STUDENT: GET RESULT =====
    async fetchResult(quizId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await quizApi.getResult(quizId);
        this.results = response.data;
        this.isQuizActive = false;
        return { success: true, data: this.results };
      } catch (error) {
        console.error('Fetch result error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil hasil';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ===== NAVIGATION =====
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
    },

    clearError() {
      this.error = null;
    }
  }
});