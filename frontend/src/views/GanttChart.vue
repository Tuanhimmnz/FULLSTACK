<script setup lang="ts">
import { computed, ref } from 'vue';
import { CalendarRange, ChevronDown, UserRound } from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import TaskDetailModal from '../components/TaskDetailModal.vue';
import { avatarFor, onAvatarError } from '../utils/avatar';
import type { Task } from '../services/mockData';

const taskStore = useTaskStore();
const selectedProjectId = ref('all');
const zoomLevel = ref<'day' | 'week'>('day');
const selectedTaskId = ref<string | undefined>();
const isDetailOpen = ref(false);

const dayWidth = computed(() => (zoomLevel.value === 'day' ? 42 : 16));
const rowHeight = 68;

const filteredTasks = computed(() => {
  const tasks = selectedProjectId.value === 'all'
    ? taskStore.tasks
    : taskStore.tasks.filter(task => task.projectId === selectedProjectId.value);

  return [...tasks].sort((a, b) => toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime());
});

function toDate(value?: string) {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

function diffDays(a: Date, b: Date) {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((end - start) / 86400000);
}

const timelineRange = computed(() => {
  if (filteredTasks.value.length === 0) {
    return {
      start: addDays(new Date(), -7),
      end: addDays(new Date(), 21)
    };
  }

  let start = addDays(new Date(), -7);
  let end = addDays(new Date(), 21);

  filteredTasks.value.forEach(task => {
    const taskStart = toDate(task.createdAt);
    const taskEnd = task.dueDate ? toDate(task.dueDate) : addDays(taskStart, 3);
    if (taskStart < start) start = addDays(taskStart, -3);
    if (taskEnd > end) end = addDays(taskEnd, 7);
  });

  return { start, end };
});

const timelineDays = computed(() => {
  const days = [];
  let cursor = new Date(timelineRange.value.start);
  const end = timelineRange.value.end;
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }
  return days;
});

const timelineMonths = computed(() => {
  const map = new Map<string, { key: string; label: string; days: number }>();
  timelineDays.value.forEach(day => {
    const key = `${day.getFullYear()}-${day.getMonth()}`;
    const label = day.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    const row = map.get(key) || { key, label, days: 0 };
    row.days += 1;
    map.set(key, row);
  });
  return Array.from(map.values());
});

const todayIndex = computed(() => diffDays(timelineRange.value.start, new Date()));

function getTaskPosition(task: Task) {
  const start = toDate(task.createdAt);
  const due = task.dueDate ? toDate(task.dueDate) : addDays(start, 3);
  const offset = Math.max(diffDays(timelineRange.value.start, start), 0);
  const length = Math.max(diffDays(start, due) + 1, 1);
  return {
    left: offset * dayWidth.value,
    width: Math.max(length * dayWidth.value, 42)
  };
}

function isToday(date: Date) {
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function statusClass(status: Task['status']) {
  if (status === 'Done') return 'bg-emerald-500 text-white';
  if (status === 'Review') return 'bg-amber-500 text-white';
  if (status === 'InProgress') return 'bg-indigo-500 text-white';
  if (status === 'Backlog') return 'bg-slate-500 text-white';
  return 'bg-blue-500 text-white';
}

function statusBadge(status: Task['status']) {
  if (status === 'Done') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Review') return 'bg-amber-50 text-amber-700';
  if (status === 'InProgress') return 'bg-indigo-50 text-indigo-700';
  if (status === 'Backlog') return 'bg-slate-100 text-slate-600';
  return 'bg-blue-50 text-blue-700';
}

function getAssignee(task: Task) {
  const firstId = (task.assigneeId || '').split(',').map(id => id.trim()).find(Boolean);
  return taskStore.users.find(user => user.id === firstId);
}

function openTask(task: Task) {
  selectedTaskId.value = task.id;
  isDetailOpen.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-emerald-50/40 px-4 py-6 lg:px-8">
    <div class="mx-auto max-w-[1600px] space-y-6">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex size-14 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200">
            <CalendarRange class="size-8" />
          </span>
          <div>
            <p class="text-xs font-black uppercase text-emerald-700">Sprint timeline</p>
            <h1 class="mt-1 text-3xl font-black text-slate-950">Tiến độ dự án (Gantt)</h1>
            <p class="mt-1 text-sm font-semibold text-slate-500">Theo dõi lịch triển khai, deadline và tải công việc theo từng người.</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-sm md:flex-row md:items-center">
          <label class="relative">
            <select
              v-model="selectedProjectId"
              class="w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-4 pr-10 text-sm font-black text-slate-700 outline-none md:w-72"
            >
              <option value="all">Tất cả dự án</option>
              <option v-for="project in taskStore.projects" :key="project.id" :value="project.id">{{ project.name }}</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </label>

          <div class="flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-black transition"
              :class="zoomLevel === 'day' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
              @click="zoomLevel = 'day'"
            >
              Ngày
            </button>
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-black transition"
              :class="zoomLevel === 'week' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
              @click="zoomLevel = 'week'"
            >
              Tuần
            </button>
          </div>
        </div>
      </header>

      <section class="overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 shadow-2xl shadow-emerald-100/60 backdrop-blur-xl">
        <div v-if="filteredTasks.length === 0" class="flex min-h-[28rem] flex-col items-center justify-center text-center">
          <CalendarRange class="size-16 text-slate-300" />
          <p class="mt-4 text-xl font-black text-slate-700">Chưa có công việc nào</p>
          <p class="mt-2 text-sm font-semibold text-slate-400">Tạo task trong Kanban hoặc Tasks để hiển thị trên Gantt.</p>
        </div>

        <div v-else class="grid max-h-[72vh] min-h-[34rem] grid-cols-[20rem_minmax(0,1fr)] overflow-hidden">
          <aside class="border-r border-slate-200 bg-white">
            <div class="grid h-16 grid-cols-[minmax(0,1fr)_5rem] items-center border-b border-slate-100 px-5 text-xs font-black uppercase text-slate-400">
              <span>Tên công việc</span>
              <span class="text-right">Người làm</span>
            </div>
            <div class="overflow-y-auto" :style="{ maxHeight: `${filteredTasks.length * rowHeight}px` }">
              <button
                v-for="task in filteredTasks"
                :key="task.id"
                type="button"
                class="grid w-full grid-cols-[minmax(0,1fr)_5rem] items-center border-b border-slate-100 px-5 text-left transition hover:bg-emerald-50/70"
                :style="{ height: `${rowHeight}px` }"
                @click="openTask(task)"
              >
                <div class="min-w-0">
                  <p class="truncate text-sm font-black text-slate-900">{{ task.title }}</p>
                  <span class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase" :class="statusBadge(task.status)">
                    {{ task.status }}
                  </span>
                </div>
                <div class="flex justify-end">
                  <img
                    v-if="getAssignee(task)"
                    :src="avatarFor(getAssignee(task)?.fullName, getAssignee(task)?.avatarUrl, '6366f1')"
                    @error="onAvatarError($event, getAssignee(task)?.fullName || 'User', '6366f1')"
                    class="size-8 rounded-full object-cover ring-2 ring-white"
                    :alt="getAssignee(task)?.fullName"
                  />
                  <span v-else class="flex size-8 items-center justify-center rounded-full border border-dashed border-slate-200 bg-slate-50">
                    <UserRound class="size-4 text-slate-400" />
                  </span>
                </div>
              </button>
            </div>
          </aside>

          <div class="overflow-auto">
            <div class="min-w-max">
              <div class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div class="flex h-8">
                  <div
                    v-for="month in timelineMonths"
                    :key="month.key"
                    class="flex items-center justify-center border-r border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600"
                    :style="{ width: `${month.days * dayWidth}px` }"
                  >
                    {{ month.label }}
                  </div>
                </div>
                <div class="flex h-8">
                  <div
                    v-for="day in timelineDays"
                    :key="day.toISOString()"
                    class="flex items-center justify-center border-r border-slate-100 text-[11px] font-black"
                    :class="isToday(day) ? 'bg-indigo-600 text-white' : isWeekend(day) ? 'bg-slate-50 text-slate-400' : 'text-slate-500'"
                    :style="{ width: `${dayWidth}px` }"
                  >
                    {{ zoomLevel === 'day' ? day.getDate() : (day.getDay() === 1 ? day.getDate() : '') }}
                  </div>
                </div>
              </div>

              <div class="relative" :style="{ height: `${filteredTasks.length * rowHeight}px`, width: `${timelineDays.length * dayWidth}px` }">
                <div class="absolute inset-0 flex">
                  <div
                    v-for="day in timelineDays"
                    :key="`grid-${day.toISOString()}`"
                    class="h-full shrink-0 border-r border-slate-100"
                    :class="isWeekend(day) ? 'bg-slate-100/30' : ''"
                    :style="{ width: `${dayWidth}px` }"
                  ></div>
                </div>

                <div
                  v-if="todayIndex >= 0"
                  class="absolute top-0 h-full bg-indigo-500/10 ring-1 ring-indigo-500/20"
                  :style="{ left: `${todayIndex * dayWidth}px`, width: `${dayWidth}px` }"
                ></div>

                <button
                  v-for="(task, index) in filteredTasks"
                  :key="`bar-${task.id}`"
                  type="button"
                  class="absolute flex h-9 items-center overflow-hidden rounded-xl px-3 text-left text-xs font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  :class="statusClass(task.status)"
                  :style="{
                    left: `${getTaskPosition(task).left}px`,
                    top: `${index * rowHeight + 16}px`,
                    width: `${getTaskPosition(task).width}px`
                  }"
                  :title="`${task.title} · ${task.status} · ${task.createdAt} -> ${task.dueDate || 'Dự kiến'}`"
                  @click="openTask(task)"
                >
                  <span class="truncate">{{ task.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <TaskDetailModal :isOpen="isDetailOpen" :taskId="selectedTaskId" @close="isDetailOpen = false" />
  </div>
</template>
