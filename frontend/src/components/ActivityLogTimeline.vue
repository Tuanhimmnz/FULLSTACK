<template>
  <div class="activity-timeline">
    <div v-if="loading" class="timeline-loading">
      <div class="spinner"></div>
      <span>Đang tải nhật ký...</span>
    </div>

    <div v-else-if="logs.length === 0" class="timeline-empty">
      <ClipboardList class="w-8 h-8 text-slate-300" />
      <p>Chưa có hoạt động nào được ghi nhận.</p>
    </div>

    <div v-else class="timeline-list">
      <div v-for="(log, idx) in logs" :key="log.id" class="timeline-item">
        <!-- Line -->
        <div class="timeline-line" v-if="idx < logs.length - 1"></div>

        <!-- Icon -->
        <div class="timeline-dot" :class="dotClass(log.action)">
          <component :is="actionIcon(log.action)" class="w-3.5 h-3.5" />
        </div>

        <!-- Content -->
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-actor">{{ log.userName || 'Hệ thống' }}</span>
            <span class="timeline-badge" :class="badgeClass(log.action)">{{ actionLabel(log.action) }}</span>
            <span class="timeline-time">{{ formatTime(log.createdAt) }}</span>
          </div>
          <p class="timeline-message">{{ log.message }}</p>
          <div v-if="log.entityType" class="timeline-meta">
            <span>{{ log.entityType }}</span>
            <span v-if="log.taskId" class="timeline-task-link">· task {{ log.taskId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  MessageSquare, UserPlus, CheckCircle, Edit3,
  Trash2, Bell, ClipboardList, Shield, Key, LogIn
} from '@lucide/vue';
import { apiService } from '../services/api';
import type { ActivityLog } from '../services/mockData';

const props = defineProps<{
  taskId?: string;
}>();

const logs = ref<ActivityLog[]>([]);
const loading = ref(true);

async function loadLogs() {
  loading.value = true;
  try {
    logs.value = await apiService.getActivityLogs(props.taskId);
  } finally {
    loading.value = false;
  }
}

onMounted(loadLogs);
watch(() => props.taskId, loadLogs);

function formatTime(value: string) {
  try {
    const d = new Date(value);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return value; }
}

function actionIcon(action: string) {
  if (action.includes('comment')) return MessageSquare;
  if (action.includes('assigned') || action.includes('role')) return UserPlus;
  if (action.includes('status') || action.includes('done')) return CheckCircle;
  if (action.includes('updated') || action.includes('update')) return Edit3;
  if (action.includes('deleted') || action.includes('delete')) return Trash2;
  if (action.includes('notification')) return Bell;
  if (action.includes('password')) return Key;
  if (action.includes('login')) return LogIn;
  if (action.includes('profile')) return Shield;
  return ClipboardList;
}

function dotClass(action: string) {
  if (action.includes('comment')) return 'dot-sky';
  if (action.includes('deleted') || action.includes('delete')) return 'dot-rose';
  if (action.includes('assigned') || action.includes('role')) return 'dot-emerald';
  if (action.includes('status')) return 'dot-indigo';
  return 'dot-slate';
}

function badgeClass(action: string) {
  if (action.includes('comment')) return 'badge-sky';
  if (action.includes('deleted') || action.includes('delete')) return 'badge-rose';
  if (action.includes('assigned') || action.includes('role')) return 'badge-emerald';
  if (action.includes('status')) return 'badge-indigo';
  return 'badge-slate';
}

function actionLabel(action: string) {
  const map: Record<string, string> = {
    'comment.created': 'Bình luận',
    'comment.updated': 'Sửa BL',
    'comment.deleted': 'Xóa BL',
    'task.status.changed': 'Đổi trạng thái',
    'user.role.updated': 'Đổi vai trò',
    'user.profile.updated': 'Sửa hồ sơ',
    'user.password.changed': 'Đổi mật khẩu',
    'notification.created': 'Thông báo',
  };
  return map[action] || action.split('.').pop() || action;
}
</script>

<style scoped>
.activity-timeline { width: 100%; }

.timeline-loading {
  display: flex; align-items: center; gap: 10px;
  padding: 24px; color: #94a3b8; font-size: 0.8rem;
  justify-content: center;
}
.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid #e2e8f0; border-top-color: #6366f1;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.timeline-empty {
  padding: 32px 16px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #94a3b8; font-size: 0.8rem;
}

.timeline-list { display: flex; flex-direction: column; }

.timeline-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0; position: relative;
  animation: fadeInUp 0.4s ease both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

.timeline-line {
  position: absolute; left: 15px; top: 36px;
  width: 1px; bottom: -10px;
  background: linear-gradient(to bottom, #e2e8f0, transparent);
}

.timeline-dot {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative; z-index: 1;
  transition: transform 0.2s;
}
.timeline-item:hover .timeline-dot { transform: scale(1.12); }

.dot-sky     { background: #e0f2fe; color: #0284c7; }
.dot-rose    { background: #fee2e2; color: #dc2626; }
.dot-emerald { background: #d1fae5; color: #059669; }
.dot-indigo  { background: #e0e7ff; color: #4f46e5; }
.dot-slate   { background: #f1f5f9; color: #64748b; }

.timeline-content {
  flex: 1; min-width: 0;
  background: #f8fafc; border: 1px solid #f1f5f9;
  border-radius: 10px; padding: 8px 12px;
  transition: background 0.2s, border-color 0.2s;
}
.timeline-item:hover .timeline-content {
  background: #fff; border-color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.timeline-header {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  margin-bottom: 4px;
}
.timeline-actor {
  font-size: 0.75rem; font-weight: 700; color: #1e293b;
}
.timeline-badge {
  font-size: 0.65rem; font-weight: 600; padding: 1px 7px;
  border-radius: 20px;
}
.badge-sky     { background: #e0f2fe; color: #0284c7; }
.badge-rose    { background: #fee2e2; color: #dc2626; }
.badge-emerald { background: #d1fae5; color: #059669; }
.badge-indigo  { background: #e0e7ff; color: #4f46e5; }
.badge-slate   { background: #f1f5f9; color: #64748b; }

.timeline-time {
  font-size: 0.65rem; color: #94a3b8; margin-left: auto;
}
.timeline-message {
  font-size: 0.75rem; color: #475569; line-height: 1.5; margin: 0;
}
.timeline-meta {
  font-size: 0.65rem; color: #94a3b8; margin-top: 4px;
  display: flex; gap: 4px; align-items: center;
}
.timeline-task-link { color: #6366f1; }
</style>
