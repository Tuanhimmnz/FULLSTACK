import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import Dashboard from '../views/Dashboard.vue';
import Kanban from '../views/Kanban.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Admin from '../views/Admin.vue';
import Notifications from '../views/Notifications.vue';
import Projects from '../views/Projects.vue';
import Profile from '../views/Profile.vue';
import Settings from '../views/Settings.vue';
import ActivityLog from '../views/ActivityLog.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { title: 'SprintFlow - Quản lý dự án Microservices' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Đăng nhập - SprintFlow' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Đăng ký - SprintFlow' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Tổng quan - SprintFlow', requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { title: 'Dự án - SprintFlow', requiresAuth: true }
  },
  {
    path: '/kanban',
    name: 'Kanban',
    component: Kanban,
    meta: { title: 'Bảng Kanban - SprintFlow', requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksList.vue'),
    meta: { title: 'My Task - SprintFlow', requiresAuth: true }
  },
  {
    path: '/gantt',
    name: 'GanttChart',
    component: () => import('../views/GanttChart.vue'),
    meta: { title: 'Tiến độ dự án - SprintFlow', requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/Analytics.vue'),
    meta: { title: 'Thống kê & nguồn lực - SprintFlow', requiresAuth: true }
  },
  {
    path: '/wiki',
    name: 'Wiki',
    component: () => import('../views/Wiki.vue'),
    meta: { title: 'Tài liệu dự án - SprintFlow', requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { title: 'Thông báo - SprintFlow', requiresAuth: true }
  },
  {
    path: '/activity-log',
    name: 'ActivityLog',
    component: ActivityLog,
    meta: { title: 'Nhật ký hoạt động - SprintFlow', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Hồ sơ - SprintFlow', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Cài đặt & Diagnostics - SprintFlow', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { title: 'Quản trị - SprintFlow', requiresAuth: true }
  },
  {
    path: '/projects-stub',
    redirect: '/projects'
  },
  {
    path: '/profile-stub',
    redirect: '/profile'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || 'SprintFlow';
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    next('/login');
    return;
  }

  if ((to.path === '/login' || to.path === '/register' || to.path === '/') && token) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
