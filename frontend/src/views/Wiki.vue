<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Download, Edit3, FileText, Plus, Save, Search, Trash2, X } from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import { downloadCsv } from '../utils/csv';

interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

const taskStore = useTaskStore();
const selectedProjectId = ref('all');
const searchQuery = ref('');
const documents = ref<ProjectDocument[]>([]);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const form = ref({
  title: '',
  category: 'Yêu cầu',
  content: ''
});

const storageKey = 'sprintflow_project_documents';

const categories = ['Yêu cầu', 'API Spec', 'UI/UX', 'Database', 'Deploy', 'Kiểm thử', 'Biên bản họp'];

onMounted(() => {
  loadDocuments();
});

watch(() => taskStore.projects.length, () => {
  if (documents.value.length === 0) seedDocuments();
});

function loadDocuments() {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      documents.value = JSON.parse(raw);
      return;
    } catch {
      documents.value = [];
    }
  }
  seedDocuments();
}

function saveDocuments() {
  localStorage.setItem(storageKey, JSON.stringify(documents.value));
}

function seedDocuments() {
  const project = taskStore.projects[0];
  if (!project) return;
  const now = new Date().toISOString();
  documents.value = [
    {
      id: 'doc_requirements',
      projectId: project.id,
      title: 'Đặc tả yêu cầu SprintFlow',
      category: 'Yêu cầu',
      content: 'Mục tiêu: quản lý dự án, task, bình luận và thông báo qua kiến trúc microservices.\n\nLuồng chính:\n- Admin tạo project và phân quyền thành viên.\n- Project Manager tạo task, gán người phụ trách, deadline và độ ưu tiên.\n- Thành viên cập nhật trạng thái, tick subtask, log giờ và bình luận.\n- NotifyService nhận event để tạo notification và activity log.',
      authorId: taskStore.currentUser?.id || 'u0',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'doc_api_gateway',
      projectId: project.id,
      title: 'API Gateway Checklist',
      category: 'API Spec',
      content: 'Frontend chỉ gọi Gateway.\n\nRequest cần thấy trong F12:\nPOST /api/auth/login\nGET /api/projects\nGET /api/tasks\nGET /api/notifications\nPOST /api/tasks/{taskId}/comments\nGET /api/users/credentials\n\nKhông được gọi thẳng port 5001, 5002, 5003 từ frontend.',
      authorId: taskStore.currentUser?.id || 'u0',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'doc_deploy',
      projectId: project.id,
      title: 'Quy trình deploy VPS',
      category: 'Deploy',
      content: 'Backend chạy Docker Compose trên VPS Ubuntu.\nVue build ra dist và serve trực tiếp trên host.\nCaddy hoặc Nginx reverse proxy cổng 80 về frontend và /api về Gateway.\n\nLệnh kiểm tra:\ndocker compose ps\ncurl http://SERVER_IP/health\ncurl http://SERVER_IP/api/diagnostics/services',
      authorId: taskStore.currentUser?.id || 'u0',
      createdAt: now,
      updatedAt: now
    }
  ];
  saveDocuments();
}

const visibleDocuments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return documents.value
    .filter(doc => selectedProjectId.value === 'all' || doc.projectId === selectedProjectId.value)
    .filter(doc => !query || `${doc.title} ${doc.category} ${doc.content}`.toLowerCase().includes(query))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
});

function projectName(projectId: string) {
  return taskStore.projects.find(project => project.id === projectId)?.name || 'Dự án SprintFlow';
}

function authorName(authorId: string) {
  return taskStore.users.find(user => user.id === authorId)?.fullName || 'Quản trị viên';
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function openCreate() {
  editingId.value = null;
  form.value = {
    title: '',
    category: 'Yêu cầu',
    content: ''
  };
  isEditing.value = true;
}

function openEdit(doc: ProjectDocument) {
  editingId.value = doc.id;
  form.value = {
    title: doc.title,
    category: doc.category,
    content: doc.content
  };
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

function saveDocument() {
  if (!form.value.title.trim()) {
    alert('Vui lòng nhập tiêu đề tài liệu');
    return;
  }
  if (!form.value.content.trim()) {
    alert('Vui lòng nhập nội dung tài liệu');
    return;
  }

  const now = new Date().toISOString();
  const projectId = selectedProjectId.value === 'all'
    ? taskStore.projects[0]?.id || 'general'
    : selectedProjectId.value;

  if (editingId.value) {
    documents.value = documents.value.map(doc => doc.id === editingId.value
      ? {
          ...doc,
          title: form.value.title.trim(),
          category: form.value.category,
          content: form.value.content.trim(),
          updatedAt: now
        }
      : doc
    );
  } else {
    documents.value.unshift({
      id: `doc_${Date.now()}`,
      projectId,
      title: form.value.title.trim(),
      category: form.value.category,
      content: form.value.content.trim(),
      authorId: taskStore.currentUser?.id || 'u0',
      createdAt: now,
      updatedAt: now
    });
  }

  saveDocuments();
  isEditing.value = false;
}

function deleteDocument(doc: ProjectDocument) {
  if (!confirm(`Xóa tài liệu "${doc.title}"?`)) return;
  documents.value = documents.value.filter(item => item.id !== doc.id);
  saveDocuments();
}

function exportDocuments() {
  downloadCsv(`sprintflow-wiki-${new Date().toISOString().slice(0, 10)}`, visibleDocuments.value, [
    { key: 'title', header: 'Tiêu đề' },
    { key: 'category', header: 'Danh mục' },
    { key: 'projectId', header: 'Dự án', value: doc => projectName(doc.projectId) },
    { key: 'authorId', header: 'Người viết', value: doc => authorName(doc.authorId) },
    { key: 'createdAt', header: 'Ngày tạo', value: doc => formatDate(doc.createdAt) },
    { key: 'updatedAt', header: 'Cập nhật', value: doc => formatDate(doc.updatedAt) },
    { key: 'content', header: 'Nội dung' }
  ]);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-blue-50/60 px-4 py-6 lg:px-8">
    <div class="mx-auto max-w-[1500px] space-y-6">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex size-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200">
            <FileText class="size-8" />
          </span>
          <div>
            <p class="text-xs font-black uppercase text-blue-600">Knowledge base</p>
            <h1 class="mt-1 text-3xl font-black text-slate-950">Tài liệu dự án (Wiki)</h1>
            <p class="mt-1 text-sm font-semibold text-slate-500">Lưu yêu cầu, API spec, biên bản họp, checklist deploy và tài liệu kiểm thử.</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <select
            v-model="selectedProjectId"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none"
          >
            <option value="all">Tất cả dự án</option>
            <option v-for="project in taskStore.projects" :key="project.id" :value="project.id">{{ project.name }}</option>
          </select>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
            @click="openCreate"
          >
            <Plus class="size-5" />
            Thêm tài liệu
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100"
            @click="exportDocuments"
          >
            <Download class="size-5" />
            Tải CSV
          </button>
        </div>
      </header>

      <section class="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo tiêu đề, loại tài liệu hoặc nội dung..."
            class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
          />
        </div>
      </section>

      <section v-if="isEditing" class="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 p-5 lg:flex-row lg:items-center">
          <input
            v-model="form.title"
            type="text"
            placeholder="Nhập tiêu đề tài liệu..."
            class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-blue-300"
          />
          <select v-model="form.category" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none">
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <div class="flex gap-2">
            <button type="button" class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600" @click="cancelEdit">
              <X class="size-4" />
              Hủy
            </button>
            <button type="button" class="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white" @click="saveDocument">
              <Save class="size-4" />
              Lưu
            </button>
          </div>
        </div>
        <div class="p-5">
          <textarea
            v-model="form.content"
            rows="16"
            placeholder="Nhập nội dung tài liệu. Có thể ghi checklist, API spec, ghi chú họp, hướng dẫn deploy..."
            class="w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold leading-7 text-slate-700 outline-none focus:border-blue-300 focus:bg-white"
          ></textarea>
        </div>
      </section>

      <section v-else>
        <div v-if="visibleDocuments.length === 0" class="rounded-[1.8rem] border border-dashed border-slate-300 bg-white p-16 text-center">
          <FileText class="mx-auto size-14 text-slate-300" />
          <p class="mt-4 text-lg font-black text-slate-800">Không có tài liệu phù hợp</p>
          <p class="mt-2 text-sm font-semibold text-slate-500">Tạo tài liệu mới để lưu yêu cầu, API spec và checklist báo cáo.</p>
          <button type="button" class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white" @click="openCreate">
            <Plus class="size-5" />
            Tạo tài liệu đầu tiên
          </button>
        </div>

        <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="doc in visibleDocuments"
            :key="doc.id"
            class="group flex min-h-[19rem] flex-col rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <span class="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase text-blue-700">{{ doc.category }}</span>
                <h2 class="mt-3 line-clamp-2 text-lg font-black leading-6 text-slate-950">{{ doc.title }}</h2>
                <p class="mt-1 text-xs font-bold text-slate-400">{{ projectName(doc.projectId) }}</p>
              </div>
              <div class="flex shrink-0 gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                <button type="button" class="rounded-xl p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700" title="Sửa" @click="openEdit(doc)">
                  <Edit3 class="size-4" />
                </button>
                <button type="button" class="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700" title="Xóa" @click="deleteDocument(doc)">
                  <Trash2 class="size-4" />
                </button>
              </div>
            </div>

            <p class="mt-4 line-clamp-7 flex-1 whitespace-pre-line text-sm font-semibold leading-7 text-slate-600">{{ doc.content }}</p>

            <div class="mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
              <div class="flex items-center justify-between gap-3">
                <span class="truncate">{{ authorName(doc.authorId) }}</span>
                <span>{{ formatDate(doc.updatedAt) }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
