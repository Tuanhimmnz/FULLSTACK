<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Crown, Download, PieChart, Users } from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import { avatarFor, onAvatarError } from '../utils/avatar';
import type { Task, User } from '../services/mockData';
import { downloadCsv } from '../utils/csv';

const taskStore = useTaskStore();

const today = computed(() => new Date().toISOString().split('T')[0]);

const activeTasks = computed(() => taskStore.tasks.filter(task => task.status !== 'Done'));
const overdueTasks = computed(() => activeTasks.value.filter(task => task.dueDate && task.dueDate < today.value));
const completedTasks = computed(() => taskStore.tasks.filter(task => task.status === 'Done'));

const statusRows = computed(() => {
  const rows = [
    { key: 'Backlog', label: 'Backlog', color: '#94a3b8', count: 0 },
    { key: 'ToDo', label: 'To do', color: '#3b82f6', count: 0 },
    { key: 'InProgress', label: 'Đang làm', color: '#0ea5e9', count: 0 },
    { key: 'Review', label: 'Review', color: '#f59e0b', count: 0 },
    { key: 'Done', label: 'Done', color: '#10b981', count: 0 }
  ];

  taskStore.tasks.forEach(task => {
    const row = rows.find(item => item.key === task.status);
    if (row) row.count += 1;
  });

  return rows;
});

const donutStyle = computed(() => {
  const total = Math.max(taskStore.tasks.length, 1);
  let cursor = 0;
  const stops = statusRows.value.map(row => {
    const start = cursor;
    cursor += (row.count / total) * 360;
    return `${row.color} ${start}deg ${cursor}deg`;
  });

  return {
    background: `conic-gradient(${stops.join(', ')})`
  };
});

function assignees(task: Task) {
  return (task.assigneeId || '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
}

function userName(user?: User) {
  return user?.fullName || 'Chưa phân công';
}

const resourceRows = computed(() => {
  const map = new Map<string, { user: User; active: number; overdue: number; completed: number; estimated: number; logged: number }>();
  taskStore.users.forEach(user => {
    map.set(user.id, { user, active: 0, overdue: 0, completed: 0, estimated: 0, logged: 0 });
  });

  taskStore.tasks.forEach(task => {
    const ids = assignees(task);
    ids.forEach(id => {
      const row = map.get(id);
      if (!row) return;
      if (task.status === 'Done') row.completed += 1;
      else row.active += 1;
      if (task.status !== 'Done' && task.dueDate && task.dueDate < today.value) row.overdue += 1;
      row.estimated += task.estimatedHours || 0;
      row.logged += task.loggedHours || 0;
    });
  });

  return Array.from(map.values())
    .filter(row => row.active > 0 || row.completed > 0 || row.overdue > 0)
    .sort((a, b) => (b.active + b.overdue * 2) - (a.active + a.overdue * 2));
});

const leaderboard = computed(() =>
  [...resourceRows.value]
    .sort((a, b) => b.completed - a.completed || a.overdue - b.overdue)
    .slice(0, 5)
);

const roleWorkload = computed(() => {
  const rows = new Map<string, { role: string; done: number; active: number; overdue: number }>();

  taskStore.tasks.forEach(task => {
    assignees(task).forEach(id => {
      const user = taskStore.users.find(item => item.id === id);
      const role = user?.role || 'Unassigned';
      const row = rows.get(role) || { role, done: 0, active: 0, overdue: 0 };
      if (task.status === 'Done') row.done += 1;
      else if (task.dueDate && task.dueDate < today.value) row.overdue += 1;
      else row.active += 1;
      rows.set(role, row);
    });
  });

  return Array.from(rows.values()).sort((a, b) => (b.done + b.active + b.overdue) - (a.done + a.active + a.overdue));
});

function workloadPercent(row: { active: number; overdue: number }) {
  return Math.min(((row.active + row.overdue) / 10) * 100, 100);
}

function maxRoleTotal() {
  return Math.max(...roleWorkload.value.map(row => row.done + row.active + row.overdue), 1);
}

function exportAnalytics() {
  downloadCsv(`sprintflow-analytics-${new Date().toISOString().slice(0, 10)}`, resourceRows.value, [
    { key: 'user', header: 'Nhân sự', value: row => row.user.fullName },
    { key: 'role', header: 'Vai trò', value: row => row.user.role },
    { key: 'active', header: 'Đang xử lý' },
    { key: 'overdue', header: 'Trễ hạn' },
    { key: 'completed', header: 'Hoàn thành' },
    { key: 'estimated', header: 'Ước lượng giờ' },
    { key: 'logged', header: 'Đã log giờ' }
  ]);
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fb] px-4 py-6 lg:px-8">
    <div class="mx-auto max-w-[1500px] space-y-6">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex size-14 items-center justify-center rounded-3xl bg-violet-600 text-white shadow-xl shadow-violet-200">
            <BarChart3 class="size-8" />
          </span>
          <div>
            <p class="text-xs font-black uppercase text-violet-600">SprintFlow Analytics</p>
            <h1 class="mt-1 text-3xl font-black text-slate-950">Thống kê & nguồn lực</h1>
            <p class="mt-1 text-sm font-semibold text-slate-500">Theo dõi tình trạng dự án, khối lượng nhân sự và năng suất từng vai trò.</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
            @click="exportAnalytics"
          >
            <Download class="size-4" />
            Tải báo cáo
          </button>
          <router-link to="/tasks" class="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
            Mở danh sách task
          </router-link>
        </div>
      </header>

      <section class="grid gap-4 md:grid-cols-3">
        <article class="rounded-[1.4rem] border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div class="flex items-center gap-5">
            <span class="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Clock3 class="size-8" />
            </span>
            <div>
              <p class="text-xs font-black uppercase text-blue-500">Đang thực hiện</p>
              <p class="mt-1 text-4xl font-black text-slate-950">{{ activeTasks.length }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-[1.4rem] border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div class="flex items-center gap-5">
            <span class="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <AlertTriangle class="size-8" />
            </span>
            <div>
              <p class="text-xs font-black uppercase text-rose-500">Trễ hạn</p>
              <p class="mt-1 text-4xl font-black text-slate-950">{{ overdueTasks.length }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-[1.4rem] border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div class="flex items-center gap-5">
            <span class="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 class="size-8" />
            </span>
            <div>
              <p class="text-xs font-black uppercase text-emerald-600">Đã hoàn thành</p>
              <p class="mt-1 text-4xl font-black text-slate-950">{{ completedTasks.length }}</p>
            </div>
          </div>
        </article>
      </section>

      <section class="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <article class="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <PieChart class="size-5" />
            </span>
            <h2 class="text-lg font-black text-slate-950">Tổng quan trạng thái</h2>
          </div>

          <div class="mt-6 flex flex-col items-center">
            <div class="relative size-56 rounded-full" :style="donutStyle">
              <div class="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span class="text-4xl font-black text-slate-950">{{ taskStore.tasks.length }}</span>
                <span class="text-xs font-black uppercase text-slate-400">tasks</span>
              </div>
            </div>
            <div class="mt-6 grid w-full grid-cols-2 gap-2 text-xs font-bold text-slate-500">
              <div v-for="row in statusRows" :key="row.key" class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span class="size-2.5 rounded-full" :style="{ backgroundColor: row.color }"></span>
                <span class="flex-1">{{ row.label }}</span>
                <span class="font-black text-slate-900">{{ row.count }}</span>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Users class="size-5" />
            </span>
            <h2 class="text-lg font-black text-slate-950">Biểu đồ khối lượng theo vai trò</h2>
          </div>

          <div class="mt-6 space-y-5">
            <div v-for="row in roleWorkload" :key="row.role" class="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)_4rem] md:items-center">
              <p class="truncate text-sm font-black text-slate-800">{{ row.role }}</p>
              <div class="flex h-9 overflow-hidden rounded-2xl bg-slate-100">
                <div class="bg-emerald-500" :style="{ width: `${(row.done / maxRoleTotal()) * 100}%` }" title="Done"></div>
                <div class="bg-blue-500" :style="{ width: `${(row.active / maxRoleTotal()) * 100}%` }" title="Active"></div>
                <div class="bg-rose-500" :style="{ width: `${(row.overdue / maxRoleTotal()) * 100}%` }" title="Overdue"></div>
              </div>
              <p class="text-right text-sm font-black text-slate-500">{{ row.done + row.active + row.overdue }}</p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3 text-xs font-black">
            <span class="inline-flex items-center gap-2 text-emerald-700"><span class="size-3 rounded-full bg-emerald-500"></span>Hoàn thành</span>
            <span class="inline-flex items-center gap-2 text-blue-700"><span class="size-3 rounded-full bg-blue-500"></span>Đang làm</span>
            <span class="inline-flex items-center gap-2 text-rose-700"><span class="size-3 rounded-full bg-rose-500"></span>Trễ hạn</span>
          </div>
        </article>
      </section>

      <section class="grid gap-5 xl:grid-cols-2">
        <article class="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-black text-slate-950">Chi tiết nguồn lực đang xử lý</h2>
          <div class="mt-5 space-y-5">
            <div v-for="row in resourceRows.slice(0, 8)" :key="row.user.id">
              <div class="mb-2 flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <img
                    :src="avatarFor(userName(row.user), row.user.avatarUrl, '6366f1')"
                    @error="onAvatarError($event, userName(row.user), '6366f1')"
                    class="size-10 rounded-2xl object-cover"
                    :alt="row.user.fullName"
                  />
                  <div class="min-w-0">
                    <p class="truncate text-sm font-black text-slate-900">{{ row.user.fullName }}</p>
                    <p class="truncate text-xs font-bold text-slate-500">{{ row.user.role }} · {{ row.logged }}/{{ row.estimated }}h</p>
                  </div>
                </div>
                <span class="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{{ row.active }} task</span>
              </div>
              <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="row.overdue > 0 ? 'bg-gradient-to-r from-orange-400 to-rose-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'"
                  :style="{ width: `${workloadPercent(row)}%` }"
                ></div>
              </div>
              <p v-if="row.overdue > 0" class="mt-1 text-right text-xs font-bold text-rose-600">{{ row.overdue }} task trễ hạn cần xử lý</p>
            </div>
          </div>
        </article>

        <article class="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="flex items-center gap-2 text-lg font-black text-slate-950">
            <Crown class="size-5 text-amber-500" />
            Bảng vàng năng suất
          </h2>
          <div class="mt-5 space-y-4">
            <div
              v-for="(row, index) in leaderboard"
              :key="row.user.id"
              class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <span class="flex size-11 items-center justify-center rounded-2xl font-black" :class="index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-500'">
                #{{ index + 1 }}
              </span>
              <img
                :src="avatarFor(row.user.fullName, row.user.avatarUrl, '0ea5e9')"
                @error="onAvatarError($event, row.user.fullName, '0ea5e9')"
                class="size-12 rounded-2xl object-cover"
                :alt="row.user.fullName"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-slate-950">{{ row.user.fullName }}</p>
                <div class="mt-2 flex flex-wrap gap-2 text-xs font-black">
                  <span class="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{{ row.completed }} hoàn thành</span>
                  <span class="rounded-full bg-rose-50 px-2 py-1 text-rose-700">{{ row.overdue }} trễ hạn</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
