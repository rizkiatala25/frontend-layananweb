<template>
  <div class="create-quiz-page">
    
    <!-- HEADER -->
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

    <!-- BODY -->
    <main class="page-body">
      
      <!-- QUIZ SETTINGS -->
      <div class="quiz-settings">
        <div class="settings-row">
          <div class="setting-item">
            <label>Quiz Title</label>
            <input type="text" v-model="quizTitle" placeholder="Enter quiz title" class="setting-input" />
          </div>
          <div class="setting-item">
            <label>Subject</label>
            <select v-model="selectedSubject" class="setting-select">
              <option value="">Select subject</option>
              <option value="Matematika">📐 Matematika</option>
              <option value="Bahasa Indonesia">🇮🇩 Bahasa Indonesia</option>
              <option value="Bahasa Inggris">🇬🇧 Bahasa Inggris</option>
              <option value="IPA">🔬 IPA</option>
              <option value="IPS">🌍 IPS</option>
              <option value="Sejarah">📜 Sejarah</option>
              <option value="PKN">🦅 PKN</option>
              <option value="Seni Budaya">🎭 Seni Budaya</option>
              <option value="Agama">📖 Agama</option>
              <option value="Penjaskes">⚽ Penjaskes</option>
            </select>
          </div>
        </div>

        <div class="settings-row">
          <div class="setting-item">
            <label>Duration (minutes)</label>
            <input type="number" v-model="totalDuration" min="1" max="120" class="setting-input" />
          </div>
          <div class="setting-item">
            <label>Points per Question</label>
            <div class="points-wrapper">
              <button class="points-btn" @click="decreasePoints">−</button>
              <span class="points-value">{{ points }}</span>
              <button class="points-btn" @click="increasePoints">+</button>
            </div>
          </div>
        </div>

        <!-- 🔥 COVER IMAGE DENGAN KOMPRESI -->
        <div class="cover-upload" @click="triggerCoverUpload">
          <div v-if="coverImage" class="cover-preview">
            <img :src="coverImage" alt="Cover" />
            <button class="btn-remove-cover" @click.stop="removeCover">✕</button>
            <span class="cover-size">📦 {{ Math.round(coverImage.length / 1024) }} KB</span>
          </div>
          <div v-else class="cover-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Click to upload cover image</span>
            <span class="cover-hint">Recommended: JPG, PNG (Auto compressed to &lt; 200KB)</span>
          </div>
          <input type="file" ref="coverInput" accept="image/*" @change="handleCoverUpload" style="display: none" />
        </div>
      </div>

      <!-- Question Type -->
      <div class="question-type">
        <span class="type-label">Multiple Choice</span>
      </div>

      <!-- Save Question Button -->
      <div class="settings-row">
        <button class="btn-save-question" @click="saveQuestion">Save Question</button>
      </div>

      <!-- Question Input -->
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

      <!-- Options -->
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
          <button 
            v-if="options.length > 2"
            class="btn-remove-option" 
            @click="removeOption(index)"
            title="Remove option"
          >
            ✕
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

      <!-- Saved Questions Counter -->
      <div v-if="savedQuestions.length > 0" class="questions-counter">
        <p>{{ savedQuestions.length }} question(s) saved</p>
      </div>

    </main>

    <!-- IMAGE MODAL -->
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
import { useQuizStore } from '@/stores/quizStore.js';

export default {
  name: 'CreateQuizView',
  emits: ['back', 'quiz-saved', 'go-to-preview'],
  data() {
    return {
      quizTitle: '',
      selectedSubject: '',
      totalDuration: 10,
      coverImage: null,
      questionText: '',
      points: 1,
      layout: 'vertical',
      options: [
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null },
        { text: '', isCorrect: false, image: null }
      ],
      savedQuestions: [],
      questionImage: null,
      showImageModal: false,
      imageTarget: null,
      imageTargetIndex: null,
      imageFile: null,
      isSaving: false
    };
  },
  methods: {
    // ===== BACK =====
    goBack() {
      if (this.savedQuestions.length > 0) {
        if (confirm('You have unsaved questions. Are you sure you want to leave?')) {
          this.$emit('back');
        }
      } else {
        this.$emit('back');
      }
    },

    // ===== 🔥 COVER IMAGE WITH COMPRESSION =====
    triggerCoverUpload() {
      this.$refs.coverInput.click();
    },
    
    async handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validasi ukuran
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Ukuran gambar terlalu besar! Maksimal 5MB.');
        this.$refs.coverInput.value = '';
        return;
      }
      
      try {
        // 🔥 KOMPRES GAMBAR
        const compressed = await this.compressImage(file);
        this.coverImage = compressed;
        console.log('📦 Cover image compressed:', Math.round(compressed.length / 1024), 'KB');
        this.$refs.coverInput.value = '';
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('❌ Gagal memproses gambar. Silakan coba lagi.');
        this.$refs.coverInput.value = '';
      }
    },

    // 🔥 KOMPRESI GAMBAR
    compressImage(file, maxWidth = 800, quality = 0.7) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Resize jika terlalu besar
            if (width > maxWidth) {
              height = (height / width) * maxWidth;
              width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Kompres ke JPEG
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },

    removeCover() {
      this.coverImage = null;
      this.$refs.coverInput.value = '';
    },

    // ===== POINTS =====
    increasePoints() {
      if (this.points < 20) this.points++;
    },
    decreasePoints() {
      if (this.points > 1) this.points--;
    },

    // ===== OPTIONS =====
    addOption() {
      if (this.options.length < 8) {
        this.options.push({ text: '', isCorrect: false, image: null });
      }
    },
    removeOption(index) {
      if (this.options.length <= 2) {
        alert('Minimal 2 opsi!');
        return;
      }
      if (confirm('Hapus opsi ini?')) {
        this.options.splice(index, 1);
        const hasCorrect = this.options.some(opt => opt.isCorrect);
        if (!hasCorrect && this.options.length > 0) {
          this.options[0].isCorrect = true;
        }
      }
    },
    setCorrectAnswer(index) {
      this.options.forEach(opt => opt.isCorrect = false);
      this.options[index].isCorrect = true;
    },
    toggleLayout() {
      this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
    },

    // ===== FORMAT TEXT =====
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

    // ===== IMAGE =====
    openImageModal(target, index = null) {
      this.imageTarget = target;
      this.imageTargetIndex = index;
      this.showImageModal = true;
      this.imageFile = null;
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          // 🔥 KOMPRES GAMBAR UNTUK SOAL/OPTION
          const compressed = await this.compressImage(file, 400, 0.6);
          this.imageFile = compressed;
          console.log('📦 Image compressed for', this.imageTarget);
        } catch (error) {
          console.error('Error compressing image:', error);
          alert('❌ Gagal memproses gambar');
        }
      }
    },
    insertImage() {
      if (!this.imageFile) {
        alert('Please select an image first');
        return;
      }
      
      const imageData = this.imageFile;
      
      if (this.imageTarget === 'question') {
        this.questionImage = imageData;
      } else if (this.imageTarget === 'option' && this.imageTargetIndex !== null) {
        this.options[this.imageTargetIndex].image = imageData;
      }
      
      this.showImageModal = false;
      this.imageFile = null;
    },
    removeQuestionImage() {
      this.questionImage = null;
    },
    removeOptionImage(index) {
      this.options[index].image = null;
    },

    // ===== SAVE QUESTION =====
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

    // ===== 🔥 SAVE QUIZ - DENGAN VALIDASI GAMBAR =====
    async saveQuiz() {
      if (this.isSaving) return;
      
      // Validasi
      if (this.savedQuestions.length === 0) {
        alert('⚠️ Please save at least one question first!');
        return;
      }
      if (!this.quizTitle.trim()) {
        alert('⚠️ Please enter a quiz title');
        return;
      }
      if (!this.selectedSubject) {
        alert('⚠️ Please select a subject');
        return;
      }
      if (!this.totalDuration || this.totalDuration < 1) {
        alert('⚠️ Please enter a valid duration (minimum 1 minute)');
        return;
      }

      this.isSaving = true;

      try {
        // 🔥 CEK UKURAN GAMBAR COVER
        let finalCoverImage = this.coverImage;
        if (finalCoverImage && finalCoverImage.length > 500 * 1024) {
          console.warn('⚠️ Cover image too large, using default');
          finalCoverImage = null; // Skip gambar jika terlalu besar
        }

        const quizData = {
          title: this.quizTitle,
          subject: this.selectedSubject,
          cover_image: finalCoverImage || null, // 🔥 NULL JIKA TERLALU BESAR
          total_time: this.totalDuration,
          visibility: 'private',
          questions: this.savedQuestions.map(q => ({
            question: q.question,
            question_image: q.question_image && q.question_image.length < 300 * 1024 ? q.question_image : null,
            options: q.options || [],
            options_images: q.options_images || [],
            correct_index: q.correct_index || 0,
            points: q.points || 1
          }))
        };

        console.log('📤 Saving quiz with compressed data...');
        const quizStore = useQuizStore();
        const result = await quizStore.createQuiz(quizData);
        
        if (result.success) {
          alert(`✅ Quiz "${this.quizTitle}" berhasil disimpan!\n📝 ${this.savedQuestions.length} questions saved.\n⏱️ ${this.totalDuration} minutes duration.`);
          setTimeout(() => {
            this.$emit('go-to-preview');
          }, 1000);
        } else {
          alert('❌ Gagal menyimpan quiz: ' + (result.message || 'Terjadi kesalahan'));
        }
      } catch (error) {
        console.error('Error saving quiz:', error);
        alert('❌ Gagal menyimpan quiz. Silakan coba lagi.\n' + (error.message || ''));
      } finally {
        this.isSaving = false;
      }
    }
  },
  mounted() {
    this.options[0].isCorrect = true;
  }
};
</script>

<style scoped>
/* ... style tetap sama seperti sebelumnya ... */
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

.quiz-settings {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.settings-row:last-child {
  margin-bottom: 0;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 140px;
}

.setting-item label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-input, .setting-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.setting-input:focus, .setting-select:focus {
  border-color: #6c5ce7;
}

.points-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 4px;
}

.points-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f1f5f9;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.points-btn:hover {
  background: #e2e8f0;
}

.points-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  min-width: 30px;
  text-align: center;
}

.cover-upload {
  margin-top: 12px;
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
  padding: 20px;
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
  width: 100%;
}

.cover-preview img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
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

.cover-size {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.question-type {
  margin-bottom: 16px;
}

.type-label {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

.btn-save-question {
  padding: 8px 24px;
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
  gap: 8px;
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
  min-width: 60px;
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

.btn-remove-option {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-remove-option:hover {
  background: #fee2e2;
  color: #dc2626;
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
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-save-question {
    width: 100%;
    margin-left: 0;
  }
  
  .options-area.horizontal {
    grid-template-columns: 1fr;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .points-wrapper {
    justify-content: center;
  }
}
</style>