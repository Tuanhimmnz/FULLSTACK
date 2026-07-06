# Hướng Dẫn Test API Bằng F12

## 1. Địa chỉ chạy

Local:

```text
http://localhost:8080
```

VPS:

```text
http://103.77.242.126
```

Tài khoản demo chính:

```text
admin@projecthub.com / admin123
pm@projecthub.com    / 123456
viewer01@projecthub.com / 123456
```

## 2. Cách bật Network

1. Mở web, bấm `F12`.
2. Chọn tab `Network`.
3. Chọn bộ lọc `Fetch/XHR`.
4. Tick `Preserve log` nếu cần giữ request khi chuyển trang.
5. Thao tác login, project, kanban, task detail, notification, AI.

## 3. Request bắt buộc đi qua Gateway

Local:

```text
POST  http://localhost:7000/api/auth/login
GET   http://localhost:7000/api/projects
GET   http://localhost:7000/api/tasks
GET   http://localhost:7000/api/users
GET   http://localhost:7000/api/notifications
POST  http://localhost:7000/api/tasks/{taskId}/comments
POST  http://localhost:7000/api/tasks/{taskId}/worklogs
PATCH http://localhost:7000/api/notifications/{id}/read
GET   http://localhost:7000/api/diagnostics/services
GET   http://localhost:7000/api/diagnostics/routes
GET   http://localhost:7000/api/diagnostics/broker
POST  http://localhost:7000/api/ai/chat
POST  http://localhost:7000/api/ai/suggest-tasks
POST  http://localhost:7000/api/ai/create-task-from-text
```

VPS:

```text
POST  http://103.77.242.126/api/auth/login
GET   http://103.77.242.126/api/projects
GET   http://103.77.242.126/api/tasks
GET   http://103.77.242.126/api/users
GET   http://103.77.242.126/api/notifications
POST  http://103.77.242.126/api/tasks/{taskId}/comments
POST  http://103.77.242.126/api/tasks/{taskId}/worklogs
PATCH http://103.77.242.126/api/notifications/{id}/read
GET   http://103.77.242.126/api/diagnostics/services
GET   http://103.77.242.126/api/diagnostics/routes
GET   http://103.77.242.126/api/diagnostics/broker
POST  http://103.77.242.126/api/ai/chat
POST  http://103.77.242.126/api/ai/suggest-tasks
POST  http://103.77.242.126/api/ai/create-task-from-text
```

## 4. Request không được xuất hiện

Frontend không được gọi thẳng service:

```text
http://103.77.242.126:5001
http://103.77.242.126:5002
http://103.77.242.126:5003
http://localhost:5001
http://localhost:5002
http://localhost:5003
```

Nếu thấy các port trên trong F12 thì sai kiến trúc. Frontend phải gọi Gateway, Gateway mới route nội bộ sang ProjectService, TaskService, NotifyService.

## 5. Luồng demo nhanh

1. Login admin, chỉ request `/api/auth/login`.
2. Dashboard gọi `/api/projects`, `/api/tasks`, `/api/notifications`, `/api/diagnostics/services`.
3. Project chứng minh nhóm 1: tạo/sửa dự án, thành viên.
4. Kanban/My Task chứng minh nhóm 2: kéo thả, tạo task, tick subtask, log giờ.
5. Task Detail chứng minh nhóm 3: comment, mention, notification, activity log.
6. Notifications: mark read, mark all read, delete.
7. Admin: xem danh sách user, phân trang, import CSV/Excel, đổi mật khẩu, đổi role.
8. AI: vào My Task, hỏi AI, gợi ý task, admin xác nhận tạo task thật.
9. Diagnostics: kiểm tra service OK, route table và RabbitMQ broker.

## 6. Điểm cần nói về RabbitMQ và AI

```text
ProjectService và TaskService publish event qua RabbitMQ exchange sprintflow.events.
NotifyService consume queue notify.events để tạo notification và activity log.
Nếu RabbitMQ lỗi, service vẫn có fallback internal API để demo không bị đứt.
AI token không nằm trong Vue. Token chỉ đặt ở backend bằng biến môi trường AI_PROVIDER_TOKEN.
Frontend gọi /api/ai/* qua Gateway. NotifyService đọc dữ liệu project/task/user/comment/activity log rồi trả gợi ý.
Admin/Project Manager phải bấm xác nhận thì AI mới tạo task thật.
```

## 7. Test bằng terminal

```powershell
.\scripts\check-sprintflow-health.ps1
.\scripts\test-sprintflow-flow.ps1
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://localhost:7000/api
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://103.77.242.126/api
```
