<template>
  <div class="flex-1 min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-100 px-4 py-5 sticky top-0 z-10 lg:px-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList class="w-5 h-5 text-indigo-500" />
            Nhật ký hoạt động
          </h1>
          <p class="text-xs text-slate-500 mt-1">Lịch sử tất cả hoạt động trong hệ thống</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <!-- Task filter input -->
          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="taskIdFilter"
              type="text"
              placeholder="Lọc theo task ID..."
              class="pl-8 pr-3 h-9 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 w-48"
            />
          </div>
          <button
            @click="exportLogs"
            class="h-9 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download class="w-3.5 h-3.5" />
            Tải CSV
          </button>
          <button
            @click="load"
            class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
            Làm mới
          </button>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="mt-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
        <button
          v-for="f in filterTabs"
          :key="f.value"
          @click="activeTab = f.value"
          class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
          :class="activeTab === f.value
            ? 'bg-white text-indigo-700 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-800'"
        >
          {{ f.label }}
          <span
            v-if="f.count !== undefined"
            class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
            :class="activeTab === f.value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'"
          >{{ f.count }}</span>
        </button>
      </div>
    </header>

    <main class="px-4 py-6 max-w-4xl lg:px-8">
      <!-- Stats row -->
      <div class="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 hover:border-indigo-100 transition-colors"
        >
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="stat.iconBg">
            <component :is="stat.icon" class="size-5" :class="stat.iconText" />
          </div>
          <div>
            <div class="text-xl font-bold text-slate-900">{{ stat.value }}</div>
            <div class="text-[10px] text-slate-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16 gap-3 text-slate-400">
        <div class="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <span class="text-sm">Đang tải nhật ký...</span>
      </div>

      <!-- Log groups by date -->
      <div v-else-if="groupedLogs.length > 0" class="space-y-6">
        <div v-for="group in groupedLogs" :key="group.date">
          <!-- Date separator -->
          <div class="flex items-center gap-3 mb-4">
            <div class="h-px flex-1 bg-slate-200"></div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              {{ group.dateLabel }}
            </span>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <!-- Timeline for this group -->
          <div class="bg-white rounded-xl border border-slate-100 p-4">
            <ActivityLogTimeline :logs="group.logs" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="bg-white border border-dashed border-slate-200 rounded-xl py-16 text-center">
        <ClipboardList class="w-10 h-10 mx-auto text-slate-300" />
        <h2 class="text-sm font-bold text-slate-700 mt-3">Không có nhật ký</h2>
        <p class="text-xs text-slate-400 mt-1">Thực hiện thêm bình luận hoặc thay đổi task để thấy nhật ký tại đây.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ClipboardList, Download, RefreshCw, Search, MessageSquare, UserPlus, CheckCircle } from '@lucide/vue';
import ActivityLogTimeline from '../components/ActivityLogTimeline.vue';
import { apiService } from '../services/api';
import type { ActivityLog } from '../services/mockData';
import { downloadCsv } from '../utils/csv';

const loading = ref(false);
const taskIdFilter = ref('');
const activeTab = ref<'all' | 'comment' | 'status' | 'user'>('all');
const allLogs = ref<ActivityLog[]>([]);

const filterTabs = computed(() => [
  { label: 'Tất cả', value: 'all' as const, count: allLogs.value.length },
  { label: 'Bình luận', value: 'comment' as const, count: allLogs.value.filter(l => l.action.includes('comment')).length },
  { label: 'Trạng thái', value: 'status' as const, count: allLogs.value.filter(l => l.action.includes('status')).length },
  { label: 'Người dùng', value: 'user' as const, count: allLogs.value.filter(l => l.action.includes('user')).length },
]);

const filteredLogs = computed(() => {
  let logs = allLogs.value;
  if (taskIdFilter.value.trim()) {
    logs = logs.filter(l => l.taskId?.includes(taskIdFilter.value.trim()) || l.entityId?.includes(taskIdFilter.value.trim()));
  }
  if (activeTab.value !== 'all') {
    logs = logs.filter(l => l.action.includes(activeTab.value));
  }
  return logs;
});

// Group logs by date
const groupedLogs = computed(() => {
  const groups: Record<string, { date: string; dateLabel: string; logs: ActivityLog[] }> = {};
  filteredLogs.value.forEach(log => {
    const d = new Date(log.createdAt);
    const key = d.toISOString().split('T')[0];
    if (!groups[key]) {
      groups[key] = { date: key, dateLabel: formatDateLabel(d), logs: [] };
    }
    groups[key].logs.push(log);
  });
  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
});

function formatDateLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

const stats = computed(() => [
  {
    label: 'Tổng hoạt động',
    value: allLogs.value.length,
    icon: ClipboardList,
    iconBg: 'bg-indigo-50', iconText: 'text-indigo-500'
  },
  {
    label: 'Bình luận',
    value: allLogs.value.filter(l => l.action.includes('comment')).length,
    icon: MessageSquare,
    iconBg: 'bg-sky-50', iconText: 'text-sky-500'
  },
  {
    label: 'Đổi trạng thái',
    value: allLogs.value.filter(l => l.action.includes('status')).length,
    icon: CheckCircle,
    iconBg: 'bg-emerald-50', iconText: 'text-emerald-500'
  },
  {
    label: 'Người dùng',
    value: allLogs.value.filter(l => l.action.includes('user')).length,
    icon: UserPlus,
    iconBg: 'bg-violet-50', iconText: 'text-violet-500'
  },
]);

async function load() {
  loading.value = true;
  try {
    allLogs.value = await apiService.getActivityLogs();
  } finally {
    loading.value = false;
  }
}

function exportLogs() {
  downloadCsv(`sprintflow-activity-logs-${new Date().toISOString().slice(0, 10)}`, filteredLogs.value, [
    { key: 'createdAt', header: 'Thời gian', value: log => new Date(log.createdAt).toLocaleString('vi-VN') },
    { key: 'userName', header: 'Người thao tác' },
    { key: 'action', header: 'Hành động' },
    { key: 'message', header: 'Nội dung' },
    { key: 'entityType', header: 'Đối tượng' },
    { key: 'taskId', header: 'Task ID' },
    { key: 'entityId', header: 'Entity ID' }
  ]);
}

onMounted(load);
watch(taskIdFilter, () => { /* reactive filter, no reload needed */ });
</script>
