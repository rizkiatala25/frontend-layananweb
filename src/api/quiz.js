import api from './index';

export const quizApi = {
  // ===== TEACHER =====
  
  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  async updateQuiz(id, quizData) {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  async toggleVisibility(id) {
    const response = await api.patch(`/quizzes/${id}/visibility`);
    return response.data;
  },

  // 🔥 TAMBAHKAN INI
  async publishQuiz(id) {
    const response = await api.post(`/quizzes/${id}/publish`);
    return response.data;
  },

  async getTeacherQuizzes() {
    const response = await api.get('/teacher/quizzes');
    return response.data;
  },

  // ===== STUDENT =====
  
  async getQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  async getQuizDetail(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  async joinQuiz(joinCode) {
    const response = await api.post(`/quizzes/join/${joinCode}`);
    return response.data;
  },

  async startQuiz(id) {
    const response = await api.post(`/quizzes/${id}/start`);
    return response.data;
  },

  async submitAnswer(quizId, answerData) {
    const response = await api.post(`/quizzes/${quizId}/submit`, answerData);
    return response.data;
  },

  async getResult(quizId) {
    const response = await api.get(`/quizzes/${quizId}/result`);
    return response.data;
  },

  async getStudentQuizzes() {
    const response = await api.get('/student/quizzes');
    return response.data;
  }
};