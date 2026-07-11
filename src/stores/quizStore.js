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
    syncMode: true,
    teacherQuizzes: [],
    studentQuizzes: [],
    quizResults: []
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
        
        const formattedData = {
          title: quizData.title,
          subject: quizData.subject,
          cover_image: quizData.cover_image || null,
          visibility: quizData.visibility || 'private',
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
          const quiz = response.data;
          this.teacherQuizzes.unshift(quiz);
          
          if (quiz.visibility === 'publish') {
            this.studentQuizzes.push({
              id: quiz.id,
              title: quiz.title,
              subject: quiz.subject,
              total_questions: quiz.questions?.length || 0,
              emoji: quiz.emoji || '📝',
              cover_image: quiz.cover_image || null,
              description: quiz.description || '',
              duration: quiz.total_time || 10,
              join_code: quiz.join_code,
              visibility: quiz.visibility,
              questions: quiz.questions || []
            });
          }
          
          return { success: true, data: quiz };
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
          this.quizResults = this.quizResults.filter(r => r.quiz_id !== id);
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
          const visibility = response.data.visibility;
          const joinCode = response.data.join_code;
          
          const index = this.teacherQuizzes.findIndex(q => q.id === id);
          if (index >= 0) {
            this.teacherQuizzes[index].visibility = visibility;
            this.teacherQuizzes[index].join_code = joinCode;
          }
          
          if (visibility === 'private') {
            this.studentQuizzes = this.studentQuizzes.filter(q => q.id !== id);
            console.log('🔒 Quiz removed from student quizzes');
          } else {
            const quiz = this.teacherQuizzes.find(q => q.id === id);
            if (quiz) {
              const exists = this.studentQuizzes.some(q => q.id === id);
              if (!exists) {
                this.studentQuizzes.push({
                  id: quiz.id,
                  title: quiz.title,
                  subject: quiz.subject,
                  total_questions: quiz.questions?.length || 0,
                  emoji: quiz.emoji || '📝',
                  cover_image: quiz.cover_image || null,
                  description: quiz.description || '',
                  duration: quiz.total_time || 10,
                  join_code: joinCode,
                  visibility: 'publish',
                  questions: quiz.questions || []
                });
                console.log('✅ Quiz added to student quizzes with join code:', joinCode);
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
          const index = this.teacherQuizzes.findIndex(q => q.id === id);
          if (index >= 0) {
            this.teacherQuizzes[index].visibility = 'publish';
            this.teacherQuizzes[index].join_code = response.data.join_code;
          }
          
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

    // ===== TEACHER: FETCH QUIZ RESULTS =====
    async fetchQuizResults(quizId) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📊 Fetching results for quiz:', quizId);
        const response = await quizApi.getQuizResults(quizId);
        console.log('✅ Results fetched:', response);
        
        if (response.success) {
          const sortedData = response.data.sort((a, b) => b.score - a.score);
          this.quizResults = sortedData;
          return { success: true, data: sortedData };
        }
        return { success: false, message: response.message || 'Gagal mengambil nilai' };
      } catch (error) {
        console.error('Fetch results error:', error);
        this.error = error.response?.data?.message || error.message || 'Gagal mengambil nilai';
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
        console.log('📥 Quiz detail response:', response);
        
        if (response.success) {
          const data = response.data;
          
          if (data.questions) {
            data.questions = data.questions.map(q => ({
              id: q.id || Date.now(),
              question: q.question || 'No question',
              options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              question_image: q.question_image || null,
              options_images: Array.isArray(q.options_images) ? q.options_images : [],
              correct_index: q.correct_index !== undefined ? q.correct_index : 0,
              points: q.points || 1
            }));
          }
          
          this.currentQuiz = data;
          this.currentQuestionIndex = 0;
          this.answers = [];
          return { success: true, data: this.currentQuiz };
        }
        return { success: false, message: response.message || 'Gagal mengambil detail kuis' };
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

    // ===== STUDENT: SUBMIT SINGLE ANSWER =====
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

    // ===== STUDENT: SUBMIT QUIZ (SEMUA JAWABAN) - UPDATED =====
    async submitQuiz(quizId, answers) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('📤 Submitting quiz in store:', quizId);
        console.log('📤 Answers count:', answers?.length || 0);
        
        // 🔥 VALIDASI QUIZ ID - LEBIH FLEKSIBEL
        if (!quizId) {
          console.warn('⚠️ Quiz ID is undefined or null, using fallback');
          return { 
            success: false, 
            message: 'Quiz ID tidak valid',
            fallback: true 
          };
        }
        
        if (!answers || answers.length === 0) {
          return { 
            success: false, 
            message: 'Tidak ada jawaban yang dikirim',
            fallback: true 
          };
        }
        
        // 🔥 KONVERSI QUIZ ID KE NUMBER
        const numericId = Number(quizId);
        
        // 🔥 CEK APAKAH ID VALID (bukan default quiz)
        if (isNaN(numericId) || numericId <= 0 || quizId === 'default' || quizId < 1000) {
          console.warn('⚠️ Quiz ID is default or invalid, skipping backend submit');
          return { 
            success: false, 
            message: 'Quiz tidak ditemukan di database (default quiz)',
            fallback: true,
            isDefault: true
          };
        }
        
        // 🔥 KIRIM KE BACKEND HANYA JIKA ID VALID
        const response = await quizApi.submitAnswer(numericId, { answers });
        console.log('✅ Submit response:', response);
        
        if (response.success) {
          this.results = response.data;
          this.isQuizActive = false;
          return { success: true, data: response.data };
        }
        
        return { 
          success: false, 
          message: response.message || 'Gagal submit quiz',
          fallback: true 
        };
        
      } catch (error) {
        console.error('❌ Submit quiz error:', error);
        console.error('❌ Error details:', error.response?.data);
        
        let message = 'Gagal submit quiz';
        if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.message) {
          message = error.message;
        }
        
        this.error = message;
        
        // 🔥 KEMBALIKAN FALLBACK TRUE AGAR FRONTEND TAHU UNTUK SIMPAN KE LOCALSTORAGE
        return { 
          success: false, 
          message,
          fallback: true 
        };
      } finally {
        this.loading = false;
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

    // ===== STUDENT: CLEAR ALL ACTIVITY =====
    clearAllActivity() {
      this.results = null;
      localStorage.removeItem('quiz_results');
      console.log('🗑️ All activity cleared');
    },

    // ===== STUDENT: DELETE SINGLE ACTIVITY =====
    deleteActivity(quizId) {
      const results = JSON.parse(localStorage.getItem('quiz_results') || '{}');
      delete results[quizId];
      localStorage.setItem('quiz_results', JSON.stringify(results));
      console.log('🗑️ Activity deleted for quiz:', quizId);
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