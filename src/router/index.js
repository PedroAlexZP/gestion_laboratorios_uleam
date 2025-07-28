import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import LaboratoryList from '../views/LaboratoryList.vue'
import ReservationForm from '../views/ReservationForm.vue'
import LabManagement from '../views/LabManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/laboratories/:faculty',
    name: 'LaboratoryList',
    component: LaboratoryList,
    meta: { requiresAuth: true }
  },
  {
    path: '/reserve/:faculty/:labId',
    name: 'ReservationForm',
    component: ReservationForm,
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/manage/:faculty/:labId',
    name: 'LabManagement',
    component: LabManagement,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect to appropriate dashboard based on user role
    if (authStore.user?.role === 'admin') {
      next('/admin')
    } else if (authStore.user?.role === 'user') {
      next('/user')
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
