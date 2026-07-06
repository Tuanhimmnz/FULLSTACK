# Hướng Dẫn Demo Đầy Đủ SprintFlow

File này dùng để chạy thử, demo cho thầy và chia phần trình bày cho 3 nhóm.

## 1. Chạy local bằng Docker

Backend microservices chạy bằng Docker đúng yêu cầu đề bài. VueJS chạy riêng trên host.

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
npm install --prefix frontend
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

Mở web:

```text
http://localhost:8080
```

Gateway local:

```text
http://localhost:7000/api
```

## 2. Chạy trên VPS

Web public:

```text
http://103.77.242.126
```

Gateway public:

```text
http://103.77.242.126/api
```

Trên VPS, backend Docker gồm:

```text
api-gateway
project-service
task-service
notify-service
sqlserver
rabbitmq
```

Frontend VueJS build ra thư mục `dist` và copy vào `/var/www/sprintflow`.

## 3. Tài khoản demo

```text
admin@projecthub.com      / admin123   Admin
pm@projecthub.com         / 123456     Project Manager
dev@projecthub.com        / 123456     Developer
viewer@projecthub.com     / 123456     Viewer
backend01@projecthub.com  / 123456     Backend Developer
backend02@projecthub.com  / 123456     Backend Developer
frontend01@projecthub.com / 123456     Frontend Developer
frontend02@projecthub.com / 123456     Frontend Developer
ba01@projecthub.com       / 123456     Business Analyst
ba02@projecthub.com       / 123456     Business Analyst
qa01@projecthub.com       / 123456     Tester
qa02@projecthub.com       / 123456     Tester
devops01@projecthub.com   / 123456     DevOps
uiux01@projecthub.com     / 123456     UI/UX Designer
uiux02@projecthub.com     / 123456     UI/UX Designer
member01@projecthub.com   / 123456     Member
member02@projecthub.com   / 123456     Member
viewer01@projecthub.com   / 123456     Viewer
viewer02@projecthub.com   / 123456     Viewer
```

## 4. Luồng demo cho thầy

1. Đăng nhập bằng `admin@projecthub.com / admin123`.
2. Mở F12 -> Network -> Fetch/XHR.
3. Vào Dashboard để chứng minh app gọi `/api/projects`, `/api/tasks`, `/api/notifications`, `/api/diagnostics/services`.
4. Vào Dự án, tạo hoặc sửa một project, đổi tên dự án, thêm thành viên.
5. Vào Kanban hoặc My Task, đổi trạng thái task và mở chi tiết task.
6. Trong Task Detail, tick subtask, log giờ làm, thêm comment và @mention.
7. Vào Tiến độ (Gantt), lọc theo project và mở task từ thanh timeline.
8. Vào Thống kê, trình bày workload, task trễ hạn, task hoàn thành và bảng năng suất.
9. Vào Tài liệu, tạo một tài liệu API hoặc biên bản họp.
10. Vào Quản trị, xem danh sách tài khoản demo, phân trang, đổi role, reset mật khẩu.
11. Trong Quản trị, tải mẫu CSV/Excel, import nhân viên hàng loạt và xuất danh sách tài khoản.
12. Vào Thông báo, lọc unread/read, mark read, mark all read và delete.
13. Vào My Task, dùng AI để hỏi, gợi ý task và tạo task thật.
14. Vào Cài đặt/Diagnostics để chứng minh Gateway, 3 service và RabbitMQ đều OK.

## 5. Demo AI và RabbitMQ

Kiến trúc bổ sung:

```text
ProjectService / TaskService -> RabbitMQ exchange sprintflow.events -> NotifyService consumer
Frontend Vue -> API Gateway -> NotifyService /api/ai/*
AI token chỉ nằm ở backend env, không nằm trong Vue.
Nếu chưa cấu hình token thật, NotifyService dùng fallback assistant dựa trên dữ liệu project/task/user thật.
```

Khi trình bày:

```text
1. Mở My Task, dùng panel AI để hỏi tóm tắt workspace.
2. Bấm Gợi ý task, AI đọc project/task/user/activity log và trả về danh sách đề xuất.
3. Admin/PM mới có nút tạo task thật. User thường chỉ xem gợi ý.
4. Khi tạo task thật, request đi qua /api/ai/create-task-from-text -> Gateway -> NotifyService -> TaskService.
5. TaskService publish event qua RabbitMQ, NotifyService consume event để tạo notification và activity log.
6. Mở /api/diagnostics/broker để chứng minh RabbitMQ queue sẵn sàng.
```

## 6. Checklist F12

Chỉ nên thấy Gateway:

```text
POST  /api/auth/login
GET   /api/projects
GET   /api/tasks
GET   /api/tasks/deadline-alerts
GET   /api/users/credentials
GET   /api/notifications
GET   /api/activity-logs
GET   /api/diagnostics/services
GET   /api/diagnostics/routes
GET   /api/diagnostics/broker
POST  /api/ai/chat
POST  /api/ai/suggest-tasks
POST  /api/ai/create-task-from-text
```

Không được thấy frontend gọi thẳng:

```text
:5001
:5002
:5003
project-service
task-service
notify-service
```

## 7. Test tự động trước khi bàn giao

```powershell
dotnet build Microservices\ProjectHubMicroservices.slnx
npm run build --prefix frontend
docker compose -f docker-compose.prod.yml config
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://localhost:7000/api
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://103.77.242.126/api
```

Nếu muốn tạo task thật từ AI:

```powershell
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://103.77.242.126/api -CreateRealTask
```

## 8. Vai trò từng nhóm khi báo cáo

Nhóm 1:

```text
Trình bày ProjectService: project, member, sprint, milestone, project timeline.
Demo tạo project, đổi tên project và thêm thành viên.
```

Nhóm 2:

```text
Trình bày TaskService: task, Kanban, subtask, worklog, deadline, Gantt, analytics.
Demo đổi trạng thái task, tích subtask, log giờ và xem thống kê.
```

Nhóm 3:

```text
Trình bày NotifyService và Gateway: JWT auth, user management, comment, notification,
activity log, RabbitMQ consumer, AI assistant, diagnostics và chứng minh F12 chỉ gọi Gateway.
```
