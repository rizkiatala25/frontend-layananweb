import api from './index';

export const quizApi = {
  // ===== TEACHER =====
  
  async createQuiz(quizData) {
    const response = await api.post('/api/quizzes', quizData);
    return response.data;
  },

  async updateQuiz(id, quizData) {
    const response = await api.put(`/api/quizzes/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/api/quizzes/${id}`);
    return response.data;
  },

  async toggleVisibility(id) {
    const response = await api.patch(`/api/quizzes/${id}/visibility`);
    return response.data;
  },

  async publishQuiz(id) {
    const response = await api.post(`/api/quizzes/${id}/publish`);
    return response.data;
  },

  async getTeacherQuizzes() {
    const response = await api.get('/api/teacher/quizzes');
    return response.data;
  },

  async getQuizResults(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/results`);
    return response.data;
  },

  // ===== STUDENT =====
  
  async getQuizzes() {
    const response = await api.get('/api/quizzes');
    return response.data;
  },

  async getQuizDetail(id) {
    const response = await api.get(`/api/quizzes/${id}`);
    return response.data;
  },

  async joinQuiz(joinCode) {
    const response = await api.post(`/api/quizzes/join/${joinCode}`);
    return response.data;
  },

  async startQuiz(id) {
    const response = await api.post(`/api/quizzes/${id}/start`);
    return response.data;
  },

  async submitAnswer(quizId, answerData) {
    const response = await api.post(`/api/quizzes/${quizId}/submit`, answerData);
    return response.data;
  },

  async getResult(quizId) {
    const response = await api.get(`/api/quizzes/${quizId}/result`);
    return response.data;
  },

  async getStudentQuizzes() {
    const response = await api.get('/api/student/quizzes');
    return response.data;
  }
};