<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-white px-4 py-6 lg:px-8">
    <div class="mx-auto max-w-[1540px] space-y-7">
      <header class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-bold">
            <span class="text-slate-400">SprintFlow</span>
            <span class="text-slate-300">/</span>
            <span class="text-slate-950">My Task</span>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-wider text-emerald-600">Task & Kanban Service</p>
            <h1 class="mt-1 text-3xl font-black text-slate-950">My Task</h1>
            <p class="mt-1 max-w-2xl text-sm font-semibold text-slate-500">
              Lịch công việc, bảng kéo thả trạng thái và chi tiết task đều đi qua API Gateway.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div class="relative min-w-0 lg:w-72">
            <Search class="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search task..."
              class="h-12 w-full rounded-2xl border border-white/80 bg-white/80 pl-11 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none backdrop-blur focus:border-slate-900"
            />
          </div>

          <div class="hidden items-center gap-2 text-sm font-bold text-slate-400 sm:flex">
            <Clock class="size-4" />
            <span>{{ refreshLabel }}</span>
          </div>

          <div class="flex -space-x-2">
            <img
              v-for="user in onlinePreview"
              :key="user.id"
              :src="avatarFor(user.fullName, user.avatarUrl, '0ea5e9')"
              @error="onAvatarError($event, user.fullName, '0ea5e9')"
              :title="user.fullName"
              class="size-9 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <span
              v-if="extraOnlineCount > 0"
              class="flex size-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-black text-slate-600 shadow-sm"
            >
              +{{ extraOnlineCount }}
            </span>
          </div>

          <button
            type="button"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-900"
            @click="openQuickTask('ToDo')"
          >
            <Plus class="size-4" />
            Tạo công việc
          </button>

          <button
            type="button"
            class="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-400 shadow-sm transition hover:text-slate-950"
            title="Tùy chọn"
          >
            <MoreHorizontal class="size-5" />
          </button>
        </div>
      </header>

      <section class="rounded-[1.6rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div class="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-black text-slate-950">Task Calendar</h2>
            <p class="mt-1 text-xs font-semibold text-slate-400">Kéo task vào ngày để cập nhật deadline.</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
              @click="calendarOffset -= 1"
            >
              <ChevronLeft class="size-4" />
            </button>
            <button
              type="button"
              class="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 transition hover:text-slate-950"
              @click="calendarOffset = 0"
            >
              Today
            </button>
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
              @click="calendarOffset += 1"
            >
              <ChevronRight class="size-4" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
          <article
            v-for="day in timelineDays"
            :key="day.dateStr"
            class="min-h-28 rounded-2xl border p-3 transition"
            :class="[
              day.isToday ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white/75 text-slate-700',
              dragHoverDate === day.dateStr ? 'ring-2 ring-emerald-400' : ''
            ]"
            @dragover.prevent
            @dragenter.prevent="dragHoverDate = day.dateStr"
            @dragleave="dragHoverDate = null"
            @drop="onDropTimeline($event, day.dateStr)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-wider" :class="day.isToday ? 'text-white/60' : 'text-slate-400'">
                  {{ day.weekday }}
                </p>
                <p class="mt-1 text-lg font-black">{{ day.label }}</p>
              </div>
              <CalendarIcon class="size-4" :class="day.isToday ? 'text-white/70' : 'text-slate-300'" />
            </div>
            <div class="mt-3 space-y-2">
              <button
                v-for="task in getTasksForDate(day.dateStr).slice(0, 3)"
                :key="task.id"
                type="button"
                draggable="true"
                class="block w-full truncate rounded-full px-3 py-1.5 text-left text-[11px] font-black shadow-sm transition hover:-translate-y-0.5"
                :class="day.isToday ? 'bg-white text-slate-950' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'"
                @dragstart="onDragStart($event, task)"
                @click="openTaskDetail(task)"
              >
                {{ shortTaskTitle(task.title) }}
              </button>
              <p
                v-if="getTasksForDate(day.dateStr).length > 3"
                class="text-[11px] font-bold"
                :class="day.isToday ? 'text-white/60' : 'text-slate-400'"
              >
                +{{ getTasksForDate(day.dateStr).length - 3 }} task khác
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="item in stats" :key="item.label" class="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-black text-slate-500">{{ item.label }}</p>
            <component :is="item.icon" class="size-5" :class="item.color" />
          </div>
          <p class="mt-3 text-4xl font-black text-slate-950">{{ item.value }}</p>
        </article>
      </section>

      <section class="space-y-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-950">All Task</h2>
            <p class="mt-1 text-sm font-semibold text-slate-500">Drag & drop để đổi trạng thái, click để mở comment và worklog.</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select v-model="filterProject" class="h-11 rounded-2xl border border-white/80 bg-white/80 px-4 text-sm font-black text-slate-700 shadow-sm outline-none focus:border-slate-900">
              <option value="all">Tất cả dự án</option>
              <option v-for="project in taskStore.projects" :key="project.id" :value="project.id">{{ project.name }}</option>
            </select>
            <div class="flex rounded-2xl border border-white/80 bg-white/80 p-1 shadow-sm">
              <button type="button" class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-50">
                <LayoutGrid class="size-3.5" />
                Spreadsheet
              </button>
              <button type="button" class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-50">
                <CalendarIcon class="size-3.5" />
                Timeline
              </button>
              <button type="button" class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-950 shadow-sm">
                <KanbanIcon class="size-3.5" />
                Kanban
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-5 overflow-x-auto pb-4">
          <div
            v-for="column in columns"
            :key="column.status"
            class="w-[19rem] shrink-0 rounded-[1.6rem] border p-4 transition"
            :class="[column.surface, dragHoverStatus === column.status ? 'ring-2 ring-slate-400' : '']"
            @dragover.prevent
            @dragenter.prevent="dragHoverStatus = column.status"
            @dragleave="dragHoverStatus = null"
            @drop="onDropKanban($event, column.status)"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
                <span class="size-2.5 rounded-full" :class="column.dot"></span>
                <span class="text-sm font-black text-slate-800">{{ column.title }}</span>
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-500">{{ tasksByStatus(column.status).length }}</span>
              </div>
              <div class="flex items-center gap-1 text-slate-400">
                <button type="button" class="rounded-lg p-1 hover:bg-white hover:text-slate-950" title="Tùy chọn">
                  <MoreHorizontal class="size-4" />
                </button>
                <button type="button" class="rounded-lg p-1 hover:bg-white hover:text-slate-950" title="Thêm task" @click="openQuickTask(column.status)">
                  <Plus class="size-4" />
                </button>
              </div>
            </div>

            <div class="min-h-[16rem] space-y-3 rounded-2xl border-2 border-transparent p-1 transition" :class="dragHoverStatus === column.status ? 'border-dashed border-slate-300 bg-white/50' : ''">
              <article
                v-for="task in tasksByStatus(column.status)"
                :key="task.id"
                draggable="true"
                class="group rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                @dragstart="onDragStart($event, task)"
                @click="openTaskDetail(task)"
              >
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="mb-1 inline-flex max-w-full rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700">
                      <span class="truncate">{{ projectName(task.projectId) }}</span>
                    </p>
                    <h3 class="line-clamp-2 text-base font-black leading-snug text-slate-950">{{ task.title }}</h3>
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs font-black" :class="priorityClass(task.priority)">{{ priorityLabel(task.priority) }}</span>
                </div>

                <p class="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-500">{{ task.description || 'Chưa có mô tả.' }}</p>

                <div class="mt-4 rounded-2xl bg-slate-50 p-3">
                  <div class="mb-2 flex items-center justify-between text-xs font-black text-slate-500">
                    <span class="flex items-center gap-1.5">
                      <ListPlus class="size-4 text-blue-500" />
                      {{ completedSubtasks(task) }}/{{ task.subTasks?.length || 0 }} việc con
                    </span>
                    <span>{{ taskProgress(task) }}%</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-white">
                    <div class="h-full rounded-full bg-blue-600 transition-all" :style="{ width: `${taskProgress(task)}%` }"></div>
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div class="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2 text-xs font-black" :class="isOverdue(task) ? 'text-rose-600' : 'text-slate-500'">
                    <CalendarIcon class="size-3.5" />
                    {{ formatDate(task.dueDate) }}
                  </div>
                  <div class="flex items-center gap-3 text-xs font-black text-slate-400">
                    <span class="flex items-center gap-1">
                      <MessageSquare class="size-3.5" />
                      {{ task.comments?.length || 0 }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Paperclip class="size-3.5" />
                      {{ task.workLogs?.length || 0 }}
                    </span>
                  </div>
                </div>

                <div class="mt-3 flex items-center justify-between">
                  <div class="flex -space-x-2">
                    <img
                      v-for="user in assignees(task).slice(0, 3)"
                      :key="user.id"
                      :src="avatarFor(user.fullName, user.avatarUrl, '6366f1')"
                      @error="onAvatarError($event, user.fullName, '6366f1')"
                      :title="user.fullName"
                      class="size-8 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                    <span v-if="assignees(task).length === 0" class="flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-400">
                      <User class="size-3.5" />
                    </span>
                  </div>
                  <button type="button" class="rounded-xl p-2 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-50 hover:text-slate-950">
                    <MoreHorizontal class="size-4" />
                  </button>
                </div>
              </article>

              <div v-if="tasksByStatus(column.status).length === 0" class="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-sm font-black text-slate-400">
                Kéo task vào đây
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <TaskDetailModal :isOpen="isTaskDetailOpen" :taskId="selectedTask?.id" @close="isTaskDetailOpen = false" />
    <QuickTaskModal :isOpen="isQuickTaskOpen" :defaultStatus="quickTaskStatus" @close="isQuickTaskOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  Kanban as KanbanIcon,
  LayoutGrid,
  ListPlus,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  User,
  UsersRound
} from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import TaskDetailModal from '../components/TaskDetailModal.vue';
import QuickTaskModal from '../components/QuickTaskModal.vue';
import type { Task, User as SprintUser } from '../services/mockData';
import { avatarFor, onAvatarError } from '../utils/avatar';

type TaskStatus = Task['status'];

const taskStore = useTaskStore();

const searchQuery = ref('');
const filterProject = ref('all');
const calendarOffset = ref(0);
const dragHoverDate = ref<string | null>(null);
const dragHoverStatus = ref<TaskStatus | null>(null);
const draggedTaskId = ref<string | null>(null);
const isTaskDetailOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const isQuickTaskOpen = ref(false);
const quickTaskStatus = ref<TaskStatus>('ToDo');

const columns: Array<{
  title: string;
  status: TaskStatus;
  dot: string;
  surface: string;
}> = [
  { title: 'Tích lũy', status: 'Backlog', dot: 'bg-rose-500', surface: 'border-rose-100 bg-rose-50/45' },
  { title: 'Cần làm', status: 'ToDo', dot: 'bg-slate-400', surface: 'border-slate-200 bg-slate-50/80' },
  { title: 'Đang làm', status: 'InProgress', dot: 'bg-emerald-500', surface: 'border-emerald-100 bg-emerald-50/55' },
  { title: 'Kiểm tra', status: 'Review', dot: 'bg-amber-500', surface: 'border-amber-100 bg-amber-50/45' },
  { title: 'Hoàn thành', status: 'Done', dot: 'bg-blue-500', surface: 'border-blue-100 bg-blue-50/45' }
];

const refreshLabel = computed(() => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
});

const onlineMembers = computed(() => taskStore.users.filter(user => user.isOnline));
const onlinePreview = computed(() => onlineMembers.value.slice(0, 3));
const extraOnlineCount = computed(() => Math.max(0, onlineMembers.value.length - onlinePreview.value.length));

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return taskStore.tasks.filter(task => {
    const memberNames = assignees(task).map(user => user.fullName).join(' ');
    const project = projectName(task.projectId);
    const haystack = [
      task.title,
      task.description,
      task.status,
      task.priority,
      project,
      memberNames,
      ...(task.labels || [])
    ].join(' ').toLowerCase();

    return (!query || haystack.includes(query))
      && (filterProject.value === 'all' || task.projectId === filterProject.value);
  });
});

const stats = computed(() => [
  { label: 'Tổng task', value: filteredTasks.value.length, icon: Gauge, color: 'text-blue-600' },
  { label: 'Hoàn thành', value: filteredTasks.value.filter(task => task.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600' },
  { label: 'Đang làm', value: filteredTasks.value.filter(task => task.status === 'InProgress').length, icon: UsersRound, color: 'text-violet-600' },
  { label: 'Quá hạn', value: filteredTasks.value.filter(isOverdue).length, icon: CalendarIcon, color: 'text-rose-600' }
]);

const timelineDays = computed(() => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + calendarOffset.value * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateStr = toDateInput(date);
    return {
      date,
      dateStr,
      weekday: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      label: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      isToday: dateStr === toDateInput(new Date())
    };
  });
});

function tasksByStatus(status: TaskStatus) {
  return filteredTasks.value.filter(task => task.status === status);
}

function getTasksForDate(date: string) {
  return filteredTasks.value
    .filter(task => task.dueDate === date)
    .sort((a, b) => statusOrder(a.status) - statusOrder(b.status));
}

function statusOrder(status: TaskStatus) {
  return ['Backlog', 'ToDo', 'InProgress', 'Review', 'Done'].indexOf(status);
}

function openTaskDetail(task: Task) {
  selectedTask.value = task;
  isTaskDetailOpen.value = true;
}

function openQuickTask(status: TaskStatus) {
  quickTaskStatus.value = status;
  isQuickTaskOpen.value = true;
}

function onDragStart(event: DragEvent, task: Task) {
  draggedTaskId.value = task.id;
  event.dataTransfer?.setData('text/plain', task.id);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

async function onDropKanban(event: DragEvent, status: TaskStatus) {
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value;
  dragHoverStatus.value = null;
  draggedTaskId.value = null;
  if (!taskId) return;
  const task = taskStore.tasks.find(item => item.id === taskId);
  if (!task || task.status === status) return;
  await taskStore.updateTaskStatus(taskId, status);
}

async function onDropTimeline(event: DragEvent, dueDate: string) {
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId.value;
  dragHoverDate.value = null;
  draggedTaskId.value = null;
  if (!taskId) return;
  const task = taskStore.tasks.find(item => item.id === taskId);
  if (!task || task.dueDate === dueDate) return;
  await taskStore.updateTask({ ...task, dueDate });
}

function assignees(task: Task): SprintUser[] {
  if (!task.assigneeId) return [];
  const ids = task.assigneeId.split(',').map(id => id.trim());
  return taskStore.users.filter(user => ids.includes(user.id));
}

function projectName(projectId: string) {
  return taskStore.projects.find(project => project.id === projectId)?.name || 'Dự án khác';
}

function completedSubtasks(task: Task) {
  return task.subTasks?.filter(subTask => subTask.isCompleted).length || 0;
}

function taskProgress(task: Task) {
  if (task.subTasks?.length) {
    return Math.round((completedSubtasks(task) / task.subTasks.length) * 100);
  }
  return task.status === 'Done' ? 100 : 0;
}

function priorityLabel(priority: Task['priority']) {
  return priority === 'High' ? 'Cao' : priority === 'Medium' ? 'Trung bình' : 'Thấp';
}

function priorityClass(priority: Task['priority']) {
  return priority === 'High'
    ? 'bg-rose-50 text-rose-700'
    : priority === 'Medium'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-emerald-50 text-emerald-700';
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === 'Done') return false;
  return task.dueDate < toDateInput(new Date());
}

function formatDate(date: string) {
  if (!date) return 'No Date';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shortTaskTitle(title: string) {
  return title.length > 24 ? `${title.slice(0, 24)}...` : title;
}
</script>
