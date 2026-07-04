import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Task, type Project, type User, type UserCredential, type Notification, type PublishedEvent, type ActivityLog } from '../services/mockData';
import { apiService } from '../services/api';
import { displayText, displayTextList } from '../utils/text';

export const useTaskStore = defineStore('taskStore', () => {
  const users = ref<User[]>([]);
  const projects = ref<Project[]>([]);
  const tasks = ref<Task[]>([]);
  const notifications = ref<Notification[]>([]);
  const activityLogs = ref<ActivityLog[]>([]);
  const userCredentials = ref<UserCredential[]>([]);
  const currentUser = ref<User>({} as User);
  const projectServiceOnline = ref(true);
  const taskServiceOnline = ref(true);
  const notifyServiceOnline = ref(true);
  
  // Event Hub states
  const events = ref<PublishedEvent[]>([]);
  const toasts = ref<{ id: string; type: string; message: string }[]>([]);
  const seenNotificationIds = new Set<string>();

  // Initialize data asynchronously from API service
  function normalizeUser(user: User): User {
    return {
      ...user,
      fullName: displayText(user.fullName),
      role: displayText(user.role)
    };
  }

  function normalizeProject(project: Project): Project {
    return {
      ...project,
      name: displayText(project.name),
      description: displayText(project.description),
      statusText: displayText(project.statusText),
      members: (project.members || []).map(normalizeUser)
    };
  }

  function normalizeTask(task: Task): Task {
    return {
      ...task,
      title: displayText(task.title),
      description: displayText(task.description),
      labels: displayTextList(task.labels),
      comments: (task.comments || []).map(comment => ({
        ...comment,
        userName: displayText(comment.userName),
        content: displayText(comment.content)
      })),
      workLogs: (task.workLogs || []).map(log => ({
        ...log,
        userName: displayText(log.userName),
        description: displayText(log.description)
      })),
      subTasks: (task.subTasks || []).map(subTask => ({
        ...subTask,
        title: displayText(subTask.title)
      }))
    };
  }

  function normalizeNotification(notification: Notification): Notification {
    return {
      ...notification,
      title: displayText(notification.title),
      message: displayText(notification.message),
      type: displayText(notification.type),
      actorName: displayText(notification.actorName)
    };
  }

  function normalizeActivityLog(log: ActivityLog): ActivityLog {
    return {
      ...log,
      userName: displayText(log.userName),
      action: displayText(log.action),
      message: displayText(log.message)
    };
  }

  function normalizeCredential(credential: UserCredential): UserCredential {
    return {
      ...credential,
      fullName: displayText(credential.fullName),
      role: displayText(credential.role)
    };
  }

  function normalizeWorkspaceText() {
    users.value = users.value.map(normalizeUser);
    projects.value = projects.value.map(normalizeProject);
    tasks.value = tasks.value.map(normalizeTask);
    notifications.value = notifications.value.map(normalizeNotification);
    activityLogs.value = activityLogs.value.map(normalizeActivityLog);
    userCredentials.value = userCredentials.value.map(normalizeCredential);
    if (currentUser.value?.id) currentUser.value = normalizeUser(currentUser.value);
  }

  function normalizeTaskDefaults() {
    tasks.value.forEach(t => {
      if (!t.subTasks) t.subTasks = [];
      if (!t.workLogs) t.workLogs = [];
      if (!t.comments) t.comments = [];
      if (!t.labels) t.labels = [];
      if (t.estimatedHours === undefined) t.estimatedHours = 0;
      if (t.loggedHours === undefined) t.loggedHours = 0;
    });
  }

  function hydrateProjectMembers() {
    projects.value = projects.value.map(project => ({
      ...project,
      members: (project.members || []).map(member => {
        const user = users.value.find(u => u.id === member.id || u.id === member.fullName);
        return user
          ? {
              id: user.id,
              fullName: user.fullName,
              avatarUrl: user.avatarUrl,
              role: member.role || user.role,
              isOnline: user.isOnline
            }
          : member;
      })
    }));
  }

  async function refreshWorkspaceApis() {
    try {
      users.value = await apiService.getUsers().then(res => {
        notifyServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Notify Service (Users) is offline:', err);
        notifyServiceOnline.value = false;
        return users.value;
      });
      projects.value = await apiService.getProjects().then(res => {
        projectServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Project Service is offline:', err);
        projectServiceOnline.value = false;
        return projects.value;
      });
      hydrateProjectMembers();
      tasks.value = await apiService.getTasks().then(res => {
        taskServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Task Service is offline:', err);
        taskServiceOnline.value = false;
        return tasks.value;
      });
      normalizeTaskDefaults();
      normalizeWorkspaceText();
    } catch (e) {
      console.error('Failed to refresh workspace APIs:', e);
    }
  }

  async function init() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      users.value = await apiService.getUsers().then(res => {
        notifyServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Notify Service (Users) is offline:', err);
        notifyServiceOnline.value = false;
        return [];
      });
    } catch (e) {
      notifyServiceOnline.value = false;
    }

    try {
      currentUser.value = await apiService.getCurrentUser().then(res => {
        notifyServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Notify Service (Current User) is offline:', err);
        notifyServiceOnline.value = false;
        return {} as User;
      });
    } catch (e) {
      notifyServiceOnline.value = false;
    }

    try {
      notifications.value = await apiService.getNotifications().then(res => {
        notifyServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Notify Service (Notifications) is offline:', err);
        notifyServiceOnline.value = false;
        return [];
      });
      syncNotificationToasts(notifications.value, false);
    } catch (e) {
      notifyServiceOnline.value = false;
    }

    try {
      projects.value = await apiService.getProjects().then(res => {
        projectServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Project Service is offline:', err);
        projectServiceOnline.value = false;
        return [];
      });
    } catch (e) {
      projectServiceOnline.value = false;
    }

    hydrateProjectMembers();

    try {
      tasks.value = await apiService.getTasks().then(res => {
        taskServiceOnline.value = true;
        return res;
      }).catch(err => {
        console.error('Task Service is offline:', err);
        taskServiceOnline.value = false;
        return [];
      });
    } catch (e) {
      taskServiceOnline.value = false;
    }

    normalizeTaskDefaults();
    normalizeWorkspaceText();
  }

  // Periodic background check & data refresh (every 10 seconds)
  if (typeof window !== 'undefined') {
    setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await refreshWorkspaceApis();
        await refreshNotifications();
      }
    }, 30000);
  }

  async function loginAction(email: string, password: string) {
    const data = await apiService.login(email, password);
    localStorage.setItem('token', data.token);
    currentUser.value = data.user;
    await init();
    return true;
  }

  async function registerAction(userData: any) {
    const data = await apiService.register(userData);
    localStorage.setItem('token', data.token);
    currentUser.value = data.user;
    await init();
    return true;
  }

  function logoutAction() {
    localStorage.removeItem('token');
    currentUser.value = {} as User;
    users.value = [];
    projects.value = [];
    tasks.value = [];
    notifications.value = [];
  }

  // Get project progress dynamically based on completed tasks
  const getProjectProgress = computed(() => {
    return (projectId: string) => {
      const projectTasks = tasks.value.filter(t => t.projectId === projectId);
      if (projectTasks.length === 0) {
        const proj = projects.value.find(p => p.id === projectId);
        return proj ? proj.progress : 0;
      }
      const completed = projectTasks.filter(t => t.status === 'Done').length;
      return Math.round((completed / projectTasks.length) * 100);
    };
  });

  // Stats for Dashboard
  const totalTasks = computed(() => tasks.value.length);
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'InProgress').length);
  
  const overdueTasks = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.value.filter(t => {
      return t.status !== 'Done' && t.dueDate < todayStr;
    }).length;
  });

  const onlineMembersCount = computed(() => users.value.filter(u => u.isOnline).length);
  const unreadNotificationCount = computed(() => notifications.value.filter(n => !n.isRead).length);

  // Today's tasks for current user
  const todayTasks = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.value.filter(t => {
      const isAssignee = t.assigneeId ? t.assigneeId.split(',').map(id => id.trim()).includes(currentUser.value.id) : false;
      return isAssignee && (t.dueDate === todayStr || (t.dueDate < todayStr && t.status !== 'Done'));
    });
  });

  // Event Broker Helper
  function publishEvent(eventType: 'task.status.changed' | 'task.assigned', task: Task, details: string) {
    const assigneeNames = task.assigneeId
      ? task.assigneeId.split(',')
          .map(id => users.value.find(u => u.id === id.trim())?.fullName)
          .filter(Boolean)
          .join(', ')
      : 'Unassigned';
    
    const payloadObj = {
      eventId: 'evt_' + Date.now(),
      eventType,
      taskId: task.id,
      taskTitle: task.title,
      status: task.status,
      assigneeName: assigneeNames || 'Unassigned',
      timestamp: new Date().toISOString()
    };

    const event: PublishedEvent = {
      id: payloadObj.eventId,
      eventType,
      taskTitle: task.title,
      details,
      payload: JSON.stringify(payloadObj, null, 2),
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    events.value.unshift(event);
    triggerToast(eventType, `[Event Published] ${details}`);
  }

  function triggerToast(type: string, message: string) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 4500);
  }

  function pushToast(type: string, message: string) {
    triggerToast(type, message);
  }

  function syncNotificationToasts(items: Notification[], shouldToastNew = true) {
    items.forEach(notification => {
      if (seenNotificationIds.has(notification.id)) return;
      seenNotificationIds.add(notification.id);
      if (shouldToastNew && !notification.isRead) {
        triggerToast('notification', `${displayText(notification.title)}: ${displayText(notification.message)}`);
      }
    });
  }

  // API Call Actions for Tasks
  async function addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'subTasks' | 'workLogs' | 'loggedHours'>) {
    try {
      const newTask = normalizeTask(await apiService.createTask(taskData));
      tasks.value.push(newTask);
      updateProjectProgressLocal(newTask.projectId);

      if (newTask.assigneeId) {
        const names = newTask.assigneeId.split(',')
          .map(id => users.value.find(u => u.id === id.trim())?.fullName)
          .filter(Boolean)
          .join(', ');
        publishEvent('task.assigned', newTask, `Công việc '${newTask.title}' đã được giao cho ${names || 'chưa ai'}`);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }

  async function updateTaskStatus(taskId: string, status: Task['status']) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        const oldStatus = task.status;
        if (oldStatus !== status) {
          const updatedTask = normalizeTask(await apiService.updateTaskStatus(taskId, status));
          task.status = updatedTask.status;
          updateProjectProgressLocal(task.projectId);
          
          publishEvent('task.status.changed', task, `Trạng thái của '${task.title}' đổi từ [${oldStatus}] sang [${status}]`);
        }
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }

  async function updateTask(updatedTask: Task) {
    try {
      const index = tasks.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        const oldTask = tasks.value[index];
        const oldProjectId = oldTask.projectId;
        const oldStatus = oldTask.status;
        const oldAssigneeId = oldTask.assigneeId;

        const savedTask = normalizeTask(await apiService.updateTask(updatedTask));
        tasks.value[index] = { ...savedTask };
        
        updateProjectProgressLocal(savedTask.projectId);
        if (oldProjectId !== savedTask.projectId) {
          updateProjectProgressLocal(oldProjectId);
        }

        // Check for event triggers
        if (oldStatus !== savedTask.status) {
          publishEvent('task.status.changed', savedTask, `Trạng thái của '${savedTask.title}' đổi từ [${oldStatus}] sang [${savedTask.status}]`);
        }
        if (oldAssigneeId !== savedTask.assigneeId) {
          const names = savedTask.assigneeId
            ? savedTask.assigneeId.split(',')
                .map(id => users.value.find(u => u.id === id.trim())?.fullName)
                .filter(Boolean)
                .join(', ')
            : 'chưa ai';
          publishEvent('task.assigned', savedTask, `Công việc '${savedTask.title}' được phân công cho [${names || 'chưa ai'}]`);
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        const projectId = task.projectId;
        await apiService.deleteTask(taskId);
        tasks.value = tasks.value.filter(t => t.id !== taskId);
        updateProjectProgressLocal(projectId);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  function updateProjectProgressLocal(projectId: string) {
    const proj = projects.value.find(p => p.id === projectId);
    if (proj) {
      proj.progress = getProjectProgress.value(projectId);
      // Synchronize project progress with backend
      apiService.updateProjectProgress(projectId, proj.progress).catch(error => {
        console.error('Failed to update project progress:', error);
      });
    }
  }

  // Comments
  async function refreshTaskComments(taskId: string) {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;

    task.comments = (await apiService.getComments(taskId)).map(comment => ({
      ...comment,
      userName: displayText(comment.userName),
      content: displayText(comment.content)
    }));
  }

  async function addComment(taskId: string, content: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        await apiService.addComment(taskId, content);
        await refreshWorkspaceApis();
        await refreshTaskComments(taskId);
        await refreshNotifications();
        triggerToast('comment.created', 'Bình luận đã được gửi và ghi vào nhật ký hoạt động.');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  async function updateComment(taskId: string, commentId: string, content: string) {
    try {
      const updatedComment = await apiService.updateComment(taskId, commentId, content);
      await refreshWorkspaceApis();
      await refreshTaskComments(taskId);
      await refreshNotifications();
      return updatedComment;
    } catch (error) {
      console.error('Failed to update comment:', error);
      throw error;
    }
  }

  async function deleteComment(taskId: string, commentId: string) {
    try {
      await apiService.deleteComment(taskId, commentId);
      await refreshWorkspaceApis();
      await refreshTaskComments(taskId);
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  }

  async function refreshNotifications(status: 'all' | 'unread' | 'read' = 'all') {
    try {
      const items = (await apiService.getNotifications(status)).map(normalizeNotification);
      syncNotificationToasts(items, notifications.value.length > 0);
      notifications.value = items;
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  }

  async function markNotificationRead(notificationId: string) {
    try {
      const updated = normalizeNotification(await apiService.markNotificationRead(notificationId));
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        notifications.value[index] = updated;
      }
    } catch (error) {
      console.error('Failed to mark notification read:', error);
    }
  }

  async function markAllNotificationsRead() {
    try {
      await apiService.markAllNotificationsRead();
      notifications.value = notifications.value.map(n => ({ ...n, isRead: true }));
    } catch (error) {
      console.error('Failed to mark all notifications read:', error);
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      await apiService.deleteNotification(notificationId);
      notifications.value = notifications.value.filter(n => n.id !== notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  async function refreshActivityLogs(taskId?: string) {
    try {
      activityLogs.value = (await apiService.getActivityLogs(taskId)).map(normalizeActivityLog);
    } catch (error) {
      console.error('Failed to refresh activity logs:', error);
      activityLogs.value = [];
    }
  }

  async function createSelfNotification(title: string, message: string, type = 'manual') {
    if (!currentUser.value?.id) return;
    try {
      const notification = await apiService.createNotification({
        userId: currentUser.value.id,
        title,
        message,
        type,
        taskId: null,
        projectId: null
      });
      const cleanNotification = normalizeNotification(notification);
      notifications.value = [cleanNotification, ...notifications.value];
      seenNotificationIds.add(notification.id);
      triggerToast('notification.manual', `${cleanNotification.title}: ${cleanNotification.message}`);
      return cleanNotification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  async function updateProfile(data: { fullName: string; avatarUrl?: string }) {
    try {
      const result = await apiService.updateCurrentUser(data);
      const updated = normalizeUser(result.user);
      localStorage.setItem('token', result.token);
      currentUser.value = updated;
      const index = users.value.findIndex(user => user.id === updated.id);
      if (index !== -1) {
        users.value[index] = updated;
      }
      return updated;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      await apiService.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  // Projects
  async function addProject(projData: Omit<Project, 'id' | 'createdAt' | 'progress'>) {
    try {
      const newProj = normalizeProject(await apiService.createProject(projData));
      projects.value.push(newProj);
      return newProj;
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  }

  async function updateProjectMembers(projectId: string, memberIds: string[]) {
    try {
      await apiService.updateProjectMembers(projectId, memberIds);
      const proj = projects.value.find(p => p.id === projectId);
      if (proj) {
        proj.members = users.value.filter(u => memberIds.includes(u.id)).map(u => ({
          id: u.id,
          fullName: u.fullName,
          avatarUrl: u.avatarUrl,
          role: u.role,
          isOnline: u.isOnline
        }));
      }
    } catch (error) {
      console.error('Failed to update project members:', error);
    }
  }

  async function updateUserRole(userId: string, role: string) {
    try {
      const updated = normalizeUser(await apiService.updateUserRole(userId, role));
      const u = users.value.find(user => user.id === userId);
      if (u) {
        Object.assign(u, updated);
      }
      if (currentUser.value.id === userId) {
        currentUser.value = updated;
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  }

  async function updateUserProfileByAdmin(userId: string, data: Partial<Pick<User, 'fullName' | 'email' | 'avatarUrl' | 'role' | 'isOnline'>>) {
    try {
      const updated = normalizeUser(await apiService.updateUserProfileByAdmin(userId, data));
      const index = users.value.findIndex(user => user.id === userId);
      if (index !== -1) users.value[index] = updated;
      if (currentUser.value.id === userId) currentUser.value = updated;

      projects.value = projects.value.map(project => ({
        ...project,
        members: (project.members || []).map(member => member.id === userId ? { ...member, ...updated } : member)
      }));

      const credential = userCredentials.value.find(item => item.id === userId);
      if (credential) {
        credential.fullName = updated.fullName;
        credential.email = updated.email || credential.email;
        credential.role = updated.role;
      }

      triggerToast('user.profile.updated', `Đã cập nhật hồ sơ ${updated.fullName}.`);
      return updated;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  async function refreshUserCredentials() {
    try {
      userCredentials.value = (await apiService.getUserCredentials()).map(normalizeCredential);
    } catch (error) {
      console.error('Failed to load user credentials:', error);
      userCredentials.value = users.value.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email || '',
        role: user.role,
        password: user.email === 'admin@projecthub.com' ? 'admin123' : '123456'
      }));
    }
  }

  async function resetUserPassword(userId: string, newPassword: string) {
    await apiService.resetUserPassword(userId, newPassword);
    const credential = userCredentials.value.find(item => item.id === userId);
    if (credential) credential.password = newPassword;
    triggerToast('user.password.reset', 'Admin đã đặt lại mật khẩu người dùng.');
  }

  // --- N2 ASYNC ACTIONS ---

  // Sub-task management
  async function addSubTask(taskId: string, title: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        const newSub = await apiService.addSubTask(taskId, title);
        if (!task.subTasks) task.subTasks = [];
        task.subTasks.push(newSub);
      }
    } catch (error) {
      console.error('Failed to add sub-task:', error);
    }
  }

  async function toggleSubTask(taskId: string, subTaskId: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task && task.subTasks) {
        const sub = task.subTasks.find(s => s.id === subTaskId);
        if (sub) {
          await apiService.toggleSubTask(taskId, subTaskId);
          sub.isCompleted = !sub.isCompleted;
        }
      }
    } catch (error) {
      console.error('Failed to toggle sub-task:', error);
    }
  }

  async function deleteSubTask(taskId: string, subTaskId: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task && task.subTasks) {
        await apiService.deleteSubTask(taskId, subTaskId);
        task.subTasks = task.subTasks.filter(s => s.id !== subTaskId);
      }
    } catch (error) {
      console.error('Failed to delete sub-task:', error);
    }
  }

  // Work log management
  async function addWorkLog(taskId: string, hours: number, description: string) {
    try {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        const newLog = await apiService.addWorkLog(taskId, hours, description);
        if (!task.workLogs) task.workLogs = [];
        task.workLogs.push(newLog);
        task.loggedHours = (task.loggedHours || 0) + hours;
      }
    } catch (error) {
      console.error('Failed to add work log:', error);
    }
  }

  return {
    users,
    projects,
    tasks,
    notifications,
    activityLogs,
    userCredentials,
    currentUser,
    events,
    toasts,
    pushToast,
    init,
    getProjectProgress,
    totalTasks,
    inProgressTasks,
    overdueTasks,
    onlineMembersCount,
    unreadNotificationCount,
    todayTasks,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    addComment,
    refreshTaskComments,
    updateComment,
    deleteComment,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    refreshActivityLogs,
    createSelfNotification,
    addProject,
    updateProjectMembers,
    updateUserRole,
    updateUserProfileByAdmin,
    refreshUserCredentials,
    resetUserPassword,
    updateProfile,
    changePassword,
    
    // N2
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    addWorkLog,

    // Auth
    loginAction,
    registerAction,
    logoutAction,

    // Connectivity Status
    projectServiceOnline,
    taskServiceOnline,
    notifyServiceOnline
  };
});
