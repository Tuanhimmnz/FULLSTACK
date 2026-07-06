<template>
  <section class="rounded-[1.6rem] border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex gap-3">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
          <Bot class="size-6" />
        </div>
        <div>
          <p class="text-xs font-black uppercase tracking-wider text-indigo-600">AI Assistant Service</p>
          <h2 class="mt-1 text-xl font-black text-slate-950">Trợ lý AI cho công việc</h2>
          <p class="mt-1 max-w-2xl text-sm font-semibold text-slate-500">
            Token AI nằm ở backend env; frontend chỉ gọi Gateway. AI đọc project, task, user, comment và activity log để gợi ý.
          </p>
        </div>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
        <Sparkles class="size-4" />
        {{ providerLabel }}
      </span>
    </div>

    <div class="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label class="text-xs font-black uppercase tracking-wider text-slate-400">Nhập yêu cầu</label>
        <textarea
          v-model="prompt"
          rows="4"
          class="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          placeholder="Ví dụ: Từ biên bản họp, tạo task kiểm thử notification, giao QA, hạn 3 ngày..."
        ></textarea>

        <div class="mt-3 flex flex-wrap gap-2">
          <button class="ai-btn bg-slate-950 text-white hover:bg-slate-800" type="button" :disabled="loading" @click="chat">
            <Send class="size-4" />
            Hỏi AI
          </button>
          <button class="ai-btn border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" type="button" :disabled="loading" @click="suggestTasks">
            <Wand2 class="size-4" />
            Gợi ý task
          </button>
          <button class="ai-btn border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" type="button" :disabled="loading || !isManager" @click="draftTask">
            <ListPlus class="size-4" />
            Lập nháp task
          </button>
          <button
            v-if="draft"
            class="ai-btn border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100"
            type="button"
            :disabled="loading || !isManager"
            @click="confirmCreateTask"
          >
            <CheckCircle2 class="size-4" />
            Tạo task thật
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-950">Kết quả AI</h3>
          <Loader2 v-if="loading" class="size-4 animate-spin text-indigo-600" />
        </div>
        <div class="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-700 markdown-content" v-html="renderMarkdown(answer || 'AI sẵn sàng hỗ trợ tóm tắt project, tạo checklist, gợi ý người phụ trách và sinh task từ mô tả tự nhiên.')"></div>
        <div v-if="draft" class="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <p class="text-xs font-black uppercase tracking-wider text-indigo-500">Bản nháp task</p>
          <h4 class="mt-1 text-base font-black text-slate-950">{{ draft.title }}</h4>
          <p class="mt-1 text-sm font-semibold text-slate-600">{{ draft.description }}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-xs font-black">
            <span class="rounded-full bg-white px-3 py-1 text-indigo-700">{{ draft.priority }}</span>
            <span class="rounded-full bg-white px-3 py-1 text-slate-600">{{ draft.dueDate }}</span>
            <span class="rounded-full bg-white px-3 py-1 text-emerald-700">{{ draft.estimatedHours }}h</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="suggestions.length > 0" class="mt-4 grid gap-3 md:grid-cols-3">
      <article v-for="item in suggestions" :key="item.title" class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p class="text-xs font-black uppercase tracking-wider text-slate-400">{{ item.priority }} · {{ item.dueDate }}</p>
        <h3 class="mt-2 line-clamp-2 text-base font-black text-slate-950">{{ item.title }}</h3>
        <p class="mt-2 line-clamp-3 text-sm font-semibold text-slate-500">{{ item.reason }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bot, CheckCircle2, ListPlus, Loader2, Send, Sparkles, Wand2 } from '@lucide/vue';
import { apiService, type AiTaskSuggestion } from '../services/api';
import { useTaskStore } from '../stores/taskStore';
import { renderMarkdown } from '../utils/text';


const taskStore = useTaskStore();
const prompt = ref('Tóm tắt việc cần làm hôm nay và đề xuất 3 task tiếp theo cho SprintFlow.');
const answer = ref('');
const loading = ref(false);
const suggestions = ref<AiTaskSuggestion[]>([]);
const draft = ref<AiTaskSuggestion | null>(null);
const providerUsed = ref(false);

const isManager = computed(() => ['Admin', 'Project Manager'].includes(taskStore.currentUser?.role));
const providerLabel = computed(() => providerUsed.value ? 'Provider AI thật' : 'Fallback backend demo');

async function run<T>(job: () => Promise<T>) {
  loading.value = true;
  try {
    return await job();
  } finally {
    loading.value = false;
  }
}

async function chat() {
  const result = await run(() => apiService.aiChat(prompt.value));
  if (!result) return;
  answer.value = result.answer;
  providerUsed.value = result.usedProvider;
}

async function suggestTasks() {
  const result = await run(() => apiService.aiSuggestTasks(prompt.value));
  if (!result) return;
  answer.value = result.summary;
  suggestions.value = result.suggestions || [];
  draft.value = suggestions.value[0] || null;
  providerUsed.value = result.usedProvider;
}

async function draftTask() {
  const result = await run(() => apiService.aiCreateTaskFromText({ prompt: prompt.value, confirm: false }));
  if (!result) return;
  draft.value = result.draft;
  answer.value = result.message;
}

async function confirmCreateTask() {
  const source = draft.value?.title || prompt.value;
  const result = await run(() => apiService.aiCreateTaskFromText({ prompt: source, confirm: true }));
  if (!result) return;
  answer.value = result.message;
  draft.value = result.draft;
  await taskStore.init();
  taskStore.pushToast('ai.task.created', 'AI đã tạo task thật qua Gateway và TaskService.');
}
</script>

<style scoped>
.ai-btn {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 1rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 900;
  transition: transform 160ms ease, background-color 160ms ease, opacity 160ms ease;
}

.ai-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.ai-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
