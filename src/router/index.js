import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import StudentDashboardView from '../views/StudentDashboardView.vue';
import TeacherDashboardView from '../views/TeacherDashboardView.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    props: route => ({ initialRole: route.query.role || 'student' })
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/student-dashboard',
    name: 'student-dashboard',
    component: StudentDashboardView,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/teacher-dashboard',
    name: 'teacher-dashboard',
    component: TeacherDashboardView,
    meta: { requiresAuth: true, role: 'teacher' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }
    
    if (to.meta.role && authStore.role !== to.meta.role) {
      if (authStore.role === 'teacher') {
        next({ name: 'teacher-dashboard' });
      } else {
        next({ name: 'student-dashboard' });
      }
      return;
    }
  }
  
  next();
});

export default router;