<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <!-- Close Button -->
      <button class="modal-close" @click="$emit('close')">✕</button>
      
      <!-- Icon -->
      <div class="modal-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <line x1="9" y1="10" x2="12" y2="10"></line>
          <line x1="9" y1="14" x2="14" y2="14"></line>
          <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          <circle cx="17" cy="14" r="1" fill="currentColor"></circle>
        </svg>
      </div>
      
      <!-- Title -->
      <h2 class="modal-title">Multiple Choice</h2>
      
      <!-- Description -->
      <p class="modal-description">Pick the right answer and test your knowledge!</p>
      
      <!-- Options Preview -->
      <div class="options-preview">
        <div class="preview-item">
          <span class="preview-label">A</span>
          <span class="preview-text">Option A</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">B</span>
          <span class="preview-text">Option B</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">C</span>
          <span class="preview-text">Option C</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">D</span>
          <span class="preview-text">Option D</span>
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn-start" @click="startCreating">Start Creating</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleChoiceModal',
  emits: ['close', 'start'],
  methods: {
    startCreating() {
      this.$emit('start');
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
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
  max-width: 420px;
  border-radius: 16px;
  padding: 32px 28px 28px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: slideUp 0.35s ease-out;
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

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.modal-close:hover {
  color: #1e293b;
}

.modal-icon {
  text-align: center;
  margin-bottom: 16px;
}

.modal-icon svg {
  stroke: #6c5ce7;
}

.modal-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.modal-description {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.options-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-label {
  font-weight: 600;
  color: #94a3b8;
  min-width: 20px;
  font-size: 13px;
}

.preview-text {
  font-size: 13px;
  color: #64748b;
}

.modal-actions {
  display: flex;
  gap: 12px;
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

.btn-start {
  background: #6c5ce7;
  border: none;
  color: white;
}

.btn-start:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
}

@media (max-width: 480px) {
  .modal-card {
    padding: 24px 20px 20px;
  }
  
  .modal-title {
    font-size: 18px;
  }
}
</style>