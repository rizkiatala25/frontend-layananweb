<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <!-- Cover dengan Emoji -->
      <div class="modal-cover">
        <span class="modal-emoji">{{ quiz?.emoji || '📝' }}</span>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <h2 class="modal-title">{{ quiz?.title || 'Quiz' }}</h2>
        <p class="modal-questions">{{ quiz?.total_questions || 0 }} question</p>
        
        <button class="btn-start" @click="startQuiz">
          Start
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizDetailModal',
  props: {
    quiz: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'start'],
  methods: {
    startQuiz() {
      this.$emit('start', this.quiz);
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
}

.modal-card {
  background: white;
  width: 90%;
  max-width: 340px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-cover {
  height: 140px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.modal-body {
  padding: 20px 24px 28px;
  text-align: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
  text-transform: capitalize;
}

.modal-questions {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 20px 0;
}

.btn-start {
  width: 100%;
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-start:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
}
</style>