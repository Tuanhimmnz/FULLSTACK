<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CalendarDays, CheckCircle2, Gauge, Plus, Search, Users } from '@lucide/vue';
import type { Task } from '../services/mockData';
import { useTaskStore } from '../stores/taskStore';
import TaskCard from '../components/TaskCard.vue';
import QuickTaskModal from '../components/QuickTaskModal.vue';
import TaskDetailModal from '../components/TaskDetailModal.vue';

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.init();
});

const selectedProjectId = ref('all');
const searchQuery = ref('');
const activeTab = ref<Task['status'] | 'all'>('all');
const dragOverColumn = ref<Task['status'] | null>(null);
const isCreateModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const activeTaskId = ref<string | undefined>(undefined);

const columns = [
  { status: 'Backlog' as const, name: 'Tích lũy', dot: 'bg-rose-400', panel: 'bg-rose-50/50' },
  { status: 'ToDo' as const, name: 'Cần làm', dot: 'bg-slate-400', panel: 'bg-slate-50' },
  { status: 'InProgress' as const, name: 'Đang làm', dot: 'bg-emerald-500', panel: 'bg-emerald-50/50' },
  { status: 'Review' as const, name: 'Kiểm tra', dot: 'bg-amber-500', panel: 'bg-amber-50/50' },
  { status: 'Done' as const, name: 'Hoàn thành', dot: 'bg-blue-600', panel: 'bg-blue-50/50' }
];

const isManager = computed(() => ['Project Manager', 'Admin'].includes(taskStore.currentUser?.role));
const isViewer = computed(() => taskStore.currentUser?.role === 'Viewer');

const filteredTasks = computed(() => {
  let result = taskStore.tasks;

  if (selectedProjectId.value !== 'all') {
    result = result.filter(task => task.projectId === selectedProjectId.value);
  }

  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    result = result.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }

  return result;
});

const doneTasksCount = computed(() => filteredTasks.value.filter(task => task.status === 'Done').length);
const projectProgressPercent = computed(() => {
  if (filteredTasks.value.length === 0) return 0;
  return Math.round((doneTasksCount.value / filteredTasks.value.length) * 100);
});

const activeTask = computed(() => taskStore.tasks.find(task => task.id === activeTaskId.value));
const selectedProject = computed(() => {
  if (selectedProjectId.value === 'all') return null;
  return taskStore.projects.find(project => project.id === selectedProjectId.value) || null;
});

function getTasksByStatus(status: Task['status']) {
  return filteredTasks.value.filter(task => task.status === status);
}

function onDragEnter(_event: DragEvent, status: Task['status']) {
  dragOverColumn.value = status;
}

function onDragLeave(_event: DragEvent, status: Task['status']) {
  if (dragOverColumn.value === status) {
    dragOverColumn.value = null;
  }
}

function onDrop(event: DragEvent, status: Task['status']) {
  dragOverColumn.value = null;
  if (isViewer.value) return;
  const taskId = event.dataTransfer?.getData('text/plain');
  if (taskId) {
    taskStore.updateTaskStatus(taskId, status);
  }
}

function openCreateModal() {
  isCreateModalOpen.value = true;
}

function openTaskDetails(taskId: string) {
  activeTaskId.value = taskId;
  isDetailModalOpen.value = true;
}

function focusTask(taskId: string) {
  activeTaskId.value = taskId;
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fb]">
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-xs font-black text-blue-600">Task & Kanban Service</p>
          <h1 class="mt-1 text-2xl font-black text-slate-950">Bảng điều phối công việc</h1>
          <p class="mt-1 text-sm font-semibold text-slate-500">
            Kéo thả task, đổi trạng thái và mở chi tiết để demo comment/notification nhóm 3.
          </p>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <div class="relative min-w-0 md:w-72">
            <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm nhanh công việc..."
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <select
            v-model="selectedProjectId"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-blue-400"
          >
            <option value="all">Tất cả dự án</option>
            <option v-for="project in taskStore.projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>

          <button
            v-if="isManager"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
            @click="openCreateModal"
          >
            <Plus class="size-5" />
            Tạo công việc
          </button>
        </div>
      </div>
    </header>

    <section class="border-b border-slate-200/80 bg-white/70 px-4 py-4 backdrop-blur lg:px-8">
      <div class="grid gap-3 md:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="flex items-center gap-2 text-xs font-black text-slate-500"><Gauge class="size-4 text-blue-600" /> Tổng task</p>
          <p class="mt-2 text-2xl font-black text-slate-950">{{ filteredTasks.length }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p class="flex items-center gap-2 text-xs font-black text-emerald-700"><CheckCircle2 class="size-4" /> Hoàn thành</p>
          <p class="mt-2 text-2xl font-black text-emerald-700">{{ doneTasksCount }}</p>
        </div>
        <div class="rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p class="flex items-center gap-2 text-xs font-black text-orange-700"><CalendarDays class="size-4" /> Tiến độ</p>
          <div class="mt-3 flex items-center gap-3">
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-white">
              <div class="h-full rounded-full bg-orange-500 transition-all duration-500" :style="{ width: `${projectProgressPercent}%` }"></div>
            </div>
            <span class="text-sm font-black text-orange-700">{{ projectProgressPercent }}%</span>
          </div>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p class="flex items-center gap-2 text-xs font-black text-blue-700"><Users class="size-4" /> Phạm vi</p>
          <p class="mt-2 truncate text-sm font-black text-blue-800">
            {{ selectedProject ? selectedProject.name : 'Toàn bộ workspace' }}
          </p>
        </div>
      </div>
    </section>

    <div class="flex gap-3 overflow-x-auto border-b border-slate-200 bg-[#f5f7fb] px-4 py-3 lg:hidden">
      <button
        v-for="col in columns"
        :key="col.status"
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black transition"
        :class="activeTab === col.status ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600'"
        @click="activeTab = col.status"
      >
        <span class="size-2 rounded-full" :class="col.dot"></span>
        {{ col.name }}
        <span class="rounded-full bg-white/20 px-2">{{ getTasksByStatus(col.status).length }}</span>
      </button>
      <button
        type="button"
        class="inline-flex shrink-0 rounded-2xl border px-4 py-2 text-xs font-black transition"
        :class="activeTab === 'all' ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600'"
        @click="activeTab = 'all'"
      >
        Tất cả
      </button>
    </div>

    <main class="grid gap-5 px-4 py-5 xl:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
      <section class="overflow-x-auto pb-3">
        <div class="grid min-w-[84rem] grid-cols-5 gap-4">
          <div
            v-for="col in columns"
            :key="col.status"
            class="flex min-h-[38rem] flex-col rounded-[1.4rem] border border-slate-200 p-4 transition"
            :class="[
              col.panel,
              dragOverColumn === col.status ? 'scale-[1.01] border-blue-400 ring-4 ring-blue-100' : '',
              activeTab !== 'all' && activeTab !== col.status ? 'hidden lg:flex' : 'flex'
            ]"
            @dragover.prevent
            @dragenter="onDragEnter($event, col.status)"
            @dragleave="onDragLeave($event, col.status)"
            @drop="onDrop($event, col.status)"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full" :class="col.dot"></span>
                <h2 class="text-sm font-black text-slate-800">{{ col.name }}</h2>
              </div>
              <span class="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 shadow-sm">
                {{ getTasksByStatus(col.status).length }}
              </span>
            </div>

            <TransitionGroup name="kanban-card" tag="div" class="flex-1 space-y-3">
              <TaskCard
                v-for="task in getTasksByStatus(col.status)"
                :key="task.id"
                :task="task"
                @click-detail="focusTask"
                @dblclick="openTaskDetails(task.id)"
              />
            </TransitionGroup>

            <div
              v-if="getTasksByStatus(col.status).length === 0"
              class="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-xs font-bold text-slate-400"
            >
              Kéo thả hoặc thêm việc vào đây
            </div>

            <button
              v-if="isManager"
              type="button"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/70 py-3 text-xs font-black text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              @click="openCreateModal"
            >
              <Plus class="size-4" />
              Thêm công việc
            </button>
          </div>
        </div>
      </section>

      <aside class="hidden xl:block">
        <div class="sticky top-28 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
          <p class="text-xs font-black text-blue-600">Board Detail</p>
          <h2 class="mt-1 text-xl font-black text-slate-950">Chi tiết nhanh</h2>

          <div v-if="activeTask" class="mt-5 space-y-4">
            <div>
              <p class="text-xs font-black text-slate-400">Task đang chọn</p>
              <h3 class="mt-1 text-lg font-black leading-7 text-slate-950">{{ activeTask.title }}</h3>
              <p class="mt-2 text-sm font-semibold leading-6 text-slate-500">{{ activeTask.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-2xl bg-slate-50 p-3">
                <p class="text-xs font-black text-slate-400">Trạng thái</p>
                <p class="mt-1 text-sm font-black text-slate-900">{{ columns.find(c => c.status === activeTask?.status)?.name }}</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-3">
                <p class="text-xs font-black text-slate-400">Deadline</p>
                <p class="mt-1 text-sm font-black text-slate-900">{{ activeTask.dueDate }}</p>
              </div>
            </div>

            <button
              type="button"
              class="w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              @click="openTaskDetails(activeTask.id)"
            >
              Mở task detail, comment và worklog
            </button>
          </div>

          <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p class="text-sm font-black text-slate-700">Chọn một task trên board</p>
            <p class="mt-2 text-xs font-semibold leading-5 text-slate-500">
              Panel này giúp thầy thấy board detail rõ ràng; double click task để mở modal chi tiết.
            </p>
          </div>
        </div>
      </aside>
    </main>

    <QuickTaskModal
      :isOpen="isCreateModalOpen"
      :preselectedProjectId="selectedProjectId !== 'all' ? selectedProjectId : undefined"
      @close="isCreateModalOpen = false"
    />
    <TaskDetailModal
      :isOpen="isDetailModalOpen"
      :taskId="activeTaskId"
      @close="isDetailModalOpen = false"
    />
  </div>
</template>

<style scoped>
.kanban-card-move,
.kanban-card-enter-active,
.kanban-card-leave-active {
  transition: all 0.24s ease;
}

.kanban-card-enter-from,
.kanban-card-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
