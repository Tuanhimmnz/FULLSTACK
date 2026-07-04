<template>
  <div class="flex-1 flex flex-col min-h-screen pb-12">
    <!-- Top Header Bar -->
    <header class="bg-white border-b border-slate-100 px-4 py-4 flex flex-col gap-3 sticky top-0 z-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div class="flex items-center space-x-3">
        <ShieldCheck class="w-6 h-6 text-indigo-600" />
        <h1 class="text-lg font-bold text-slate-800 tracking-tight">Trang Quản trị Hệ thống</h1>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Back to Dashboard -->
        <router-link
          to="/"
          class="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-all"
        >
          Quay lại Dashboard
        </router-link>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 px-4 py-6 max-w-6xl mx-auto w-full space-y-6 lg:px-8">
      <!-- Admin Tab Selector -->
      <div class="flex gap-3 overflow-x-auto border-b border-slate-100 pb-3">
        <button
          @click="activeSubTab = 'projects'"
          class="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer"
          :class="[
            activeSubTab === 'projects'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          ]"
        >
          <Briefcase class="w-4 h-4" />
          <span>Dự án & Thành viên</span>
        </button>
        <button
          @click="activeSubTab = 'users'"
          class="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer"
          :class="[
            activeSubTab === 'users'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          ]"
        >
          <Users class="w-4 h-4" />
          <span>Quản lý Tài khoản (Hồ sơ nhân sự)</span>
        </button>
      </div>

      <!-- Tab 1: Projects & Group Members Management -->
      <div v-if="activeSubTab === 'projects'" class="space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-base font-bold text-slate-800">Quản lý Dự án & Thành viên</h2>
            <p class="text-xs text-slate-500">Xem danh sách dự án, thêm thành viên vào nhóm và phân công công việc.</p>
          </div>
          <button
            @click="isCreateProjectModalOpen = true"
            class="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 cursor-pointer"
          >
            <FolderPlus class="size-5" />
            <span>Tạo dự án mới</span>
          </button>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Projects List Left Side (1 Column) -->
          <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3 lg:col-span-1">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Danh sách dự án</h3>
            <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              <div
                v-for="proj in taskStore.projects"
                :key="proj.id"
                @click="selectedProject = proj"
                class="p-3.5 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between"
                :class="[
                  selectedProject && selectedProject.id === proj.id
                    ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-sm shadow-indigo-500/5'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                ]"
              >
                <div class="flex items-center space-x-3 min-w-0">
                  <span
                    class="w-2.5 h-2.5 rounded-full shrink-0"
                    :class="[
                      proj.color === 'indigo' ? 'bg-indigo-500' :
                      proj.color === 'amber' ? 'bg-amber-500' :
                      proj.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-500'
                    ]"
                  ></span>
                  <div class="truncate">
                    <p class="text-xs font-bold truncate leading-snug">{{ proj.name }}</p>
                    <p class="text-[10px] text-slate-400 font-medium truncate mt-0.5">{{ proj.statusText }}</p>
                  </div>
                </div>
                <ChevronRight class="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <!-- Project Detail & Member Management Right Side (2 Columns) -->
          <div class="space-y-6 lg:col-span-2">
            <div v-if="selectedProject" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 text-left">
              <!-- Project Meta -->
              <div class="flex items-start justify-between border-b border-slate-50 pb-4">
                <div class="space-y-1.5 min-w-0">
                  <h3 class="text-lg font-bold text-slate-800">{{ selectedProject.name }}</h3>
                  <p class="text-xs text-slate-500 leading-relaxed">{{ selectedProject.description }}</p>
                </div>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                  :class="[
                    selectedProject.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                    selectedProject.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  ]"
                >
                  {{ selectedProject.statusText }}
                </span>
              </div>

              <!-- Members Section -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Thành viên trong nhóm</h4>
                  
                  <!-- Add Member Quick Dropdown -->
                  <div class="relative">
                    <select
                      @change="addMemberToProject"
                      v-model="quickSelectedMemberId"
                      class="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer appearance-none pr-8 pl-3"
                    >
                      <option value="" disabled selected>+ Thêm thành viên...</option>
                      <option v-for="user in usersNotInProject" :key="user.id" :value="user.id">
                        {{ user.fullName }} ({{ user.role }})
                      </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                      <Plus class="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <!-- Members List -->
                <div v-if="selectedProject.members && selectedProject.members.length > 0" class="grid gap-4 sm:grid-cols-2">
                  <div
                    v-for="member in selectedProject.members"
                    :key="member.id"
                    class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group"
                  >
                    <div class="flex items-center space-x-3 min-w-0">
                      <img
                        :src="avatarFor(member.fullName, member.avatarUrl, '2563eb')"
                        @error="onAvatarError($event, member.fullName, '2563eb')"
                        alt="Avatar"
                        class="w-8 h-8 rounded-full border border-slate-100"
                      />
                      <div class="truncate">
                        <p class="text-xs font-bold text-slate-700 truncate leading-snug">{{ member.fullName }}</p>
                        <p class="text-[10px] text-slate-400 font-medium truncate mt-0.5">{{ member.role }}</p>
                      </div>
                    </div>
                    <!-- Remove member from project -->
                    <button
                      @click="removeMemberFromProject(member.id)"
                      class="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa khỏi dự án"
                    >
                      <UserMinus class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div v-else class="text-xs text-slate-400 italic py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  Chưa có thành viên nào trong dự án này. Hãy thêm thành viên đầu tiên!
                </div>
              </div>

              <!-- Tasks List in Project -->
              <div class="space-y-4 border-t border-slate-50 pt-6">
                <h4 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Công việc trong dự án ({{ projectTasks.length }})</h4>
                <div v-if="projectTasks.length > 0" class="space-y-2 max-h-56 overflow-y-auto pr-1">
                  <div
                    v-for="task in projectTasks"
                    :key="task.id"
                    class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-bold text-slate-700 truncate leading-snug">{{ task.title }}</p>
                      <div class="flex items-center space-x-2 text-[10px] text-slate-450 mt-1">
                        <span class="font-semibold" :class="task.status === 'Done' ? 'text-indigo-600' : 'text-slate-450'">
                          {{ task.status === 'Done' ? 'Hoàn thành' : task.status === 'InProgress' ? 'Đang làm' : 'Cần làm' }}
                        </span>
                        <span>•</span>
                        <span>Người làm: <strong class="text-slate-600">{{ getAssigneeName(task.assigneeId) }}</strong></span>
                      </div>
                    </div>
                    <span
                      class="text-[9px] font-extrabold px-2 py-0.5 rounded-md border"
                      :class="[
                        task.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        task.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        'bg-emerald-50 border-emerald-100 text-emerald-600'
                      ]"
                    >
                      {{ task.priority === 'High' ? 'Cao' : task.priority === 'Medium' ? 'Trung bình' : 'Thấp' }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-xs text-slate-400 italic py-3">
                  Chưa có công việc nào thuộc dự án này.
                </div>
              </div>
            </div>

            <!-- Empty selected Project display -->
            <div v-else class="h-64 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/30 text-slate-400">
              <Briefcase class="w-10 h-10 text-slate-300 stroke-[1.5] mb-2" />
              <p class="text-xs font-bold text-slate-500">Chưa có dự án nào được chọn</p>
              <p class="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mt-1">Chọn một dự án từ danh sách bên trái để quản lý danh sách thành viên và các nhiệm vụ.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: User Accounts & Roles Management -->
      <div v-if="activeSubTab === 'users'" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-left space-y-5">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-slate-800">Quản lý Tài khoản & Phân quyền</h2>
          <p class="text-xs text-slate-500">Danh sách hồ sơ người dùng demo. Admin có thể sửa thông tin, đổi vai trò và đặt lại mật khẩu.</p>
        </div>

        <div class="grid gap-3 md:grid-cols-4">
          <div v-for="stat in userStats" :key="stat.label" class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="text-[11px] font-black uppercase text-slate-400">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-black text-slate-900">{{ stat.value }}</p>
          </div>
        </div>

        <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_10rem]">
          <div class="relative">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Tìm theo tên, email, role hoặc ID..."
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>
          <select v-model.number="usersPageSize" class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400">
            <option :value="8">8 người / trang</option>
            <option :value="12">12 người / trang</option>
            <option :value="20">20 người / trang</option>
          </select>
          <button
            type="button"
            class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-100"
            @click="taskStore.refreshUserCredentials()"
          >
            Tải lại tài khoản
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1120px] text-xs text-slate-600 font-medium">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                <th class="pb-3.5 pl-2">Họ tên & Tài khoản</th>
                <th class="pb-3.5">Email</th>
                <th class="pb-3.5">Mật khẩu demo</th>
                <th class="pb-3.5">Trạng thái</th>
                <th class="pb-3.5">Vai trò hệ thống (Role)</th>
                <th class="pb-3.5">Reset mật khẩu</th>
                <th class="pb-3.5 text-right pr-2">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in pagedUsers" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="py-3.5 pl-2 flex items-center space-x-3">
                  <img
                    :src="avatarFor(user.fullName, user.avatarUrl, '6366f1')"
                    @error="onAvatarError($event, user.fullName, '6366f1')"
                    alt="Avatar"
                    class="w-8 h-8 rounded-full border border-slate-100"
                  />
                  <div>
                    <span class="font-bold text-slate-800 block leading-snug">{{ user.fullName }}</span>
                    <span class="text-[10px] text-slate-400 font-semibold block mt-0.5">ID: {{ user.id }}</span>
                  </div>
                </td>
                <td class="py-3.5 text-slate-700 font-semibold">{{ user.email || 'N/A' }}</td>
                <td class="py-3.5">
                  <span class="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-black text-slate-700">
                    {{ credentialsById[user.id]?.password || defaultPassword(user.email) }}
                  </span>
                </td>
                <td class="py-3.5">
                  <span
                    class="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center w-max space-x-1"
                    :class="user.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                    <span>{{ user.isOnline ? 'Trực tuyến' : 'Ngoại tuyến' }}</span>
                  </span>
                </td>
                <td class="py-3.5">
                  <!-- Role update selector -->
                  <div class="relative w-44">
                    <select
                      v-model="user.role"
                      @change="changeUserRole(user.id, user.role)"
                      class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none pr-8"
                    >
                      <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg class="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </td>
                <td class="py-3.5">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="resetPasswords[user.id]"
                      type="text"
                      placeholder="Mật khẩu mới"
                      class="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      class="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-indigo-700"
                      @click="resetPasswordFor(user.id)"
                    >
                      Đổi
                    </button>
                  </div>
                </td>
                <td class="py-3.5 pr-2 text-right">
                  <button
                    type="button"
                    class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    @click="openUserEditor(user)"
                  >
                    Sửa hồ sơ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredUsers.length === 0" class="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-black text-slate-500">
          Không tìm thấy người dùng phù hợp.
        </div>

        <div class="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-bold text-slate-500">
            Hiển thị {{ pagedUsers.length }} / {{ filteredUsers.length }} người dùng · Trang {{ userPage }} / {{ totalUserPages }}
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-40"
              :disabled="userPage === 1"
              @click="userPage--"
            >
              Trước
            </button>
            <button
              v-for="page in visibleUserPages"
              :key="page"
              type="button"
              class="size-9 rounded-xl text-xs font-black transition"
              :class="page === userPage ? 'bg-slate-950 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'"
              @click="userPage = page"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-40"
              :disabled="userPage === totalUserPages"
              @click="userPage++"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Edit User Profile -->
    <Transition name="modal">
      <div v-if="isUserEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
        <form
          class="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 bg-white text-left shadow-2xl shadow-slate-950/20"
          @submit.prevent="submitUserProfile"
        >
          <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div>
              <h3 class="text-base font-black text-slate-900">Chỉnh sửa hồ sơ người dùng</h3>
              <p class="mt-1 text-xs font-semibold text-slate-500">Dành cho Admin nhóm 3: Auth/User Management.</p>
            </div>
            <button type="button" class="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700" @click="isUserEditModalOpen = false">
              <X class="size-5" />
            </button>
          </div>

          <div class="grid gap-5 p-6 md:grid-cols-[11rem_minmax(0,1fr)]">
            <div class="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-center">
              <img
                :src="avatarFor(userEditForm.fullName || 'User', userEditForm.avatarUrl, '6366f1')"
                @error="onAvatarError($event, userEditForm.fullName || 'User', '6366f1')"
                alt="Avatar"
                class="mx-auto size-20 rounded-3xl border-4 border-white object-cover shadow-sm"
              />
              <p class="mt-3 text-sm font-black text-slate-900">{{ userEditForm.fullName || 'Người dùng' }}</p>
              <p class="mt-1 text-[11px] font-bold text-slate-500">{{ userEditForm.role }}</p>
              <p class="mt-2 rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">ID: {{ editingUserId }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="space-y-1.5">
                <span class="text-[10px] font-black uppercase text-slate-400">Họ tên</span>
                <input v-model="userEditForm.fullName" required class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white" />
              </label>
              <label class="space-y-1.5">
                <span class="text-[10px] font-black uppercase text-slate-400">Email đăng nhập</span>
                <input v-model="userEditForm.email" type="email" required class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white" />
              </label>
              <label class="space-y-1.5">
                <span class="text-[10px] font-black uppercase text-slate-400">Vai trò</span>
                <select v-model="userEditForm.role" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white">
                  <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
                </select>
              </label>
              <label class="space-y-1.5">
                <span class="text-[10px] font-black uppercase text-slate-400">Trạng thái</span>
                <select v-model="userEditForm.isOnline" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white">
                  <option :value="true">Trực tuyến</option>
                  <option :value="false">Ngoại tuyến</option>
                </select>
              </label>
              <label class="space-y-1.5 sm:col-span-2">
                <span class="text-[10px] font-black uppercase text-slate-400">Avatar URL</span>
                <input v-model="userEditForm.avatarUrl" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white" />
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
            <button type="button" class="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-100" @click="isUserEditModalOpen = false">
              Hủy
            </button>
            <button type="submit" class="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700">
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Modal: Create New Project -->
    <Transition name="modal">
      <div v-if="isCreateProjectModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col transition-all transform duration-300 text-left">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 class="text-sm font-bold text-slate-800">Tạo dự án mới</h3>
            <button @click="isCreateProjectModalOpen = false" class="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              <X class="size-5" />
            </button>
          </div>

          <form @submit.prevent="submitCreateProject" class="p-6 space-y-4">
            <!-- Project Name -->
            <div class="relative">
              <input
                v-model="newProject.name"
                id="proj_name"
                type="text"
                required
                placeholder=" "
                class="peer w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
              />
              <label
                for="proj_name"
                class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 pointer-events-none transition-all duration-200 ease-out 
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs 
                       peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-indigo-500 peer-focus:px-1 peer-focus:bg-white
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-white"
              >
                Tên dự án...
              </label>
            </div>

            <!-- Description -->
            <div class="relative">
              <textarea
                v-model="newProject.description"
                id="proj_desc"
                rows="3"
                required
                placeholder=" "
                class="peer w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold resize-none"
              ></textarea>
              <label
                for="proj_desc"
                class="absolute left-2.5 top-4 text-xs font-semibold text-slate-400 pointer-events-none transition-all duration-200 ease-out 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs 
                       peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-indigo-500 peer-focus:px-1 peer-focus:bg-white
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-white"
              >
                Mô tả ngắn về dự án...
              </label>
            </div>

            <!-- Color Palette selector -->
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Màu sắc chủ đề</label>
              <div class="flex space-x-3">
                <button
                  v-for="color in ['indigo', 'amber', 'emerald']"
                  :key="color"
                  type="button"
                  @click="newProject.color = color"
                  class="w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center"
                  :class="[
                    color === 'indigo' ? 'bg-indigo-500 border-indigo-500' :
                    color === 'amber' ? 'bg-amber-500 border-amber-500' : 'bg-emerald-500 border-emerald-500',
                    newProject.color === color ? 'ring-2 ring-indigo-500/20 scale-110 shadow-md' : 'opacity-75 hover:opacity-100'
                  ]"
                >
                  <span v-if="newProject.color === color" class="w-1.5 h-1.5 bg-white rounded-full"></span>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3 pt-3">
              <button
                type="button"
                @click="isCreateProjectModalOpen = false"
                class="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer text-center"
              >
                Tạo dự án
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  ShieldCheck,
  Briefcase,
  Users,
  ChevronRight,
  Plus,
  UserMinus,
  X,
  FolderPlus
} from '@lucide/vue';
import { useTaskStore } from '../stores/taskStore';
import { avatarFor, onAvatarError } from '../utils/avatar';
import type { Project, User } from '../services/mockData';

const taskStore = useTaskStore();
const router = useRouter();

// UI States
const activeSubTab = ref<'projects' | 'users'>('projects');
const selectedProject = ref<Project | null>(null);
const quickSelectedMemberId = ref('');
const isCreateProjectModalOpen = ref(false);
const isUserEditModalOpen = ref(false);
const userSearch = ref('');
const userPage = ref(1);
const usersPageSize = ref(8);
const editingUserId = ref('');
const resetPasswords = reactive<Record<string, string>>({});
const userEditForm = reactive({
  fullName: '',
  email: '',
  avatarUrl: '',
  role: 'Member',
  isOnline: true
});

const roleOptions = [
  'Admin',
  'Project Manager',
  'Backend Dev',
  'Frontend Lead',
  'Business Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'UI/UX Designer',
  'Developer',
  'Member',
  'Viewer'
];

// Create Project fields
const newProject = ref<Omit<Project, 'id' | 'createdAt' | 'progress'>>({
  name: '',
  description: '',
  color: 'indigo',
  status: 'New',
  statusText: 'Lên kế hoạch',
  members: []
});

// Access Protection on Mount
onMounted(() => {
  const role = taskStore.currentUser?.role;
  if (role !== 'Project Manager' && role !== 'Admin') {
    router.push('/dashboard');
  } else {
    void taskStore.refreshUserCredentials();
    // Select the first project by default if available
    if (taskStore.projects.length > 0) {
      selectedProject.value = taskStore.projects[0];
    }
  }
});

// Computed list of tasks for selected project
const projectTasks = computed(() => {
  if (!selectedProject.value) return [];
  return taskStore.tasks.filter(t => t.projectId === selectedProject.value?.id);
});

// Computed list of users who are NOT in the currently selected project
const usersNotInProject = computed(() => {
  if (!selectedProject.value) return [];
  const currentMembers = selectedProject.value.members || [];
  const memberIds = currentMembers.map(m => m.id);
  return taskStore.users.filter(u => !memberIds.includes(u.id));
});

const credentialsById = computed(() => Object.fromEntries(
  taskStore.userCredentials.map(item => [item.id, item])
));

const userStats = computed(() => [
  { label: 'Tổng người dùng', value: taskStore.users.length },
  { label: 'Admin/PM', value: taskStore.users.filter(user => ['Admin', 'Project Manager'].includes(user.role)).length },
  { label: 'Dev/QA/Design', value: taskStore.users.filter(user => ['Backend Dev', 'Frontend Lead', 'Developer', 'QA Engineer', 'UI/UX Designer'].includes(user.role)).length },
  { label: 'Đang online', value: taskStore.users.filter(user => user.isOnline).length }
]);

const filteredUsers = computed(() => {
  const query = userSearch.value.trim().toLowerCase();
  if (!query) return taskStore.users;
  return taskStore.users.filter(user => {
    const credential = credentialsById.value[user.id];
    return [
      user.id,
      user.fullName,
      user.email,
      user.role,
      credential?.password
    ].filter(Boolean).join(' ').toLowerCase().includes(query);
  });
});

const totalUserPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / usersPageSize.value)));
const pagedUsers = computed(() => {
  const start = (userPage.value - 1) * usersPageSize.value;
  return filteredUsers.value.slice(start, start + usersPageSize.value);
});

const visibleUserPages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, userPage.value - 2);
  const end = Math.min(totalUserPages.value, start + 4);
  for (let page = start; page <= end; page += 1) pages.push(page);
  return pages;
});

watch([userSearch, usersPageSize], () => {
  userPage.value = 1;
});

watch(totalUserPages, (pages) => {
  if (userPage.value > pages) userPage.value = pages;
});

function defaultPassword(email?: string) {
  return email === 'admin@projecthub.com' ? 'admin123' : '123456';
}

async function resetPasswordFor(userId: string) {
  const newPassword = (resetPasswords[userId] || '').trim();
  if (newPassword.length < 6) {
    alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
    return;
  }

  if (!confirm('Xác nhận đặt lại mật khẩu cho tài khoản này?')) return;
  await taskStore.resetUserPassword(userId, newPassword);
  await taskStore.refreshUserCredentials();
  resetPasswords[userId] = '';
}

function openUserEditor(user: User) {
  editingUserId.value = user.id;
  userEditForm.fullName = user.fullName;
  userEditForm.email = user.email || '';
  userEditForm.avatarUrl = user.avatarUrl || '';
  userEditForm.role = user.role || 'Member';
  userEditForm.isOnline = Boolean(user.isOnline);
  isUserEditModalOpen.value = true;
}

async function submitUserProfile() {
  if (!editingUserId.value) return;
  if (!userEditForm.fullName.trim() || !userEditForm.email.trim()) {
    alert('Họ tên và email không được để trống.');
    return;
  }

  await taskStore.updateUserProfileByAdmin(editingUserId.value, {
    fullName: userEditForm.fullName.trim(),
    email: userEditForm.email.trim(),
    avatarUrl: userEditForm.avatarUrl.trim(),
    role: userEditForm.role,
    isOnline: userEditForm.isOnline
  });
  await taskStore.refreshUserCredentials();
  isUserEditModalOpen.value = false;
}

function getAssigneeName(assigneeId?: string) {
  if (!assigneeId) return 'Chưa phân công';
  const ids = assigneeId.split(',').map(id => id.trim()).filter(Boolean);
  if (ids.length === 0) return 'Chưa phân công';
  const names = ids.map(id => {
    const u = taskStore.users.find(user => user.id === id);
    return u ? u.fullName : null;
  }).filter(Boolean);
  return names.length > 0 ? names.join(', ') : 'Chưa phân công';
}

// Add member to selected project
async function addMemberToProject() {
  if (selectedProject.value && quickSelectedMemberId.value) {
    const memberIds = (selectedProject.value.members || []).map(m => m.id);
    const updatedIds = [...memberIds, quickSelectedMemberId.value];
    
    await taskStore.updateProjectMembers(selectedProject.value.id, updatedIds);
    
    // Refresh selected project details local reference
    const p = taskStore.projects.find(proj => proj.id === selectedProject.value?.id);
    if (p) selectedProject.value = p;
    
    // Reset select option
    quickSelectedMemberId.value = '';
  }
}

// Remove member from selected project
async function removeMemberFromProject(userId: string) {
  if (selectedProject.value && confirm('Xóa thành viên này khỏi nhóm dự án?')) {
    const memberIds = (selectedProject.value.members || []).map(m => m.id);
    const updatedIds = memberIds.filter(id => id !== userId);
    
    await taskStore.updateProjectMembers(selectedProject.value.id, updatedIds);
    
    // Refresh selected project reference
    const p = taskStore.projects.find(proj => proj.id === selectedProject.value?.id);
    if (p) selectedProject.value = p;
  }
}

// Change user role action
async function changeUserRole(userId: string, role: string) {
  if (confirm(`Bạn có chắc chắn muốn đổi vai trò của người dùng này thành ${role}?`)) {
    await taskStore.updateUserRole(userId, role);
  } else {
    // If cancelled, reload store data to reset view selection
    await taskStore.init();
  }
}

// Create project form submit
async function submitCreateProject() {
  if (newProject.value.name.trim() && newProject.value.description.trim()) {
    const projData = {
      name: newProject.value.name.trim(),
      description: newProject.value.description.trim(),
      color: newProject.value.color,
      status: newProject.value.status,
      statusText: newProject.value.statusText,
      members: [] // default empty members on creation
    };
    
    await taskStore.addProject(projData);
    
    // Select the newly created project
    if (taskStore.projects.length > 0) {
      selectedProject.value = taskStore.projects[taskStore.projects.length - 1];
    }
    
    // Reset state & close modal
    newProject.value = {
      name: '',
      description: '',
      color: 'indigo',
      status: 'New',
      statusText: 'Lên kế hoạch',
      members: []
    };
    isCreateProjectModalOpen.value = false;
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}

/* Custom scroll for left drawer list */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
