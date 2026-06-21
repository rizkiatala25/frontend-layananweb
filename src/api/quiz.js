import api from './index';

export const quizApi = {
  // 🔥 PERHATIKAN: pakai /quizzes (tanpa api)
  async getQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  async getQuizDetail(id) {
    const response = await api.get(`/quizzes/${id}`);
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

  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  }
};