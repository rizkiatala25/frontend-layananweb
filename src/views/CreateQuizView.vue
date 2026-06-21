<template>
  <div class="create-quiz-page">
    
    <!-- HEADER -->
    <header class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="header-title">Create Quiz</span>
      </div>
      <div class="header-right">
        <button class="btn-save-quiz" @click="saveQuiz">Save Quiz</button>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="page-body">
      
      <!-- Question Type -->
      <div class="question-type">
        <span class="type-label">Multiple Choice</span>
      </div>

      <!-- Settings Row -->
      <div class="settings-row">
        <div class="setting-item">
          <span class="setting-label">1 Poin</span>
          <button class="setting-dropdown">▼</button>
        </div>
        <div class="setting-item">
          <span class="setting-label">10 Second</span>
          <button class="setting-dropdown">▼</button>
        </div>
        <button class="btn-save-question" @click="saveQuestion">Save Question</button>
      </div>

      <!-- Question Input -->
      <div class="question-input-area">
        <div class="question-editor">
          <div class="editor-toolbar">
            <button class="toolbar-btn" title="Bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
            </button>
            <button class="toolbar-btn" title="Italic">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
            </button>
            <button class="toolbar-btn" title="Underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
            </button>
            <button class="toolbar-btn" title="Strikethrough">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><path d="M6 5v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V5"></path><path d="M6 19v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"></path></svg>
            </button>
            <button class="toolbar-btn" title="Insert Image">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </button>
            <button class="toolbar-btn" title="Insert Video">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </button>
            <button class="toolbar-btn" title="Equation">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h10"></path><path d="M4 17h16"></path></svg>
            </button>
            <button class="toolbar-btn" title="More">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
          <div class="question-textarea">
            <textarea 
              v-model="questionText" 
              placeholder="Write the text"
              class="question-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="options-area">
        <div class="option-item" v-for="(option, index) in options" :key="index">
          <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
          <input 
            type="text" 
            v-model="option.text" 
            :placeholder="'Option ' + String.fromCharCode(65 + index)"
            class="option-input"
          />
          <button class="option-image-btn" title="Add image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </button>
          <button class="option-correct-btn" @click="setCorrectAnswer(index)" :class="{ active: option.isCorrect }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- Add Option -->
      <button class="btn-add-option" @click="addOption">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        Add Option
      </button>

      <!-- Switch Layout -->
      <div class="layout-switch">
        <button class="btn-layout" @click="toggleLayout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
          Switch to {{ layout === 'vertical' ? 'horizontal' : 'vertical' }} layout
        </button>
      </div>

    </main>

  </div>
</template>

<script>
export default {
  name: 'CreateQuizView',
  emits: ['back', 'quiz-saved'],
  data() {
    return {
      questionText: '',
      layout: 'vertical',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      savedQuestions: []
    };
  },
  methods: {
    addOption() {
      if (this.options.length < 6) {
        this.options.push({ text: '', isCorrect: false });
      }
    },
    setCorrectAnswer(index) {
      this.options.forEach(opt => opt.isCorrect = false);
      this.options[index].isCorrect = true;
    },
    toggleLayout() {
      this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
    },
    saveQuestion() {
      if (!this.questionText.trim()) {
        alert('Please enter a question');
        return;
      }
      
      const hasCorrect = this.options.some(opt => opt.isCorrect);
      if (!hasCorrect) {
        alert('Please mark the correct answer');
        return;
      }
      
      const questionData = {
        id: Date.now(),
        question: this.questionText,
        options: this.options.map(opt => opt.text),
        correct_index: this.options.findIndex(opt => opt.isCorrect)
      };
      
      this.savedQuestions.push(questionData);
      alert(`✅ Question saved! (${this.savedQuestions.length} total)`);
      
      this.questionText = '';
      this.options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    },
    saveQuiz() {
      if (this.savedQuestions.length === 0) {
        alert('Please save at least one question first!');
        return;
      }
      
      localStorage.setItem('saved_quiz', JSON.stringify(this.savedQuestions));
      alert(`🎉 Quiz saved! (${this.savedQuestions.length} questions)`);
      this.$emit('quiz-saved', this.savedQuestions);
      this.$emit('back');
    },
    goBack() {
      if (this.savedQuestions.length > 0) {
        if (confirm('You have unsaved questions. Are you sure?')) {
          this.$emit('back');
        }
      } else {
        this.$emit('back');
      }
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

.create-quiz-page {
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
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
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.btn-back:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.btn-save-quiz {
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

.btn-save-quiz:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
}

/* ===== BODY ===== */
.page-body {
  flex: 1;
  padding-top: 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* ===== QUESTION TYPE ===== */
.question-type {
  margin-bottom: 16px;
}

.type-label {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

/* ===== SETTINGS ROW ===== */
.settings-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.setting-dropdown {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 12px;
}

.btn-save-question {
  padding: 6px 20px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: auto;
}

.btn-save-question:hover {
  background: #5a4bd1;
}

/* ===== QUESTION INPUT ===== */
.question-input-area {
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.question-editor {
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.toolbar-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.toolbar-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.question-textarea {
  padding: 4px;
}

.question-input {
  width: 100%;
  min-height: 80px;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
  resize: vertical;
  background: transparent;
}

.question-input::placeholder {
  color: #94a3b8;
}

/* ===== OPTIONS ===== */
.options-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  transition: border-color 0.2s;
}

.option-item:hover {
  border-color: #cbd5e1;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  min-width: 24px;
}

.option-input {
  flex: 1;
  padding: 8px 4px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
  background: transparent;
}

.option-input::placeholder {
  color: #94a3b8;
}

.option-image-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.option-image-btn:hover {
  background: #f1f5f9;
  color: #64748b;
}

.option-correct-btn {
  background: none;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.option-correct-btn:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
}

.option-correct-btn.active {
  border-color: #10b981;
  background: #d1fae5;
  color: #10b981;
}

/* ===== ADD OPTION ===== */
.btn-add-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-add-option:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
  background: #f8f7ff;
}

/* ===== LAYOUT SWITCH ===== */
.layout-switch {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.btn-layout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-layout:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .create-quiz-page {
    padding: 12px 16px 16px;
  }
  
  .settings-row {
    flex-wrap: wrap;
  }
  
  .btn-save-question {
    margin-left: 0;
    width: 100%;
  }
}
</style>