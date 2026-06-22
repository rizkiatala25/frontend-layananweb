<template>
  <div class="quiz-result">
    
    <!-- HEADER -->
    <header class="result-header">
      <h1 class="congrats-title">Congratulations {{ studentName }}</h1>
      <p class="sub-title">Good job</p>
    </header>

    <!-- BODY -->
    <main class="result-body">
      
      <!-- Statistic Section -->
      <div class="statistic-section">
        <h3 class="statistic-title">Let's cek your statistic</h3>
      </div>

      <!-- Accuracy -->
      <div class="accuracy-section">
        <div class="accuracy-circle">
          <span class="accuracy-number">{{ scorePercentage }}%</span>
        </div>
        <div class="accuracy-label">
          <span>Accuracy</span>
        </div>
      </div>

      <!-- Performance Quiz -->
      <div class="performance-section">
        <h4 class="performance-title">performance quiz</h4>
        <div class="performance-item">
          <span class="performance-label">1 Connect</span>
        </div>
        <div class="performance-item">
          <span class="performance-label">2 Microsoft</span>
        </div>
        <div class="performance-item">
          <span class="performance-label">5 s/time question</span>
        </div>
      </div>

      <!-- Review Question -->
      <div class="review-section">
        <p class="review-title">Review question</p>
        <p class="review-sub">Your results are ready.</p>
      </div>

      <!-- Detail Jawaban -->
      <div class="answer-details">
        <div 
          v-for="(answer, index) in answers" 
          :key="index"
          class="answer-item"
        >
          <div class="answer-header">
            <span class="answer-number">{{ index + 1 }}.</span>
            <span class="answer-question">{{ answer.question }}</span>
          </div>

          <!-- 🔥 TAMPILKAN GAMBAR SOAL JIKA ADA -->
          <div v-if="answer.question_image" class="answer-image-wrapper">
            <img :src="answer.question_image" alt="Question image" class="answer-image" />
          </div>

          <div class="answer-options">
            <div 
              v-for="(option, optIndex) in answer.options" 
              :key="optIndex"
              class="answer-option"
              :class="{
                'correct-answer': option === answer.correct_answer,
                'wrong-answer': option === answer.user_answer && option !== answer.correct_answer,
                'user-selected': option === answer.user_answer
              }"
            >
              <!-- 🔥 TAMPILKAN GAMBAR OPTION JIKA ADA -->
              <span v-if="answer.options_images && answer.options_images[optIndex]" class="option-result-image-wrapper">
                <img :src="answer.options_images[optIndex]" alt="Option" class="option-result-image" />
              </span>
              <span class="option-marker">
                <span v-if="option === answer.correct_answer" class="marker-correct">●</span>
                <span v-else-if="option === answer.user_answer && option !== answer.correct_answer" class="marker-wrong">●</span>
                <span v-else class="marker-default">●</span>
              </span>
              {{ option }}
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <footer class="result-footer">
      <button class="btn-done" @click="goToDashboard">Done</button>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'QuizResultView',
  props: {
    resultData: {
      type: Object,
      default: () => ({
        studentName: 'Akmal',
        score: 50,
        totalQuestions: 5,
        answers: []
      })
    }
  },
  emits: ['done'],
  data() {
    return {
      studentName: 'Akmal',
      scorePercentage: 50,
      answers: []
    };
  },
  mounted() {
    if (this.resultData) {
      this.studentName = this.resultData.studentName || 'Akmal';
      this.scorePercentage = this.resultData.score || 50;
      
      this.answers = this.resultData.answers || [
        {
          question: 'Tanggal berapa indonesia merdeka',
          options: ['17 Agustus 2000', '17 Agustus 1948', '17 Agustus 1980', '17 Agustus 1975'],
          correct_answer: '17 Agustus 1945',
          user_answer: '17 Agustus 2000',
          question_image: null,
          options_images: []
        },
        {
          question: 'Siapa presiden ke 3 Indonesia',
          options: ['Megawati', 'B.J. Habibie', 'Jokowi', 'SBY'],
          correct_answer: 'B.J. Habibie',
          user_answer: 'Megawati',
          question_image: null,
          options_images: []
        }
      ];
    }
  },
  methods: {
    goToDashboard() {
      this.$emit('done');
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

.quiz-result {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Poppins', sans-serif;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
}

/* ===== HEADER ===== */
.result-header {
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.congrats-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.sub-title {
  font-size: 14px;
  color: #64748b;
  margin: 2px 0 0 0;
}

/* ===== BODY ===== */
.result-body {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

/* ===== STATISTIC ===== */
.statistic-section {
  margin-bottom: 16px;
}

.statistic-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

/* ===== ACCURACY ===== */
.accuracy-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.accuracy-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6c5ce7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accuracy-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.accuracy-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* ===== PERFORMANCE ===== */
.performance-section {
  background: #ffffff;
  padding: 16px 18px;
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1px solid #f1f5f9;
}

.performance-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.performance-item {
  padding: 4px 0;
}

.performance-label {
  font-size: 14px;
  font-weight: 400;
  color: #1e293b;
}

/* ===== REVIEW ===== */
.review-section {
  margin-bottom: 16px;
}

.review-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.review-sub {
  font-size: 13px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

/* ===== ANSWER DETAILS ===== */
.answer-details {
  background: #ffffff;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.answer-item {
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.answer-item:last-child {
  border-bottom: none;
}

.answer-header {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.answer-number {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}

.answer-question {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* 🔥 GAMBAR SOAL DI HASIL */
.answer-image-wrapper {
  margin: 8px 0 8px 20px;
}

.answer-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  object-fit: contain;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 20px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  padding: 2px 0;
}

/* 🔥 GAMBAR OPTION DI HASIL */
.option-result-image-wrapper {
  display: inline-block;
  flex-shrink: 0;
}

.option-result-image {
  max-width: 30px;
  max-height: 30px;
  border-radius: 4px;
  object-fit: cover;
  vertical-align: middle;
}

.option-marker {
  display: inline-flex;
  align-items: center;
  width: 16px;
}

.marker-correct {
  color: #10b981;
  font-size: 12px;
}

.marker-wrong {
  color: #ef4444;
  font-size: 12px;
}

.marker-default {
  color: #cbd5e1;
  font-size: 10px;
}

.answer-option.correct-answer {
  color: #10b981;
}

.answer-option.wrong-answer {
  color: #ef4444;
}

.answer-option.user-selected {
  font-weight: 500;
}

/* ===== FOOTER ===== */
.result-footer {
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

.btn-done {
  padding: 10px 36px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-done:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .quiz-result {
    padding: 12px 14px 16px;
  }
  
  .congrats-title {
    font-size: 20px;
  }
  
  .accuracy-circle {
    width: 52px;
    height: 52px;
  }
  
  .accuracy-number {
    font-size: 16px;
  }
  
  .answer-header {
    flex-wrap: wrap;
  }
  
  .answer-options {
    padding-left: 14px;
  }
  
  .answer-image-wrapper {
    margin-left: 10px;
  }
  
  .answer-image {
    max-width: 150px;
    max-height: 120px;
  }
}
</style>