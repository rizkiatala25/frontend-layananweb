import api from './index';

export const quizApi = {
  // ===== TEACHER =====
  
  /**
   * 🔥 Create a new quiz
   */
  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  /**
   * 🔥 Update an existing quiz
   */
  async updateQuiz(id, quizData) {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  /**
   * 🔥 Delete a quiz
   */
  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  /**
   * 🔥 Toggle quiz visibility (publish/private)
   */
  async toggleVisibility(id) {
    const response = await api.patch(`/quizzes/${id}/visibility`);
    return response.data;
  },

  /**
   * 🔥 Publish a quiz (generate join code)
   */
  async publishQuiz(id) {
    const response = await api.post(`/quizzes/${id}/publish`);
    return response.data;
  },

  /**
   * 🔥 Get teacher's quizzes
   */
  async getTeacherQuizzes() {
    const response = await api.get('/teacher/quizzes');
    return response.data;
  },

  // ===== STUDENT =====
  
  /**
   * 🔥 Get all published quizzes
   */
  async getQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  /**
   * 🔥 Get quiz detail by ID
   */
  async getQuizDetail(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  /**
   * 🔥 Join quiz by join code
   */
  async joinQuiz(joinCode) {
    const response = await api.post(`/quizzes/join/${joinCode}`);
    return response.data;
  },

  /**
   * 🔥 Start a quiz
   */
  async startQuiz(id) {
    const response = await api.post(`/quizzes/${id}/start`);
    return response.data;
  },

  /**
   * 🔥 Submit answer for a question
   */
  async submitAnswer(quizId, answerData) {
    const response = await api.post(`/quizzes/${quizId}/submit`, answerData);
    return response.data;
  },

  /**
   * 🔥 Get quiz result
   */
  async getResult(quizId) {
    const response = await api.get(`/quizzes/${quizId}/result`);
    return response.data;
  },

  /**
   * 🔥 Get student's quizzes
   */
  async getStudentQuizzes() {
    const response = await api.get('/student/quizzes');
    return response.data;
  }
};