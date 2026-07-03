<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-wrapper">
        <div
          v-for="toast in taskStore.toasts"
          :key="toast.id"
          class="toast-item"
          :class="toastClass(toast.type)"
          @click="dismiss(toast.id)"
        >
          <div class="toast-icon">
            <component :is="toastIcon(toast.type)" class="w-4 h-4" />
          </div>
          <div class="toast-body">
            <div class="toast-title">{{ toastTitle(toast.type) }}</div>
            <div class="toast-msg">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click.stop="dismiss(toast.id)">
            <X class="w-3.5 h-3.5" />
          </button>
          <div class="toast-progress" :class="progressClass(toast.type)"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Bell, CheckCircle, MessageSquare, UserPlus, X, Zap } from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();

function dismiss(id: string) {
  taskStore.toasts = taskStore.toasts.filter(t => t.id !== id);
}

function toastIcon(type: string) {
  if (type.includes('comment')) return MessageSquare;
  if (type.includes('assigned')) return UserPlus;
  if (type.includes('status')) return CheckCircle;
  if (type.includes('notification')) return Bell;
  return Zap;
}

function toastTitle(type: string) {
  if (type.includes('comment')) return 'Bình luận mới';
  if (type.includes('assigned')) return 'Phân công mới';
  if (type.includes('status')) return 'Cập nhật trạng thái';
  if (type.includes('notification')) return 'Thông báo';
  return 'Sự kiện hệ thống';
}

function toastClass(type: string) {
  if (type.includes('comment')) return 'toast-sky';
  if (type.includes('assigned')) return 'toast-emerald';
  if (type.includes('status')) return 'toast-indigo';
  if (type.includes('notification')) return 'toast-violet';
  return 'toast-amber';
}

function progressClass(type: string) {
  if (type.includes('comment')) return 'progress-sky';
  if (type.includes('assigned')) return 'progress-emerald';
  if (type.includes('status')) return 'progress-indigo';
  if (type.includes('notification')) return 'progress-violet';
  return 'progress-amber';
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
}
.toast-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}
.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  min-width: 300px;
  max-width: 380px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  pointer-events: all;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.6);
  transition: transform 0.2s, box-shadow 0.2s;
}
.toast-item:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.16); }

.toast-sky    { background: rgba(240,249,255,0.97); border-color: #bae6fd; }
.toast-emerald{ background: rgba(240,253,249,0.97); border-color: #a7f3d0; }
.toast-indigo { background: rgba(238,242,255,0.97); border-color: #c7d2fe; }
.toast-violet { background: rgba(245,243,255,0.97); border-color: #ddd6fe; }
.toast-amber  { background: rgba(255,251,235,0.97); border-color: #fde68a; }

.toast-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.toast-sky    .toast-icon { background: #e0f2fe; color: #0284c7; }
.toast-emerald .toast-icon { background: #d1fae5; color: #059669; }
.toast-indigo  .toast-icon { background: #e0e7ff; color: #4f46e5; }
.toast-violet  .toast-icon { background: #ede9fe; color: #7c3aed; }
.toast-amber   .toast-icon { background: #fef3c7; color: #d97706; }

.toast-body { flex: 1; min-width: 0; }
.toast-title { font-size: 0.75rem; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
.toast-msg { font-size: 0.7rem; color: #475569; line-height: 1.4; word-break: break-word; }

.toast-close {
  color: #94a3b8; padding: 2px; border-radius: 4px;
  flex-shrink: 0; transition: color 0.15s;
  background: none; border: none; cursor: pointer;
}
.toast-close:hover { color: #475569; }

/* Progress bar */
.toast-progress {
  position: absolute; bottom: 0; left: 0;
  height: 3px; border-radius: 0 0 14px 14px;
  animation: shrink 4.5s linear forwards;
}
.progress-sky    { background: #0284c7; }
.progress-emerald{ background: #059669; }
.progress-indigo { background: #4f46e5; }
.progress-violet { background: #7c3aed; }
.progress-amber  { background: #d97706; }

@keyframes shrink {
  from { width: 100%; }
  to   { width: 0%; }
}

/* Transition */
.toast-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(60px) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(60px) scale(0.9); }
.toast-move         { transition: transform 0.3s ease; }
</style>
