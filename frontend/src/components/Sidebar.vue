<script setup lang="ts">
import {
  BarChart3,
  Bell,
  CalendarRange,
  ClipboardList,
  FileText,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Workflow
} from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/taskStore';
import { avatarFor, onAvatarError } from '../utils/avatar';

const taskStore = useTaskStore();
const router = useRouter();
const route = useRoute();

interface NavItem {
  name: string;
  path: string;
  icon: any;
  accent: string;
  badgeCount?: number;
}

const isManager = computed(() => ['Project Manager', 'Admin'].includes(taskStore.currentUser?.role));

const navItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard, accent: 'text-cyan-600' },
    { name: 'Dự án', path: '/projects', icon: FolderKanban, accent: 'text-orange-600' },
    { name: 'Kanban', path: '/kanban', icon: Kanban, accent: 'text-blue-600' },
    { name: 'Danh sách task', path: '/tasks', icon: ListTodo, accent: 'text-indigo-600' },
    { name: 'Tiến độ (Gantt)', path: '/gantt', icon: CalendarRange, accent: 'text-emerald-600' },
    { name: 'Thống kê', path: '/analytics', icon: BarChart3, accent: 'text-violet-600' },
    { name: 'Tài liệu', path: '/wiki', icon: FileText, accent: 'text-blue-600' },
    { name: 'Thông báo', path: '/notifications', icon: Bell, accent: 'text-rose-600', badgeCount: taskStore.unreadNotificationCount },
    { name: 'Nhật ký', path: '/activity-log', icon: ClipboardList, accent: 'text-sky-600' },
    { name: 'Hồ sơ', path: '/profile', icon: User, accent: 'text-emerald-600' }
  ];

  if (isManager.value) {
    items.splice(3, 0, { name: 'Quản trị', path: '/admin', icon: ShieldCheck, accent: 'text-amber-600' });
  }

  return items;
});

const onlineServices = computed(() => [
  { code: 'N1', label: 'Project', ok: taskStore.projectServiceOnline },
  { code: 'N2', label: 'Task', ok: taskStore.taskServiceOnline },
  { code: 'N3', label: 'Notify', ok: taskStore.notifyServiceOnline }
]);

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`);
}

function logout() {
  taskStore.logoutAction();
  router.push('/login');
}
</script>

<template>
  <aside class="sticky top-0 z-30 flex h-screen w-20 shrink-0 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl lg:w-72">
    <div class="border-b border-slate-100 p-3 lg:p-5">
      <router-link to="/dashboard" class="flex items-center justify-center gap-3 lg:justify-start">
        <span class="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-200">
          <Workflow class="size-6" />
        </span>
        <span class="hidden min-w-0 lg:block">
          <span class="block text-xl font-black leading-none text-slate-950">SprintFlow</span>
          <span class="mt-1 block text-xs font-bold text-slate-500">Project Management Hub</span>
        </span>
      </router-link>

      <div class="mt-5 hidden grid-cols-3 gap-2 lg:grid">
        <div
          v-for="svc in onlineServices"
          :key="svc.code"
          class="rounded-xl border px-2 py-2 text-center"
          :class="svc.ok ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'"
        >
          <div class="mx-auto mb-1 size-2 rounded-full" :class="svc.ok ? 'bg-emerald-500' : 'bg-rose-500'"></div>
          <p class="text-[11px] font-black">{{ svc.code }}</p>
          <p class="text-[10px] font-semibold opacity-75">{{ svc.label }}</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 lg:px-4">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="group relative flex items-center justify-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black transition duration-200 lg:justify-start lg:px-4"
        :title="item.name"
        :class="isActive(item.path)
          ? 'bg-slate-950 text-white shadow-xl shadow-slate-200'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
      >
        <component
          :is="item.icon"
          class="size-5 transition duration-200 group-hover:scale-110"
          :class="isActive(item.path) ? 'text-white' : item.accent"
        />
        <span class="hidden lg:inline">{{ item.name }}</span>
        <span
          v-if="item.badgeCount && item.badgeCount > 0"
          class="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white lg:static lg:ml-auto"
        >
          {{ item.badgeCount > 99 ? '99+' : item.badgeCount }}
        </span>
      </router-link>
    </nav>

    <div class="space-y-2 border-t border-slate-100 p-2 lg:p-4">
      <router-link
        to="/profile"
        class="flex items-center justify-center gap-3 rounded-2xl px-3 py-3 transition lg:justify-start"
        :class="isActive('/profile') ? 'bg-emerald-50' : 'hover:bg-slate-50'"
      >
        <img
          :src="avatarFor(taskStore.currentUser.fullName, taskStore.currentUser.avatarUrl, '0f766e')"
          @error="onAvatarError($event, taskStore.currentUser.fullName, '0f766e')"
          class="size-11 rounded-2xl border border-slate-100 object-cover"
          alt="Avatar người dùng"
        />
        <span class="hidden min-w-0 flex-1 lg:block">
          <span class="block truncate text-sm font-black text-slate-900">{{ taskStore.currentUser.fullName || 'Thành viên' }}</span>
          <span class="block truncate text-xs font-bold text-slate-500">{{ taskStore.currentUser.role || 'Member' }}</span>
        </span>
      </router-link>

      <router-link
        to="/settings"
        class="flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition lg:justify-start"
        :class="isActive('/settings') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
        title="Cài đặt"
      >
        <Settings class="size-5" :class="isActive('/settings') ? 'text-blue-600' : 'text-slate-400'" />
        <span class="hidden lg:inline">Cài đặt</span>
      </router-link>

      <button
        type="button"
        @click="logout"
        class="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-rose-600 transition hover:bg-rose-50 lg:justify-start"
        title="Đăng xuất"
      >
        <LogOut class="size-5 text-rose-500" />
        <span class="hidden lg:inline">Đăng xuất</span>
      </button>
    </div>
  </aside>
</template>
