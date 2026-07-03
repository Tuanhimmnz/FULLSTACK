<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Radio, Terminal, X, ZapOff } from '@lucide/vue';
import Sidebar from './components/Sidebar.vue';
import NotificationToast from './components/NotificationToast.vue';
import AppFooter from './components/AppFooter.vue';
import { useTaskStore } from './stores/taskStore';

const taskStore = useTaskStore();
const route = useRoute();
const isEventHubOpen = ref(false);

const isLanding = computed(() => route.name === 'Landing');
const isAuthenticated = computed(() => Boolean(taskStore.currentUser?.id));

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

    <button
      v-if="isAuthenticated"
      type="button"
      @click="isEventHubOpen = !isEventHubOpen"
      class="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 text-white shadow-2xl shadow-slate-300 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 active:translate-y-0"
      title="Mở bảng Event Broker"
    >
      <Radio class="size-6 text-cyan-300" />
      <span
        v-if="taskStore.events.length > 0"
        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-black text-white"
      >
        {{ taskStore.events.length > 99 ? '99+' : taskStore.events.length }}
      </span>
    </button>

    <Transition name="drawer">
      <aside
        v-if="isEventHubOpen"
        class="fixed right-0 top-0 z-50 flex h-screen w-[28rem] max-w-[94vw] flex-col border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl"
      >
        <header class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Terminal class="size-5" />
            </span>
            <div>
              <h3 class="text-sm font-black text-white">Event Broker Console</h3>
              <p class="text-xs font-semibold text-slate-400">Payload sự kiện giữa các service</p>
            </div>
          </div>
          <button
            type="button"
            @click="isEventHubOpen = false"
            class="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            title="Đóng"
          >
            <X class="size-5" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="taskStore.events.length > 0" class="space-y-3">
            <article
              v-for="evt in taskStore.events"
              :key="evt.id"
              class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-cyan-500/50"
            >
              <div class="flex items-start justify-between gap-3">
                <span class="rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-black text-cyan-300">
                  {{ evt.eventType }}
                </span>
                <span class="text-[11px] font-semibold text-slate-500">{{ evt.timestamp }}</span>
              </div>
              <p class="mt-3 text-sm font-bold leading-6 text-slate-200">{{ evt.details }}</p>
              <pre class="mt-3 max-h-56 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] leading-5 text-emerald-300">{{ evt.payload }}</pre>
            </article>
          </div>

          <div v-else class="flex h-full flex-col items-center justify-center p-8 text-center">
            <ZapOff class="size-10 text-slate-600" />
            <h4 class="mt-4 text-sm font-black text-slate-300">Chưa có sự kiện</h4>
            <p class="mt-2 max-w-64 text-sm leading-6 text-slate-500">
              Kéo task trên Kanban, đổi người phụ trách hoặc thêm bình luận để xem event được publish.
            </p>
          </div>
        </div>
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
</style>
