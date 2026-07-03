<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  AlertTriangle,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Plus,
  Search,
  Users
} from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../services/mockData';
import QuickTaskModal from '../components/QuickTaskModal.vue';
import TaskDetailModal from '../components/TaskDetailModal.vue';
import { avatarFor, onAvatarError } from '../utils/avatar';

const taskStore = useTaskStore();

const searchQuery = ref('');
const isCreateModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const activeTaskId = ref<string | undefined>(undefined);

const isManager = computed(() => ['Project Manager', 'Admin'].includes(taskStore.currentUser?.role));
const firstName = computed(() => {
  const name = taskStore.currentUser?.fullName || 'bạn';
  return name.split(' ').filter(Boolean).pop() || name;
});

const today = computed(() => new Date().toISOString().split('T')[0]);
const formattedDate = computed(() => {
  const value = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return value.charAt(0).toUpperCase() + value.slice(1);
});

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return taskStore.projects.slice(0, 4);
  return taskStore.projects
    .filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    )
    .slice(0, 4);
});

const searchTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];
  return taskStore.tasks
    .filter(task => {
      const project = taskStore.projects.find(item => item.id === task.projectId);
      const assignees = (task.assigneeId || '')
        .split(',')
        .map(id => taskStore.users.find(user => user.id === id.trim())?.fullName || '')
        .join(' ');

      return [
        task.title,
        task.description,
        task.status,
        task.priority,
        project?.name || '',
        assignees,
        ...(task.labels || [])
      ].join(' ').toLowerCase().includes(query);
    })
    .slice(0, 6);
});

const burndownPoints = computed(() => {
  const total = Math.max(taskStore.tasks.length, 1);
  const remaining = taskStore.tasks.filter(task => task.status !== 'Done').length;
  const days = Array.from({ length: 7 }, (_, index) => index);

  return days.map(day => {
    const ideal = Math.max(total - Math.round((total / 6) * day), 0);
    const actual = Math.max(remaining + Math.round((remaining / 10) * (6 - day)) - (6 - day), 0);
    return {
      day,
      label: new Date(Date.now() - (6 - day) * 86400000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      ideal: Math.min(100, Math.round((ideal / total) * 100)),
      actual: Math.min(100, Math.round((actual / total) * 100))
    };
  });
});

const burndownPath = computed(() =>
  burndownPoints.value.map((point, index) => `${index === 0 ? 'M' : 'L'} ${index * 16.67} ${100 - point.actual}`).join(' ')
);

const burndownIdealPath = computed(() =>
  burndownPoints.value.map((point, index) => `${index === 0 ? 'M' : 'L'} ${index * 16.67} ${100 - point.ideal}`).join(' ')
);

function projectName(projectId: string) {
  return taskStore.projects.find(project => project.id === projectId)?.name || 'Dự án khác';
}

const boardStats = computed(() => [
  {
    label: 'Tổng task',
    value: taskStore.totalTasks,
    helper: 'Đang quản lý qua Task Service',
    icon: Briefcase,
    className: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  {
    label: 'Đang làm',
    value: taskStore.inProgressTasks,
    helper: 'Task ở cột In Progress',
    icon: Clock3,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    label: 'Quá hạn',
    value: taskStore.overdueTasks,
    helper: 'Cần xử lý trước buổi báo cáo',
    icon: AlertTriangle,
    className: 'bg-rose-50 text-rose-700 border-rose-100'
  },
  {
    label: 'Thành viên online',
    value: taskStore.onlineMembersCount,
    helper: 'Tài khoản đang hoạt động',
    icon: Users,
    className: 'bg-orange-50 text-orange-700 border-orange-100'
  }
]);

const serviceRows = computed(() => [
  { label: 'Nhóm 1', name: 'Project Service', ok: taskStore.projectServiceOnline, path: '/api/projects' },
  { label: 'Nhóm 2', name: 'Task Service', ok: taskStore.taskServiceOnline, path: '/api/tasks' },
  { label: 'Nhóm 3', name: 'Notify Service', ok: taskStore.notifyServiceOnline, path: '/api/notifications' }
]);

const todayTasks = computed(() => taskStore.todayTasks.slice(0, 6));
const recentNotifications = computed(() => taskStore.notifications.slice(0, 5));
const donePercent = computed(() => {
  if (taskStore.totalTasks === 0) return 0;
  const done = taskStore.tasks.filter(task => task.status === 'Done').length;
  return Math.round((done / taskStore.totalTasks) * 100);
});

function priorityLabel(task: Task) {
  if (task.priority === 'High') return 'Cao';
  if (task.priority === 'Medium') return 'Trung bình';
  return 'Thấp';
}

function priorityClass(task: Task) {
  if (task.priority === 'High') return 'bg-rose-50 text-rose-700';
  if (task.priority === 'Medium') return 'bg-amber-50 text-amber-700';
  return 'bg-emerald-50 text-emerald-700';
}

function openTaskDetails(taskId: string) {
  activeTaskId.value = taskId;
  isDetailModalOpen.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fb] pb-10">
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-xs font-black text-blue-600">SprintFlow Workspace</p>
          <h1 class="mt-1 text-2xl font-black text-slate-950">Tổng quan vận hành</h1>
          <p class="mt-1 text-sm font-semibold text-slate-500">
            {{ formattedDate }} · Xin chào {{ firstName }}, hôm nay có {{ taskStore.todayTasks.length }} việc cần theo dõi.
          </p>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <div class="relative md:w-80">
            <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm dự án hoặc công việc..."
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <router-link
            to="/notifications"
            class="relative flex size-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            title="Thông báo"
          >
            <Bell class="size-5" />
            <span v-if="taskStore.unreadNotificationCount > 0" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
              {{ taskStore.unreadNotificationCount > 99 ? '99+' : taskStore.unreadNotificationCount }}
            </span>
          </router-link>

          <button
            v-if="isManager"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
            @click="isCreateModalOpen = true"
          >
            <Plus class="size-5" />
            Tạo công việc
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-8">
      <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <p class="text-xs font-black text-cyan-600">SprintFlow Workspace</p>
              <h2 class="mt-2 max-w-3xl text-3xl font-black leading-tight text-slate-950">
                Theo dõi tiến độ dự án, deadline và việc cần xử lý trong ngày.
              </h2>
              <p class="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                Tập trung project đang chạy, task sắp hạn, bình luận mới và thông báo realtime để đội làm việc đúng kế hoạch.
              </p>
              <div class="mt-5 flex flex-wrap gap-3">
                <router-link to="/kanban" class="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                  Mở Kanban
                  <ChevronRight class="size-4" />
                </router-link>
                <router-link to="/settings" class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                  Kiểm tra Diagnostics
                </router-link>
              </div>
            </div>

            <div class="rounded-[1.4rem] bg-slate-950 p-5 text-white">
              <p class="text-sm font-black text-cyan-300">Tiến độ tổng</p>
              <div class="mt-5 flex items-end justify-between">
                <span class="text-5xl font-black">{{ donePercent }}%</span>
                <CheckCircle2 class="size-10 text-emerald-300" />
              </div>
              <div class="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <div class="h-full rounded-full bg-emerald-300 transition-all duration-500" :style="{ width: `${donePercent}%` }"></div>
              </div>
              <p class="mt-4 text-sm font-semibold leading-6 text-slate-300">
                {{ taskStore.tasks.filter(task => task.status === 'Done').length }} / {{ taskStore.totalTasks }} task đã hoàn thành.
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-black text-slate-950">Service Health</h2>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live</span>
          </div>
          <div class="mt-4 space-y-3">
            <div
              v-for="service in serviceRows"
              :key="service.name"
              class="flex items-center justify-between rounded-2xl border p-4"
              :class="service.ok ? 'border-emerald-100 bg-emerald-50/70' : 'border-rose-100 bg-rose-50/70'"
            >
              <div>
                <p class="text-xs font-black" :class="service.ok ? 'text-emerald-700' : 'text-rose-700'">{{ service.label }}</p>
                <p class="text-sm font-black text-slate-900">{{ service.name }}</p>
                <p class="text-xs font-semibold text-slate-500">{{ service.path }}</p>
              </div>
              <span class="size-3 rounded-full" :class="service.ok ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="stat in boardStats"
          :key="stat.label"
          class="rounded-[1.4rem] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
          :class="stat.className"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-black opacity-80">{{ stat.label }}</p>
              <p class="mt-2 text-4xl font-black">{{ stat.value }}</p>
            </div>
            <span class="flex size-12 items-center justify-center rounded-2xl bg-white/80">
              <component :is="stat.icon" class="size-6" />
            </span>
          </div>
          <p class="mt-4 text-xs font-bold opacity-80">{{ stat.helper }}</p>
        </article>
      </section>

      <section v-if="searchQuery.trim()" class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-black text-slate-950">Kết quả tìm kiếm</h2>
            <p class="text-sm font-semibold text-slate-500">Tìm trong tên dự án, task, người phụ trách, nhãn và trạng thái.</p>
          </div>
          <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
            {{ filteredProjects.length + searchTasks.length }} kết quả
          </span>
        </div>

        <div class="mt-4 grid gap-3 lg:grid-cols-2">
          <button
            v-for="task in searchTasks"
            :key="task.id"
            type="button"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70"
            @click="openTaskDetails(task.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-slate-950">{{ task.title }}</p>
                <p class="mt-1 text-xs font-bold text-slate-500">{{ projectName(task.projectId) }}</p>
              </div>
              <span class="shrink-0 rounded-full px-2 py-1 text-[11px] font-black" :class="priorityClass(task)">
                {{ priorityLabel(task) }}
              </span>
            </div>
            <p class="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{{ task.description || 'Chưa có mô tả chi tiết.' }}</p>
          </button>
        </div>
      </section>

      <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-black text-slate-950">Tiến độ Sprint</h2>
              <p class="mt-1 text-sm font-semibold text-slate-500">Khối lượng công việc còn lại trong 7 ngày gần nhất.</p>
            </div>
            <div class="flex gap-3 text-xs font-black">
              <span class="inline-flex items-center gap-1.5 text-slate-500"><span class="size-2 rounded-full bg-slate-300"></span>Kế hoạch</span>
              <span class="inline-flex items-center gap-1.5 text-indigo-700"><span class="size-2 rounded-full bg-indigo-600"></span>Thực tế</span>
            </div>
          </div>

          <div class="mt-5 h-72 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="burndownFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.24" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02" />
                </linearGradient>
              </defs>
              <path d="M 0 100 L 0 0 L 100 100 Z" fill="#e2e8f0" opacity="0.25" />
              <path :d="burndownIdealPath" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" />
              <path :d="`${burndownPath} L 100 100 L 0 100 Z`" fill="url(#burndownFill)" />
              <path :d="burndownPath" fill="none" stroke="#4f46e5" stroke-width="1.8" vector-effect="non-scaling-stroke" />
              <circle
                v-for="(point, index) in burndownPoints"
                :key="point.label"
                :cx="index * 16.67"
                :cy="100 - point.actual"
                r="1.2"
                fill="#4f46e5"
                vector-effect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div class="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-black text-slate-400">
            <span v-for="point in burndownPoints" :key="point.label">{{ point.label }}</span>
          </div>
        </div>

        <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-black text-slate-950">Tài khoản demo</h2>
          <div class="mt-4 space-y-3 text-sm">
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="font-black text-slate-900">Admin</p>
              <p class="mt-1 font-mono text-xs font-bold text-slate-500">admin@projecthub.com / admin123</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="font-black text-slate-900">Project Manager</p>
              <p class="mt-1 font-mono text-xs font-bold text-slate-500">pm@projecthub.com / 123456</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="font-black text-slate-900">Developer, Member, Viewer</p>
              <p class="mt-1 font-mono text-xs font-bold text-slate-500">dev@projecthub.com / member@projecthub.com / viewer@projecthub.com</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-black text-slate-950">Dự án đang tham gia</h2>
              <p class="mt-1 text-sm font-semibold text-slate-500">Theo dõi tiến độ từng project từ Project Service.</p>
            </div>
            <router-link to="/projects" class="hidden items-center gap-1 text-sm font-black text-blue-700 hover:text-blue-900 md:flex">
              Xem tất cả
              <ChevronRight class="size-4" />
            </router-link>
          </div>

          <div class="mt-5 grid gap-4 lg:grid-cols-2">
            <article
              v-for="project in filteredProjects"
              :key="project.id"
              class="rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <span class="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500">{{ project.statusText }}</span>
                  <h3 class="mt-3 text-lg font-black text-slate-950">{{ project.name }}</h3>
                  <p class="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">{{ project.description }}</p>
                </div>
                <div class="flex -space-x-2">
                  <img
                    v-for="member in project.members.slice(0, 3)"
                    :key="member.id"
                    :src="avatarFor(member.fullName, member.avatarUrl, '2563eb')"
                    @error="onAvatarError($event, member.fullName, '2563eb')"
                    :alt="member.fullName"
                    :title="member.fullName"
                    class="size-9 rounded-full border-2 border-white object-cover"
                  />
                </div>
              </div>

              <div class="mt-5">
                <div class="flex items-center justify-between text-xs font-black text-slate-500">
                  <span>Tiến độ</span>
                  <span>{{ taskStore.getProjectProgress(project.id) }}%</span>
                </div>
                <div class="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div class="h-full rounded-full bg-blue-600 transition-all duration-500" :style="{ width: `${taskStore.getProjectProgress(project.id)}%` }"></div>
                </div>
              </div>
            </article>

            <div v-if="filteredProjects.length === 0" class="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <p class="text-sm font-black text-slate-600">Không tìm thấy dự án phù hợp.</p>
            </div>
          </div>
        </div>

        <aside class="space-y-5">
          <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate-950">Việc hôm nay</h2>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{{ todayTasks.length }} việc</span>
            </div>

            <div class="mt-4 space-y-3">
              <button
                v-for="task in todayTasks"
                :key="task.id"
                type="button"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                @click="openTaskDetails(task.id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <p class="line-clamp-2 text-sm font-black leading-6 text-slate-900">{{ task.title }}</p>
                  <span class="shrink-0 rounded-full px-2 py-1 text-[11px] font-black" :class="priorityClass(task)">
                    {{ priorityLabel(task) }}
                  </span>
                </div>
                <p class="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <CalendarClock class="size-4" />
                  {{ task.dueDate === today ? 'Hôm nay' : task.dueDate }}
                </p>
              </button>

              <div v-if="todayTasks.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <CheckCircle2 class="mx-auto size-9 text-emerald-500" />
                <p class="mt-3 text-sm font-black text-slate-700">Không có task cần xử lý ngay.</p>
              </div>
            </div>
          </div>

          <div class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate-950">Thông báo mới</h2>
              <router-link to="/notifications" class="text-xs font-black text-rose-700">Mở</router-link>
            </div>
            <div class="mt-4 space-y-3">
              <article
                v-for="notification in recentNotifications"
                :key="notification.id"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p class="text-sm font-black text-slate-900">{{ notification.title }}</p>
                <p class="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{{ notification.message }}</p>
              </article>
              <div v-if="recentNotifications.length === 0" class="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-400">
                Chưa có thông báo.
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>

    <QuickTaskModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" />
    <TaskDetailModal :isOpen="isDetailModalOpen" :taskId="activeTaskId" @close="isDetailModalOpen = false" />
  </div>
</template>
