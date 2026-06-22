<template>
  <div class="create-quiz-page">
    
    <!-- ===== HEADER ===== -->
    <header class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <span class="header-title">Create Quiz</span>
      </div>
      <div class="header-right">
        <button class="btn-save-quiz" @click="saveQuiz">Save Quiz</button>
      </div>
    </header>

    <!-- ===== BODY ===== -->
    <main class="page-body">
      
      <div class="question-type">
        <span class="type-label">Multiple Choice</span>
      </div>

      <div class="settings-row">
        <div class="setting-item">
          <span class="setting-label">{{ points }} Poin</span>
          <button class="setting-dropdown" @click="togglePointsDropdown">▼</button>
          <div v-if="showPointsDropdown" class="dropdown-menu">
            <div @click="setPoints(1)">1 Poin</div>
            <div @click="setPoints(2)">2 Poin</div>
            <div @click="setPoints(3)">3 Poin</div>
            <div @click="setPoints(5)">5 Poin</div>
            <div @click="setPoints(10)">10 Poin</div>
          </div>
        </div>
        <button class="btn-save-question" @click="saveQuestion">Save Question</button>
      </div>

      <div class="question-input-area">
        <div class="question-editor">
          <div class="editor-toolbar">
            <button class="toolbar-btn" title="Bold" @click="applyFormat('bold')"><b>B</b></button>
            <button class="toolbar-btn" title="Italic" @click="applyFormat('italic')"><i>I</i></button>
            <button class="toolbar-btn" title="Underline" @click="applyFormat('underline')"><u>U</u></button>
            <button class="toolbar-btn" title="Strikethrough" @click="applyFormat('strike')"><s>S</s></button>
            <button class="toolbar-btn" title="Insert Image" @click="openImageModal('question')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </button>
            <button class="toolbar-btn" title="Insert Video">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </button>
            <button class="toolbar-btn" title="Equation">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16"></path><path d="M4 12h10"></path><path d="M4 17h16"></path></svg>
            </button>
            <button class="toolbar-btn" title="More">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
          <div class="question-textarea">
            <textarea 
              v-model="questionText" 
              placeholder="Write the text"
              class="question-input"
              rows="3"
            ></textarea>
            <div v-if="questionImage" class="image-preview">
              <img :src="questionImage" alt="Question image" />
              <button class="btn-remove-image" @click="removeQuestionImage">✕</button>
            </div>
          </div>
        </div>
      </div>

      <div class="options-area" :class="{ horizontal: layout === 'horizontal' }">
        <div 
          v-for="(option, index) in options" 
          :key="index"
          class="option-item"
          :class="{ 'correct': option.isCorrect }"
        >
          <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
          <input 
            type="text" 
            v-model="option.text" 
            :placeholder="'Option ' + String.fromCharCode(65 + index)"
            class="option-input"
          />
          <button class="option-image-btn" @click="openImageModal('option', index)" title="Add image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </button>
          <div v-if="option.image" class="option-image-preview">
            <img :src="option.image" alt="Option image" />
            <button class="btn-remove-option-image" @click="removeOptionImage(index)">✕</button>
          </div>
          <button 
            class="option-correct-btn" 
            @click="setCorrectAnswer(index)" 
            :class="{ active: option.isCorrect }"
            title="Mark as correct answer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <button class="btn-add-option" @click="addOption">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        Add Option
      </button>

      <div class="layout-switch">
        <button class="btn-layout" @click="toggleLayout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
          Switch to {{ layout === 'vertical' ? 'horizontal' : 'vertical' }} layout
        </button>
      </div>

      <div v-if="savedQuestions.length > 0" class="questions-counter">
        <p>{{ savedQuestions.length }} question(s) saved</p>
      </div>

    </main>

    <div v-if="showImageModal" class="modal-overlay" @click.self="showImageModal = false">
      <div class="modal-card">
        <h3>Insert Image</h3>
        <input type="file" accept="image/*" @change="handleImageUpload" ref="fileInput" />
        <div class="modal-actions">
          <button @click="showImageModal = false">Cancel</button>
          <button @click="insertImage">Insert</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CreateQuizView',
  emits: ['back', 'quiz-saved', 'go-to-preview'],
  data() {
    return {
      questionText: '',
      points: 1,
      layout: 'vertical',
      options: [
        { text: '', isCorrect: true, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null }
      ],
      savedQuestions: [],
      
      showImageModal: false,
      imageTarget: null,
      imageTargetIndex: null,
      imageFile: null,
      questionImage: null,
      
      showPointsDropdown: false
    };
  },
  methods: {
    addOption() {
      if (this.options.length < 6) {
        this.options.push({ text: '', isCorrect: false, image: null });
      }
    },
    setCorrectAnswer(index) {
      this.options.forEach(opt => opt.isCorrect = false);
      this.options[index].isCorrect = true;
    },
    toggleLayout() {
      this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
    },
    togglePointsDropdown() {
      this.showPointsDropdown = !this.showPointsDropdown;
    },
    setPoints(value) {
      this.points = value;
      this.showPointsDropdown = false;
    },
    applyFormat(format) {
      const textarea = document.querySelector('.question-input');
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = this.questionText.substring(start, end);
      
      let formattedText = '';
      switch(format) {
        case 'bold': formattedText = `**${selectedText}**`; break;
        case 'italic': formattedText = `*${selectedText}*`; break;
        case 'underline': formattedText = `__${selectedText}__`; break;
        case 'strike': formattedText = `~~${selectedText}~~`; break;
        default: formattedText = selectedText;
      }
      
      this.questionText = this.questionText.substring(0, start) + formattedText + this.questionText.substring(end);
    },
    openImageModal(target, index = null) {
      this.imageTarget = target;
      this.imageTargetIndex = index;
      this.showImageModal = true;
      this.imageFile = null;
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },
    insertImage() {
      if (!this.imageFile) {
        alert('Please select an image first');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        
        if (this.imageTarget === 'question') {
          this.questionImage = imageData;
        } else if (this.imageTarget === 'option' && this.imageTargetIndex !== null) {
          this.options[this.imageTargetIndex].image = imageData;
        }
        
        this.showImageModal = false;
        this.imageFile = null;
      };
      reader.readAsDataURL(this.imageFile);
    },
    removeQuestionImage() {
      this.questionImage = null;
    },
    removeOptionImage(index) {
      this.options[index].image = null;
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
      
      const hasEmptyOption = this.options.some(opt => !opt.text.trim());
      if (hasEmptyOption) {
        alert('Please fill in all options');
        return;
      }
      
      const questionData = {
        id: Date.now(),
        question: this.questionText,
        question_image: this.questionImage || null,
        options: this.options.map(opt => opt.text),
        options_images: this.options.map(opt => opt.image || null),
        correct_index: this.options.findIndex(opt => opt.isCorrect),
        points: this.points
      };
      
      this.savedQuestions.push(questionData);
      alert(`✅ Question saved! (${this.savedQuestions.length} total)`);
      
      this.questionText = '';
      this.questionImage = null;
      this.options = [
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null }
      ];
      this.options[0].isCorrect = true;
    },
    saveQuiz() {
      if (this.savedQuestions.length === 0) {
        alert('Please save at least one question first!');
        return;
      }
      
      const quizData = this.savedQuestions.map(q => ({
        id: q.id || Date.now(),
        question: q.question || 'No question',
        question_image: q.question_image || null,
        options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        options_images: q.options_images || [],
        correct_index: q.correct_index || 0,
        points: q.points || 1
      }));
      
      localStorage.setItem('saved_quiz', JSON.stringify(quizData));
      console.log('📚 Quiz saved with images:', quizData);
      
      this.$emit('go-to-preview');
    },
    goBack() {
      if (this.savedQuestions.length > 0) {
        if (confirm('You have unsaved questions. Are you sure you want to leave?')) {
          this.$emit('back');
        }
      } else {
        this.$emit('back');
      }
    },
    handleClickOutside(event) {
      if (!event.target.closest('.setting-item')) {
        this.showPointsDropdown = false;
      }
    }
  },
  mounted() {
    this.options[0].isCorrect = true;
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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

.page-body {
  flex: 1;
  padding-top: 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.question-type {
  margin-bottom: 16px;
}

.type-label {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  position: relative;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  position: relative;
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
  padding: 0 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 100px;
  margin-top: 4px;
}

.dropdown-menu div {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.dropdown-menu div:hover {
  background: #f1f5f9;
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
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.question-textarea {
  padding: 4px;
  position: relative;
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

.image-preview {
  position: relative;
  padding: 8px 16px 12px;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.btn-remove-image {
  position: absolute;
  top: 4px;
  left: 180px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.options-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.options-area.horizontal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  transition: border-color 0.2s;
  flex-wrap: wrap;
}

.option-item:hover {
  border-color: #cbd5e1;
}

.option-item.correct {
  border-color: #10b981;
  background: #f0fdf4;
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
  min-width: 80px;
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

.option-image-preview {
  position: relative;
  display: inline-block;
}

.option-image-preview img {
  max-width: 40px;
  max-height: 40px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.btn-remove-option-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  flex-shrink: 0;
}

.option-correct-btn:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
}

.option-correct-btn.active {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

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

.questions-counter {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 10px;
  text-align: center;
}

.questions-counter p {
  font-size: 14px;
  color: #64748b;
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
}

.modal-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
}

.modal-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.modal-card input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.modal-actions button {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-actions button:first-child {
  background: none;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.modal-actions button:first-child:hover {
  background: #f1f5f9;
}

.modal-actions button:last-child {
  background: #6c5ce7;
  border: none;
  color: white;
}

.modal-actions button:last-child:hover {
  background: #5a4bd1;
}

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
  
  .options-area.horizontal {
    grid-template-columns: 1fr;
  }
  
  .header-title {
    font-size: 16px;
  }
}
</style>