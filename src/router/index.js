// D:\laragon\www\kuis-frontend\src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';

// 🔥 IMPORT VIEWS
import Home from '../views/Home.vue';

// 🔥 IMPORT COMPONENTS
import LoginSiswa from '../components/auth/LoginSiswa.vue';
import LoginGuru from '../components/auth/LoginGuru.vue';
import RegisterSiswa from '../components/auth/RegisterSiswa.vue';
import RegisterGuru from '../components/auth/RegisterGuru.vue';
import DashboardSiswa from '../components/siswa/DashboardSiswa.vue';
import DashboardGuru from '../components/guru/DashboardGuru.vue';
import KelolaSoal from '../components/guru/KelolaSoal.vue';
import LihatNilai from '../components/guru/LihatNilai.vue';
import Quiz from '../components/siswa/Quiz.vue';
import CreateQuiz from '../views/CreateQuizView.vue';
import QuizPreview from '../views/QuizPreviewView.vue';
import QuizPlay from '../views/QuizPlayView.vue';
import QuizResult from '../views/QuizResultView.vue';

const routes = [
  // ===== AUTH ROUTES =====
  { path: '/', name: 'home', component: Home },
  { path: '/login/siswa', name: 'login-siswa', component: LoginSiswa },
  { path: '/login/guru', name: 'login-guru', component: LoginGuru },
  { path: '/register/siswa', name: 'register-siswa', component: RegisterSiswa },
  { path: '/register/guru', name: 'register-guru', component: RegisterGuru },

  // ===== DASHBOARD ROUTES =====
  { 
    path: '/dashboard/siswa', 
    name: 'dashboard-siswa', 
    component: DashboardSiswa, 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/dashboard/guru', 
    name: 'dashboard-guru', 
    component: DashboardGuru, 
    meta: { requiresAuth: true, role: 'guru' } 
  },

  // ===== QUIZ ROUTES (GURU) =====
  { 
    path: '/create-quiz', 
    name: 'create-quiz', 
    component: CreateQuiz, 
    meta: { requiresAuth: true, role: 'guru' } 
  },
  { 
    path: '/quiz-preview/:id?', 
    name: 'quiz-preview', 
    component: QuizPreview, 
    meta: { requiresAuth: true, role: 'guru' } 
  },
  { 
    path: '/kelola-soal', 
    name: 'kelola-soal', 
    component: KelolaSoal, 
    meta: { requiresAuth: true, role: 'guru' } 
  },
  { 
    path: '/lihat-nilai', 
    name: 'lihat-nilai', 
    component: LihatNilai, 
    meta: { requiresAuth: true, role: 'guru' } 
  },

  // ===== QUIZ ROUTES (SISWA) =====
  { 
    path: '/quiz-play/:id', 
    name: 'quiz-play', 
    component: QuizPlay, 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/quiz-result/:id', 
    name: 'quiz-result', 
    component: QuizResult, 
    meta: { requiresAuth: true, role: 'siswa' } 
  },
  { 
    path: '/quiz/:id', 
    name: 'quiz', 
    component: Quiz, 
    meta: { requiresAuth: true, role: 'siswa' } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔥 ROUTER GUARD - LENGKAP
router.beforeEach((to, from) => {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');
  
  console.log('🔐 Router Guard - to:', to.name);
  console.log('🔐 Router Guard - token:', token ? 'Ada' : 'Tidak ada');
  console.log('🔐 Router Guard - role:', role);

  // 🔥 CEK ROUTE YANG BUTUH AUTH
  if (to.meta && to.meta.requiresAuth) {
    if (!token) {
      console.log('❌ Tidak ada token, redirect ke home');
      return { name: 'home' };
    }
    
    // 🔥 CEK ROLE
    if (to.meta.role && role !== to.meta.role) {
      console.log(`❌ Role ${role} tidak sesuai dengan ${to.meta.role}, redirect ke dashboard`);
      if (role === 'guru') {
        return { name: 'dashboard-guru' };
      } else if (role === 'siswa') {
        return { name: 'dashboard-siswa' };
      }
      return { name: 'home' };
    }
    
    console.log('✅ Akses diizinkan ke:', to.name);
  }
  
  return true;
});

export default router;