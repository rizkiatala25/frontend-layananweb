<template>
  <div class="quiz-preview">
    
    <header class="preview-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 class="header-title">{{ quizTitle || 'Untitled Quiz' }}</h1>
      </div>
      <div class="header-right">
        <button class="btn-publish" @click="openPublishModal">Publish</button>
      </div>
    </header>

    <section class="quiz-info">
      <div class="info-stats">
        <span class="stat-item">{{ questions.length }} Question</span>
        <span class="stat-item">• {{ totalPoints }} point</span>
        <span class="stat-item">• {{ totalDuration }} min</span>
      </div>
    </section>

    <section class="questions-list">
      <div 
        v-for="(question, index) in questions" 
        :key="index"
        class="question-card"
      >
        <div class="question-header">
          <span class="question-number">{{ index + 1 }}.</span>
          <span class="question-type">Multiple Choice</span>
          <span class="question-meta">• {{ question.points || 1 }} pt</span>
        </div>
        <h3 class="question-text">{{ question.question || 'No question text' }}</h3>
        <div class="options-list">
          <div 
            v-for="(option, optIndex) in question.options" 
            :key="optIndex"
            class="option-item"
          >
            <span class="option-marker">□</span>
            <span class="option-text">{{ option || 'Empty option' }}</span>
          </div>
        </div>
        <div class="question-actions">
          <button class="btn-delete" @click="deleteQuestion(index)">Hapus</button>
          <button class="btn-edit" @click="editQuestion(index)">Edit</button>
        </div>
      </div>

      <div v-if="questions.length === 0" class="empty-questions">
        <p>Belum ada pertanyaan. Klik "Add question" untuk menambahkan.</p>
      </div>

      <button class="btn-add-question" @click="addQuestion">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        Add question
      </button>
    </section>

    <div v-if="showPublishModal" class="modal-overlay" @click.self="showPublishModal = false">
      <div class="modal-card">
        <h2 class="modal-title">Publish Quiz</h2>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Quiz Title</label>
            <input 
              type="text" 
              v-model="quizTitle" 
              placeholder="Enter quiz title"
              class="form-input"
              @input="updateTitle"
            />
          </div>

          <div class="form-group">
            <label>Subject</label>
            <select v-model="selectedSubject" class="form-select">
              <option value="">Select subject</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="IPA">IPA</option>
              <option value="IPS">IPS</option>
              <option value="Sejarah">Sejarah</option>
              <option value="PKN">PKN</option>
              <option value="Seni Budaya">Seni Budaya</option>
              <option value="Agama">Agama</option>
              <option value="Penjaskes">Penjaskes</option>
            </select>
          </div>

          <div class="form-group">
            <label>Duration (minutes)</label>
            <input 
              type="number" 
              v-model="totalDuration" 
              placeholder="Enter total duration in minutes"
              class="form-input"
              min="1"
              max="120"
            />
            <small style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Total time for students to complete this quiz</small>
          </div>

          <div class="form-group">
            <label>Cover Image</label>
            <div class="cover-upload" @click="triggerFileInput">
              <div v-if="coverImage" class="cover-preview">
                <img :src="coverImage" alt="Cover" />
                <button class="btn-remove-cover" @click.stop="removeCover">✕</button>
              </div>
              <div v-else class="cover-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Click to upload cover image</span>
                <span class="cover-hint">Supported: JPG, PNG, GIF (Max 2MB)</span>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                accept="image/*" 
                @change="handleCoverUpload"
                style="display: none"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Visibility</label>
            <div class="visibility-options">
              <button 
                class="visibility-btn" 
                :class="{ active: visibility === 'publish' }"
                @click="visibility = 'publish'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Publish
                <span class="visibility-desc">Visible to all students</span>
              </button>
              <button 
                class="visibility-btn" 
                :class="{ active: visibility === 'private' }"
                @click="visibility = 'private'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Private
                <span class="visibility-desc">Only in your library</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showPublishModal = false">Cancel</button>
          <button class="btn-publish-confirm" @click="publishQuiz">Publish</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'QuizPreviewView',
  emits: ['back', 'quiz-published'],
  data() {
    return {
      quizTitle: 'Untitled Quiz',
      questions: [],
      totalPoints: 0,
      totalDuration: 10,
      showPublishModal: false,
      selectedSubject: '',
      coverImage: null,
      visibility: 'publish',
      fileInput: null
    };
  },
  mounted() {
    this.loadQuizData();
  },
  methods: {
    loadQuizData() {
      const savedQuiz = localStorage.getItem('saved_quiz');
      console.log('📚 Loading saved_quiz:', savedQuiz);
      
      if (savedQuiz) {
        try {
          const data = JSON.parse(savedQuiz);
          console.log('📚 Parsed data:', data);
          
          if (Array.isArray(data) && data.length > 0) {
            const firstQuestion = data[0];
            if (firstQuestion && firstQuestion.question) {
              this.quizTitle = firstQuestion.question.substring(0, 30) + (firstQuestion.question.length > 30 ? '...' : '');
            }
            
            this.questions = data.map(q => ({
              ...q,
              question: q.question || 'No question text',
              options: q.options && Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              question_image: q.question_image || null,
              options_images: q.options_images || [],
              points: q.points || 1
            }));
            this.calculateStats();
          } else {
            this.questions = [];
            this.totalPoints = 0;
            this.quizTitle = 'Untitled Quiz';
          }
        } catch (e) {
          console.error('Error loading quiz:', e);
          this.questions = [];
          this.totalPoints = 0;
          this.quizTitle = 'Untitled Quiz';
        }
      } else {
        this.questions = [];
        this.totalPoints = 0;
        this.quizTitle = 'Untitled Quiz';
      }
    },
    calculateStats() {
      this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    },
    updateTitle() {
      console.log('📝 Title updated:', this.quizTitle);
    },
    deleteQuestion(index) {
      if (confirm('Hapus pertanyaan ini?')) {
        this.questions.splice(index, 1);
        this.calculateStats();
        localStorage.setItem('saved_quiz', JSON.stringify(this.questions));
        if (this.questions.length === 0) {
          this.quizTitle = 'Untitled Quiz';
        }
      }
    },
    editQuestion(index) {
      localStorage.setItem('edit_question_index', index);
      this.$emit('back');
    },
    addQuestion() {
      this.$emit('back');
    },
    openPublishModal() {
      if (this.questions.length === 0) {
        alert('Tidak ada pertanyaan untuk dipublish. Tambahkan pertanyaan terlebih dahulu!');
        return;
      }
      this.showPublishModal = true;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleCoverUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran gambar terlalu besar! Maksimal 2MB.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.coverImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeCover() {
      this.coverImage = null;
      this.$refs.fileInput.value = '';
    },
    publishQuiz() {
      if (!this.quizTitle.trim()) {
        alert('Please enter a quiz title');
        return;
      }
      if (!this.selectedSubject) {
        alert('Please select a subject');
        return;
      }
      if (!this.totalDuration || this.totalDuration < 1) {
        alert('Please enter a valid duration (minimum 1 minute)');
        return;
      }
      
      const joinCode = this.generateJoinCode();
      
      // 🔥 PASTIKAN GAMBAR TERBAWA
      const quizData = {
        id: Date.now(),
        title: this.quizTitle,
        subject: this.selectedSubject,
        cover_image: this.coverImage,
        visibility: this.visibility,
        questions: this.questions.map(q => ({
          id: q.id,
          question: q.question,
          question_image: q.question_image || null,
          options: q.options || [],
          options_images: q.options_images || [],
          correct_index: q.correct_index || 0,
          points: q.points || 1
        })),
        total_points: this.totalPoints,
        total_time: this.totalDuration,
        created_at: new Date().toISOString(),
        join_code: joinCode
      };
      
      console.log('📤 Publishing quiz with images:', quizData);
      
      // Simpan ke published quizzes
      let publishedQuizzes = JSON.parse(localStorage.getItem('published_quizzes') || '[]');
      publishedQuizzes.push(quizData);
      localStorage.setItem('published_quizzes', JSON.stringify(publishedQuizzes));
      console.log('✅ Saved to published_quizzes:', publishedQuizzes.length);
      
      // Simpan ke shared quizzes
      if (this.visibility === 'publish') {
        let sharedQuizzes = JSON.parse(localStorage.getItem('shared_quizzes') || '[]');
        
        const sharedQuiz = {
          id: quizData.id,
          title: quizData.title,
          total_questions: quizData.questions.length,
          emoji: this.getEmojiForSubject(quizData.subject),
          description: `Quiz ${quizData.subject}`,
          duration: quizData.total_time || 10,
          join_code: joinCode,
          cover_image: this.coverImage,
          questions: quizData.questions // 🔥 KIRIM QUESTIONS LENGKAP
        };
        
        sharedQuizzes.push(sharedQuiz);
        localStorage.setItem('shared_quizzes', JSON.stringify(sharedQuizzes));
        console.log('✅ Saved to shared_quizzes with questions:', sharedQuizzes.length);
        console.log('📋 Join code:', joinCode);
      }
      
      this.showPublishModal = false;
      alert(`✅ Quiz "${this.quizTitle}" berhasil dipublikasikan!\n📋 Join Code: ${joinCode}\n⏱️ Duration: ${this.totalDuration} minutes`);
      this.$emit('quiz-published', quizData);
    },
    generateJoinCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    getEmojiForSubject(subject) {
      const emojis = {
        'Matematika': '📐',
        'Bahasa Indonesia': '🇮🇩',
        'Bahasa Inggris': '🇬🇧',
        'IPA': '🔬',
        'IPS': '🌍',
        'Sejarah': '📜',
        'PKN': '🦅',
        'Seni Budaya': '🎭',
        'Agama': '📖',
        'Penjaskes': '⚽'
      };
      return emojis[subject] || '📝';
    },
    goBack() {
      this.$emit('back');
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

.quiz-preview {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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
  gap: 4px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

.btn-back:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-publish {
  padding: 8px 24px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-publish:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
}

.quiz-info {
  padding: 16px 0;
}

.info-stats {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #64748b;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.questions-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0 20px;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.question-number {
  font-weight: 600;
  color: #94a3b8;
}

.question-type {
  font-size: 13px;
  color: #64748b;
}

.question-meta {
  font-size: 13px;
  color: #94a3b8;
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.option-marker {
  color: #94a3b8;
}

.option-text {
  font-size: 14px;
  color: #334155;
}

.question-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.btn-delete {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  transition: color 0.2s;
}

.btn-delete:hover {
  color: #dc2626;
}

.btn-edit {
  background: none;
  border: none;
  color: #6c5ce7;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  transition: color 0.2s;
}

.btn-edit:hover {
  color: #5a4bd1;
}

.btn-add-question {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-question:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
  background: #f8f7ff;
}

.empty-questions {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.empty-questions p {
  font-size: 14px;
  margin: 0;
}

.modal-overlay {
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: white;
  width: 90%;
  max-width: 520px;
  border-radius: 16px;
  padding: 32px 28px 28px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.35s ease-out;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  text-align: center;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #6c5ce7;
}

.form-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  background: white;
  transition: border-color 0.2s;
}

.form-select:focus {
  border-color: #6c5ce7;
}

.cover-upload {
  cursor: pointer;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
  overflow: hidden;
}

.cover-upload:hover {
  border-color: #6c5ce7;
}

.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px 20px;
  color: #94a3b8;
}

.cover-placeholder svg {
  stroke: #94a3b8;
}

.cover-placeholder span {
  font-size: 14px;
  font-weight: 500;
}

.cover-hint {
  font-size: 11px !important;
  color: #cbd5e1 !important;
  font-weight: 400 !important;
}

.cover-preview {
  position: relative;
  display: inline-block;
  width: 100%;
}

.cover-preview img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.btn-remove-cover {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove-cover:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.visibility-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visibility-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.visibility-btn:hover {
  border-color: #cbd5e1;
}

.visibility-btn.active {
  border-color: #6c5ce7;
  background: #f0edff;
}

.visibility-btn svg {
  flex-shrink: 0;
  color: #94a3b8;
}

.visibility-btn.active svg {
  color: #6c5ce7;
}

.visibility-desc {
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-left: auto;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.modal-actions button {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: none;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-publish-confirm {
  background: #6c5ce7;
  border: none;
  color: white;
}

.btn-publish-confirm:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .quiz-preview {
    padding: 12px 16px 16px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .modal-card {
    padding: 24px 20px 20px;
  }
  
  .visibility-btn {
    flex-wrap: wrap;
  }
  
  .visibility-desc {
    margin-left: 0;
    width: 100%;
    padding-left: 26px;
  }
}
</style>