<template>
  <div class="min-h-screen bg-[#f5f7fb] px-4 py-6 lg:px-8">
    <div class="mx-auto max-w-[1500px] space-y-6">
      <header class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p class="text-xs font-black text-indigo-600">Task Service</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Danh sách công việc</h1>
            <p class="mt-1 text-sm font-semibold text-slate-500">Tìm kiếm, lọc, phân trang và mở chi tiết từng task.</p>
          </div>

          <div class="grid gap-3 md:grid-cols-4 xl:w-[58rem]">
            <div class="relative md:col-span-2">
              <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm task, mô tả, nhãn, người phụ trách..."
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>
            <select v-model="filterStatus" class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400">
              <option value="all">Tất cả trạng thái</option>
              <option value="Backlog">Backlog</option>
              <option value="ToDo">Cần làm</option>
              <option value="InProgress">Đang làm</option>
              <option value="Review">Kiểm tra</option>
              <option value="Done">Hoàn thành</option>
            </select>
            <select v-model="filterPriority" class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400">
              <option value="all">Tất cả ưu tiên</option>
              <option value="High">Cao</option>
              <option value="Medium">Trung bình</option>
              <option value="Low">Thấp</option>
            </select>
          </div>
        </div>
      </header>

      <section class="grid gap-4 md:grid-cols-4">
        <article v-for="item in stats" :key="item.label" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-black text-slate-500">{{ item.label }}</p>
          <p class="mt-2 text-3xl font-black text-slate-950">{{ item.value }}</p>
        </article>
      </section>

      <section class="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <select v-model="filterProject" class="max-w-xs rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400">
            <option value="all">Tất cả dự án</option>
            <option v-for="project in taskStore.projects" :key="project.id" :value="project.id">{{ project.name }}</option>
          </select>
          <p class="text-sm font-bold text-slate-500">Hiển thị {{ pagedTasks.length }} / {{ filteredTasks.length }} task</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-left">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-black uppercase text-slate-400">
                <th class="px-3 py-3">Công việc</th>
                <th class="px-3 py-3">Dự án</th>
                <th class="px-3 py-3">Người phụ trách</th>
                <th class="px-3 py-3">Trạng thái</th>
                <th class="px-3 py-3">Ưu tiên</th>
                <th class="px-3 py-3">Tiến độ</th>
                <th class="px-3 py-3">Hạn</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="task in pagedTasks"
                :key="task.id"
                class="cursor-pointer transition hover:bg-slate-50"
                @click="openTaskDetail(task)"
              >
                <td class="px-3 py-4">
                  <p class="font-black text-slate-950">{{ task.title }}</p>
                  <p class="mt-1 line-clamp-1 text-xs font-semibold text-slate-500">{{ task.description || 'Chưa có mô tả.' }}</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="label in task.labels || []" :key="label" class="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-700">{{ label }}</span>
                  </div>
                </td>
                <td class="px-3 py-4 text-sm font-bold text-slate-600">{{ projectName(task.projectId) }}</td>
                <td class="px-3 py-4">
                  <div class="flex -space-x-2">
                    <img
                      v-for="user in assignees(task).slice(0, 4)"
                      :key="user.id"
                      :src="avatarFor(user.fullName, user.avatarUrl, '6366f1')"
                      @error="onAvatarError($event, user.fullName, '6366f1')"
                      :title="user.fullName"
                      class="size-8 rounded-full border-2 border-white object-cover"
                    />
                    <span v-if="assignees(task).length === 0" class="text-xs font-bold text-slate-400">Chưa giao</span>
                  </div>
                </td>
                <td class="px-3 py-4">
                  <span class="rounded-full px-3 py-1 text-xs font-black" :class="statusClass(task.status)">{{ statusLabel(task.status) }}</span>
                </td>
                <td class="px-3 py-4">
                  <span class="rounded-full px-3 py-1 text-xs font-black" :class="priorityClass(task.priority)">{{ priorityLabel(task.priority) }}</span>
                </td>
                <td class="px-3 py-4">
                  <div class="w-32">
                    <div class="flex justify-between text-[11px] font-black text-slate-500">
                      <span>{{ subtaskProgress(task) }}%</span>
                      <span>{{ task.loggedHours || 0 }}/{{ task.estimatedHours || 0 }}h</span>
                    </div>
                    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div class="h-full rounded-full bg-indigo-600" :style="{ width: `${subtaskProgress(task)}%` }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 text-sm font-bold" :class="isOverdue(task) ? 'text-rose-600' : 'text-slate-500'">{{ formatDate(task.dueDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredTasks.length === 0" class="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm font-black text-slate-500">
          Không tìm thấy task phù hợp.
        </div>

        <div class="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p class="text-xs font-bold text-slate-500">Trang {{ currentPage }} / {{ totalPages }}</p>
          <div class="flex items-center gap-2">
            <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:opacity-40" :disabled="currentPage === 1" @click="currentPage--">Trước</button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="size-10 rounded-xl text-sm font-black transition"
              :class="page === currentPage ? 'bg-slate-950 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:opacity-40" :disabled="currentPage === totalPages" @click="currentPage++">Sau</button>
          </div>
        </div>
      </section>
    </div>

    <TaskDetailModal :isOpen="isTaskDetailOpen" :taskId="selectedTask?.id" @close="isTaskDetailOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Search } from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import TaskDetailModal from '../components/TaskDetailModal.vue';
import type { Task } from '../services/mockData';
import { avatarFor, onAvatarError } from '../utils/avatar';

const taskStore = useTaskStore();

const searchQuery = ref('');
const filterStatus = ref<'all' | Task['status']>('all');
const filterPriority = ref<'all' | Task['priority']>('all');
const filterProject = ref('all');
const currentPage = ref(1);
const pageSize = 10;
const isTaskDetailOpen = ref(false);
const selectedTask = ref<Task | null>(null);

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return taskStore.tasks.filter(task => {
    const memberNames = assignees(task).map(user => user.fullName).join(' ');
    const haystack = [
      task.title,
      task.description,
      task.status,
      task.priority,
      projectName(task.projectId),
      memberNames,
      ...(task.labels || [])
    ].join(' ').toLowerCase();

    return (!query || haystack.includes(query))
      && (filterStatus.value === 'all' || task.status === filterStatus.value)
      && (filterPriority.value === 'all' || task.priority === filterPriority.value)
      && (filterProject.value === 'all' || task.projectId === filterProject.value);
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTasks.value.length / pageSize)));
const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTasks.value.slice(start, start + pageSize);
});

const stats = computed(() => [
  { label: 'Tổng task', value: taskStore.tasks.length },
  { label: 'Đang làm', value: taskStore.tasks.filter(task => task.status === 'InProgress').length },
  { label: 'Chờ kiểm tra', value: taskStore.tasks.filter(task => task.status === 'Review').length },
  { label: 'Quá hạn', value: taskStore.overdueTasks }
]);

watch([searchQuery, filterStatus, filterPriority, filterProject], () => {
  currentPage.value = 1;
});

function openTaskDetail(task: Task) {
  selectedTask.value = task;
  isTaskDetailOpen.value = true;
}

function assignees(task: Task) {
  if (!task.assigneeId) return [];
  const ids = task.assigneeId.split(',').map(id => id.trim());
  return taskStore.users.filter(user => ids.includes(user.id));
}

function projectName(projectId: string) {
  return taskStore.projects.find(project => project.id === projectId)?.name || 'Dự án khác';
}

function statusLabel(status: Task['status']) {
  return {
    Backlog: 'Backlog',
    ToDo: 'Cần làm',
    InProgress: 'Đang làm',
    Review: 'Kiểm tra',
    Done: 'Hoàn thành'
  }[status];
}

function statusClass(status: Task['status']) {
  return {
    Backlog: 'bg-rose-50 text-rose-700',
    ToDo: 'bg-slate-100 text-slate-700',
    InProgress: 'bg-emerald-50 text-emerald-700',
    Review: 'bg-amber-50 text-amber-700',
    Done: 'bg-blue-50 text-blue-700'
  }[status];
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

function subtaskProgress(task: Task) {
  if (!task.subTasks?.length) return task.status === 'Done' ? 100 : 0;
  const done = task.subTasks.filter(sub => sub.isCompleted).length;
  return Math.round((done / task.subTasks.length) * 100);
}

function isOverdue(task: Task) {
  return task.status !== 'Done' && task.dueDate < new Date().toISOString().split('T')[0];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>
