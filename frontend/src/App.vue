<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Bot, Loader2, Send, X } from '@lucide/vue';
import Sidebar from './components/Sidebar.vue';
import NotificationToast from './components/NotificationToast.vue';
import AppFooter from './components/AppFooter.vue';
import { useTaskStore } from './stores/taskStore';
import { renderMarkdown } from './utils/text';
import { apiService } from './services/api';

const taskStore = useTaskStore();
const route = useRoute();
const isAiConsoleOpen = ref(false);

const isLanding = computed(() => route.name === 'Landing');
const isAuthenticated = computed(() => Boolean(taskStore.currentUser?.id));

const chatMessages = ref<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
  { role: 'assistant', text: 'Xin chào! Tôi là Trợ lý AI của SprintFlow. Tôi có thể giải đáp kiến trúc hệ thống, thống kê dự án và lập nháp task giúp bạn.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
]);
const chatInput = ref('');
const chatLoading = ref(false);

async function sendChatMessage() {
  if (!chatInput.value.trim() || chatLoading.value) return;
  const userMsg = chatInput.value.trim();
  chatInput.value = '';
  
  chatMessages.value.push({
    role: 'user',
    text: userMsg,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  chatLoading.value = true;
  try {
    const result = await runChat(userMsg);
    chatMessages.value.push({
      role: 'assistant',
      text: result,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (e) {
    chatMessages.value.push({
      role: 'assistant',
      text: 'Có lỗi xảy ra khi kết nối tới AI. Hãy đảm bảo bạn đã điền API Key ở backend.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    chatLoading.value = false;
  }
}

async function runChat(msg: string) {
  const res = await apiService.aiChat(msg);
  return res.answer;
}

onMounted(() => {
  taskStore.init();
});
</script>

<template>
  <router-view v-if="isLanding" />

  <div v-else class="app-shell min-h-screen text-slate-950">
    <Sidebar v-if="isAuthenticated" />

    <div class="flex min-w-0 flex-1 flex-col">
      <main class="min-h-screen flex-1 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <AppFooter v-if="isAuthenticated" />
      </main>
    </div>

    <!-- Toggle AI Assistant Button (Robot icon) -->
    <button
      v-if="isAuthenticated"
      type="button"
      @click="isAiConsoleOpen = !isAiConsoleOpen"
      class="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-2xl border border-indigo-900 bg-indigo-950 text-white shadow-2xl shadow-indigo-300 transition duration-200 hover:-translate-y-1 hover:bg-indigo-900 active:translate-y-0"
      title="Hỏi trợ lý AI SprintFlow"
    >
      <Bot class="size-6 text-cyan-300 animate-pulse" />
    </button>

    <!-- Global AI Assistant Drawer -->
    <Transition name="drawer">
      <aside
        v-if="isAiConsoleOpen"
        class="fixed right-0 top-0 z-50 flex h-screen w-[28rem] max-w-[94vw] flex-col border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl font-sans"
      >
        <header class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Bot class="size-5" />
            </span>
            <div>
              <h3 class="text-sm font-black text-white">SprintFlow AI Console</h3>
              <p class="text-xs font-semibold text-slate-400">Trợ lý AI hệ thống microservices</p>
            </div>
          </div>
          <button
            type="button"
            @click="isAiConsoleOpen = false"
            class="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            title="Đóng"
          >
            <X class="size-5" />
          </button>
        </header>

        <!-- Chat Logs -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-start">
          <div
            v-for="(msg, index) in chatMessages"
            :key="index"
            :class="['flex flex-col max-w-[85%] rounded-2xl p-3.5', msg.role === 'user' ? 'self-end bg-indigo-600 text-white rounded-br-none' : 'self-start bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800']"
          >
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {{ msg.role === 'user' ? 'Bạn' : 'SprintFlow AI' }} · {{ msg.time }}
            </span>
            <div
              class="text-sm font-semibold leading-relaxed chat-markdown"
              v-html="renderMarkdown(msg.text)"
            ></div>
          </div>
          <div v-if="chatLoading" class="flex items-center gap-2 self-start rounded-2xl bg-slate-900 p-3 text-sm font-semibold text-slate-400 border border-slate-800">
            <Loader2 class="size-4 animate-spin text-indigo-400" />
            <span>AI đang phân tích...</span>
          </div>
        </div>

        <!-- Chat Input Form -->
        <footer class="border-t border-slate-800 p-4 bg-slate-950">
          <form @submit.prevent="sendChatMessage" class="flex gap-2">
            <input
              v-model="chatInput"
              type="text"
              placeholder="Hỏi về dự án, task, docker, database..."
              class="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              :disabled="chatLoading"
            />
            <button
              type="submit"
              :disabled="chatLoading || !chatInput.trim()"
              class="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send class="size-4" />
            </button>
          </form>
        </footer>
      </aside>
    </Transition>

    <NotificationToast />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.chat-markdown strong {
  color: #22d3ee;
  font-weight: 900;
}

.chat-markdown ul {
  list-style-type: disc;
  margin: 6px 0 6px 16px;
  padding: 0;
}

.chat-markdown ol {
  list-style-type: decimal;
  margin: 6px 0 6px 16px;
  padding: 0;
}

.chat-markdown li {
  margin: 4px 0;
}

.chat-markdown p {
  margin: 4px 0;
}
</style>

