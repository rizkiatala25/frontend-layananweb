<template>
  <div id="app">
    <!-- HOME PAGE -->
    <HomeView 
      v-if="currentPage === 'home'" 
      @navigate-to-signup="changePage('signup')" 
      @navigate-to-login="handleLoginClick"
    />

    <!-- SIGNUP PAGE -->
    <SignUpView 
      v-else-if="currentPage === 'signup'" 
      @navigate-to-quiz="handleSignupSuccess"
      @navigate-to-login="handleLoginClick"
    />

    <!-- LOGIN PAGE -->
    <LoginView 
      v-else-if="currentPage === 'login'" 
      :initialRole="selectedRole"
      @navigate-to-quiz="handleRoleRouting"
      @navigate-to-signup="changePage('signup')"
      @navigate-to-home="changePage('home')"
    />

    <!-- STUDENT DASHBOARD -->
    <StudentDashboardView 
      v-else-if="currentPage === 'student-dashboard'" 
      @logout="handleLogout"
      @start-quiz="handleStartQuiz"
    />

    <!-- TEACHER DASHBOARD -->
    <TeacherDashboardView 
      v-else-if="currentPage === 'teacher-dashboard'" 
      @logout="handleLogout"
      @create-quiz="handleCreateQuiz"
      @view-quiz="handleViewQuiz"
    />

    <!-- CREATE QUIZ -->
    <CreateQuizView 
      v-else-if="currentPage === 'create-quiz'"
      @back="handleQuizBack"
      @quiz-saved="handleQuizSaved"
      @go-to-preview="handleGoToPreview"
    />

    <!-- QUIZ PREVIEW -->
    <QuizPreviewView 
      v-else-if="currentPage === 'quiz-preview'"
      @back="handlePreviewBack"
      @quiz-published="handleQuizPublished"
    />

    <!-- HALAMAN PLAY QUIZ -->
    <QuizPlayView 
      v-else-if="currentPage === 'quiz-play'"
      :quiz-id="activeQuizId"
      @finish="handleQuizFinish"
      @back="handleQuizBack"
    />

    <!-- HALAMAN HASIL QUIZ -->
    <QuizResultView 
      v-else-if="currentPage === 'quiz-result'"
      :result-data="quizResultData"
      @done="handleResultDone"
    />

    <!-- TEST CONNECTION -->
    <TestConnection 
      v-else-if="currentPage === 'test'" 
      @back-to-home="changePage('home')"
    />

    <!-- LOADING STATE -->
    <div v-else-if="loading" class="spinner-global">
      <div class="spinner"></div>
    </div>

    <!-- 404 PAGE -->
    <div v-else class="not-found">
      <h1>404</h1>
      <p>Halaman tidak ditemukan</p>
      <button @click="changePage('home')" class="btn-back-home">Kembali ke Home</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import HomeView from './views/HomeView.vue';
import SignUpView from './views/SignUpView.vue';
import LoginView from './views/LoginView.vue';
import StudentDashboardView from './views/StudentDashboardView.vue';
import TeacherDashboardView from './views/TeacherDashboardView.vue';
import CreateQuizView from './views/CreateQuizView.vue';
import QuizPreviewView from './views/QuizPreviewView.vue';
import QuizPlayView from './views/QuizPlayView.vue';
import QuizResultView from './views/QuizResultView.vue';
import TestConnection from './views/TestConnection.vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const currentPage = ref('home');
const selectedRole = ref('student');
const loading = ref(false);
const activeQuizId = ref(null);
const quizResultData = ref(null);

const changePage = (pageName) => {
  currentPage.value = pageName;
};

const handleLoginClick = (role) => {
  console.log('📌 HomeView clicked role:', role);
  selectedRole.value = role || 'student';
  currentPage.value = 'login';
};

const handleSignupSuccess = () => {
  const role = authStore.role || localStorage.getItem('user_role') || 'student';
  console.log('📌 Signup - final role:', role);
  
  if (role === 'teacher') {
    currentPage.value = 'teacher-dashboard';
  } else {
    currentPage.value = 'student-dashboard';
  }
};

const handleRoleRouting = () => {
  const role = authStore.role || localStorage.getItem('user_role') || selectedRole.value;
  console.log('📌 Login routing - final role:', role);
  
  if (role === 'teacher') {
    currentPage.value = 'teacher-dashboard';
  } else {
    currentPage.value = 'student-dashboard';
  }
};

// 🔥 HANDLE LOGOUT
const handleLogout = async () => {
  console.log('📌 Logging out...');
  loading.value = true;
  try {
    await authStore.logout();
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    loading.value = false;
    currentPage.value = 'home';
  }
};

// ===== CREATE QUIZ =====
const handleCreateQuiz = () => {
  currentPage.value = 'create-quiz';
};

const handleQuizBack = () => {
  currentPage.value = 'teacher-dashboard';
  activeQuizId.value = null;
};

const handleQuizSaved = () => {
  console.log('📌 Quiz saved successfully!');
};

const handleGoToPreview = () => {
  currentPage.value = 'quiz-preview';
};

// ===== QUIZ PREVIEW =====
const handlePreviewBack = () => {
  currentPage.value = 'create-quiz';
};

const handleQuizPublished = (quizData) => {
  console.log('📌 Quiz published:', quizData);
  alert(`✅ Quiz "${quizData.title}" berhasil dipublikasikan!`);
  currentPage.value = 'teacher-dashboard';
};

// ===== VIEW QUIZ =====
const handleViewQuiz = (quiz) => {
  console.log('📌 View quiz:', quiz);
};

// ===== QUIZ PLAY =====
const handleStartQuiz = (quizId) => {
  activeQuizId.value = quizId;
  currentPage.value = 'quiz-play';
};

// ===== QUIZ RESULT =====
const handleQuizFinish = (result) => {
  console.log('📌 Quiz finished:', result);
  
  let savedQuestions = [];
  let quizTitle = 'Quiz';
  let quizEmoji = '📝';
  
  try {
    const questions = localStorage.getItem('current_quiz_questions');
    if (questions) {
      savedQuestions = JSON.parse(questions);
    }
    const title = localStorage.getItem('current_quiz_title');
    if (title) {
      quizTitle = title;
    }
  } catch (e) {
    console.error('Error parsing questions:', e);
  }
  
  const formattedAnswers = result.answers.map((answer, index) => {
    const questionData = savedQuestions[index] || {};
    const options = questionData.options || ['Option A', 'Option B', 'Option C', 'Option D'];
    const correctIndex = questionData.correct_index !== undefined ? questionData.correct_index : 0;
    
    return {
      question: questionData.question || `Soal ${index + 1}`,
      options: options,
      correct_answer: options[correctIndex] || 'Correct Answer',
      user_answer: options[answer.selected] || 'User Answer'
    };
  });
  
  const quizResult = {
    title: quizTitle,
    totalQuestions: result.total || 5,
    score: result.score || 0,
    emoji: quizEmoji
  };
  
  localStorage.setItem('quiz_result', JSON.stringify(quizResult));
  
  const studentName = authStore.user?.full_name || localStorage.getItem('user_name') || 'Student';
  const quizResults = JSON.parse(localStorage.getItem('quiz_results') || '{}');
  const quizId = activeQuizId.value;
  
  if (!quizResults[quizId]) {
    quizResults[quizId] = [];
  }
  
  quizResults[quizId].push({
    studentName: studentName,
    score: result.score || 0,
    correct: result.correct || 0,
    total: result.total || 5,
    date: new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    answers: formattedAnswers
  });
  
  localStorage.setItem('quiz_results', JSON.stringify(quizResults));
  
  quizResultData.value = {
    studentName: studentName,
    score: result.score || 0,
    totalQuestions: result.total || 5,
    answers: formattedAnswers
  };
  
  currentPage.value = 'quiz-result';
  activeQuizId.value = null;
};

const handleResultDone = () => {
  currentPage.value = 'student-dashboard';
  quizResultData.value = null;
};

// ===== MOUNTED =====
onMounted(() => {
  authStore.loadUserFromStorage();
  
  const role = authStore.role || localStorage.getItem('user_role');
  console.log('📌 App mounted - final role:', role);
  
  if (authStore.isAuthenticated) {
    if (role === 'teacher') {
      currentPage.value = 'teacher-dashboard';
    } else {
      currentPage.value = 'student-dashboard';
    }
  } else {
    currentPage.value = 'home';
  }
});

// ===== WATCHERS =====
watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (!newVal && currentPage.value !== 'home') {
      currentPage.value = 'home';
    }
  }
);

watch(
  () => authStore.role,
  (newRole) => {
    console.log('📌 Role changed in store:', newRole);
    if (newRole === 'teacher') {
      currentPage.value = 'teacher-dashboard';
    } else if (newRole === 'student') {
      currentPage.value = 'student-dashboard';
    }
  }
);

// ===== WINDOW FUNCTIONS =====
window.goToTest = () => {
  changePage('test');
};

window.checkAuth = () => {
  console.log('=== AUTH STATE ===');
  console.log('Store role:', authStore.role);
  console.log('Store user:', authStore.user);
  console.log('Store isAuthenticated:', authStore.isAuthenticated);
  console.log('localStorage user_role:', localStorage.getItem('user_role'));
  console.log('localStorage user_data:', localStorage.getItem('user_data'));
  console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
  background-color: #f8fafc;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #7468f3;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #635bff;
}

.text-center {
  text-align: center;
}

.mt-1 { margin-top: 10px; }
.mt-2 { margin-top: 20px; }
.mt-3 { margin-top: 30px; }
.mb-1 { margin-bottom: 10px; }
.mb-2 { margin-bottom: 20px; }
.mb-3 { margin-bottom: 30px; }

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spinner-global {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1c29;
}

.spinner-global .spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #7468f3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1c29;
  color: white;
}

.not-found h1 {
  font-size: 80px;
  color: #7468f3;
  margin-bottom: 10px;
}

.not-found p {
  font-size: 20px;
  color: #94a3b8;
  margin-bottom: 30px;
}

.btn-back-home {
  padding: 12px 32px;
  background: #7468f3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.btn-back-home:hover {
  background: #635bff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(116, 104, 243, 0.3);
}
</style>