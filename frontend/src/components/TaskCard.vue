<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ArrowLeftRight,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from '@lucide/vue';
import type { Task, User } from '../services/mockData';
import { useTaskStore } from '../stores/taskStore';
import { avatarFor, onAvatarError } from '../utils/avatar';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'click-detail', taskId: string): void;
}>();

const taskStore = useTaskStore();
const isDragging = ref(false);
const isMenuOpen = ref(false);

const isViewer = computed(() => taskStore.currentUser?.role === 'Viewer');
const statusOrder: Task['status'][] = ['Backlog', 'ToDo', 'InProgress', 'Review', 'Done'];
const currentStatusIndex = computed(() => statusOrder.indexOf(props.task.status));
const canMoveLeft = computed(() => currentStatusIndex.value > 0);
const canMoveRight = computed(() => currentStatusIndex.value < statusOrder.length - 1);

const statusOptions = [
  { status: 'Backlog' as const, name: 'Tích lũy', dot: 'bg-rose-400' },
  { status: 'ToDo' as const, name: 'Cần làm', dot: 'bg-slate-400' },
  { status: 'InProgress' as const, name: 'Đang làm', dot: 'bg-emerald-500' },
  { status: 'Review' as const, name: 'Kiểm tra', dot: 'bg-amber-500' },
  { status: 'Done' as const, name: 'Hoàn thành', dot: 'bg-blue-600' }
];

const priorityMap = computed(() => {
  if (props.task.priority === 'High') {
    return { label: 'Cao', className: 'bg-rose-50 text-rose-700 border-rose-100' };
  }
  if (props.task.priority === 'Medium') {
    return { label: 'Trung bình', className: 'bg-amber-50 text-amber-700 border-amber-100' };
  }
  return { label: 'Thấp', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
});

const project = computed(() => taskStore.projects.find(p => p.id === props.task.projectId));
const projectName = computed(() => project.value?.name || 'Dự án');
const projectClass = computed(() => {
  const color = project.value?.color;
  if (color === 'amber') return 'bg-orange-50 text-orange-700';
  if (color === 'emerald') return 'bg-emerald-50 text-emerald-700';
  if (color === 'rose') return 'bg-rose-50 text-rose-700';
  return 'bg-blue-50 text-blue-700';
});

const assignees = computed<User[]>(() => {
  if (!props.task.assigneeId) return [];
  const ids = props.task.assigneeId.split(',').map(id => id.trim());
  return taskStore.users.filter(user => ids.includes(user.id));
});

const commentsCount = computed(() => props.task.comments?.length || 0);
const subTasksCount = computed(() => props.task.subTasks?.length || 0);
const completedSubTasksCount = computed(() => props.task.subTasks?.filter(item => item.isCompleted).length || 0);
const subTasksProgressPercent = computed(() => {
  if (subTasksCount.value === 0) return 0;
  return Math.round((completedSubTasksCount.value / subTasksCount.value) * 100);
});

const formattedDate = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  if (props.task.dueDate === today) return 'Hôm nay';
  const parts = props.task.dueDate.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  return props.task.dueDate;
});

const isOverdue = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return props.task.status !== 'Done' && props.task.dueDate < today;
});

const targetColumns = computed(() => statusOptions.filter(col => col.status !== props.task.status));

function moveToStatus(status: Task['status']) {
  isMenuOpen.value = false;
  taskStore.updateTaskStatus(props.task.id, status);
}

function moveLeft() {
  if (!canMoveLeft.value) return;
  taskStore.updateTaskStatus(props.task.id, statusOrder[currentStatusIndex.value - 1]);
}

function moveRight() {
  if (!canMoveRight.value) return;
  taskStore.updateTaskStatus(props.task.id, statusOrder[currentStatusIndex.value + 1]);
}

function dragStart(event: DragEvent) {
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', props.task.id);
  }
  document.body.classList.add('dragging-task');
}

function dragEnd() {
  isDragging.value = false;
  document.body.classList.remove('dragging-task');
}

function openDetails() {
  emit('click-detail', props.task.id);
}
</script>

<template>
  <article
    :draggable="!isViewer"
    class="group relative overflow-visible rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
    :class="[isViewer ? 'cursor-default' : 'cursor-grab active:cursor-grabbing', isDragging ? 'opacity-60 ring-2 ring-blue-300' : '']"
    @click="openDetails"
    @dragstart="dragStart"
    @dragend="dragEnd"
  >
    <div class="flex items-start justify-between gap-3">
      <span class="max-w-[68%] truncate rounded-full px-3 py-1 text-[11px] font-black" :class="projectClass">
        {{ projectName }}
      </span>
      <span class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black" :class="priorityMap.className">
        {{ priorityMap.label }}
      </span>
    </div>

    <h4 class="mt-4 line-clamp-2 text-sm font-black leading-6 text-slate-900 transition group-hover:text-blue-700">
      {{ task.title }}
    </h4>

    <p class="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
      {{ task.description || 'Chưa có mô tả chi tiết.' }}
    </p>

    <div v-if="subTasksCount > 0" class="mt-4 rounded-xl bg-slate-50 p-3">
      <div class="flex items-center justify-between text-xs font-black text-slate-500">
        <span class="flex items-center gap-1.5">
          <CheckSquare class="size-4 text-blue-500" />
          {{ completedSubTasksCount }}/{{ subTasksCount }} việc con
        </span>
        <span>{{ subTasksProgressPercent }}%</span>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div class="h-full rounded-full bg-blue-600 transition-all duration-500" :style="{ width: `${subTasksProgressPercent}%` }"></div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black"
          :class="isOverdue ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500'"
        >
          <CalendarDays class="size-3.5" />
          {{ formattedDate }}
        </span>
        <span v-if="commentsCount > 0" class="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-500">
          <MessageSquare class="size-3.5" />
          {{ commentsCount }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div v-if="!isViewer" class="flex items-center gap-1 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
          <button
            v-if="canMoveLeft"
            type="button"
            class="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            title="Chuyển sang cột trước"
            @click.stop="moveLeft"
          >
            <ChevronLeft class="size-4" />
          </button>

          <div class="relative">
            <button
              type="button"
              class="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              title="Chuyển trạng thái"
              @click.stop="isMenuOpen = !isMenuOpen"
            >
              <ArrowLeftRight class="size-3.5" />
            </button>

            <div
              v-if="isMenuOpen"
              class="absolute bottom-full right-0 z-40 mb-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-200"
              @click.stop
            >
              <p class="px-3 py-2 text-[11px] font-black text-slate-400">Chuyển sang</p>
              <button
                v-for="col in targetColumns"
                :key="col.status"
                type="button"
                class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-black text-slate-700 transition hover:bg-slate-50"
                @click.stop="moveToStatus(col.status)"
              >
                <span class="size-2 rounded-full" :class="col.dot"></span>
                <span>{{ col.name }}</span>
              </button>
            </div>
            <button v-if="isMenuOpen" type="button" class="fixed inset-0 z-30 cursor-default" @click.stop="isMenuOpen = false"></button>
          </div>

          <button
            v-if="canMoveRight"
            type="button"
            class="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            title="Chuyển sang cột sau"
            @click.stop="moveRight"
          >
            <ChevronRight class="size-4" />
          </button>
        </div>

        <div v-if="assignees.length > 0" class="flex -space-x-2">
          <img
            v-for="user in assignees.slice(0, 3)"
            :key="user.id"
            :src="avatarFor(user.fullName, user.avatarUrl, '2563eb')"
            @error="onAvatarError($event, user.fullName, '2563eb')"
            :alt="user.fullName"
            :title="user.fullName"
            class="size-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
        </div>
      </div>
    </div>
  </article>
</template>
