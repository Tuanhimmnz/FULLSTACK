# Hướng Dẫn Demo Đầy Đủ SprintFlow

File này dùng để chạy thử, demo cho thầy và chia việc cho 3 nhóm khi báo cáo.

## 1. Chạy local nhanh

Backend microservices có thể chạy bằng Docker theo yêu cầu đề bài:

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
Copy-Item .env.local.example .env -Force
docker compose -f docker-compose.microservices.yml up -d --build
```

Frontend VueJS chạy trực tiếp trên host:

```powershell
npm install --prefix frontend
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

Mở web:

```text
http://localhost:8080
```

## 2. Chạy kiểu đang test local bằng dotnet

Nếu Docker Desktop bị treo, có thể chạy nhanh bằng `dotnet run` từng service và vẫn giữ đúng mô hình Gateway:

```powershell
dotnet run --project Microservices\ProjectService\ProjectService.csproj --urls http://localhost:5101
dotnet run --project Microservices\TaskService\TaskService.csproj --urls http://localhost:5102
dotnet run --project Microservices\NotifyService\NotifyService.csproj --urls http://localhost:5103
dotnet run --project Microservices\ApiGateway\ApiGateway.csproj --urls http://localhost:7100
$env:VITE_API_BASE_URL="http://localhost:7100/api"
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

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
4. Vào Dự án, tạo hoặc sửa một project, kiểm tra request `/api/projects`.
5. Vào Kanban, đổi trạng thái task, kiểm tra request `/api/tasks/{id}/status`.
6. Vào Danh sách công việc, dùng tìm kiếm, lọc trạng thái, phân trang và mở chi tiết task.
7. Trong Task Detail, tích subtask, log giờ làm, thêm comment và xem activity timeline.
8. Vào Tiến độ (Gantt), lọc theo project và mở task từ thanh timeline.
9. Vào Thống kê, trình bày workload, task trễ hạn, task hoàn thành và bảng năng suất.
10. Vào Tài liệu, tạo một tài liệu API hoặc biên bản họp.
11. Vào Quản trị, xem danh sách tài khoản demo, đổi vai trò hoặc đổi mật khẩu user.
12. Trong Quản trị, bấm `Mẫu Excel`, import nhân viên từ CSV và bấm `Xuất tài khoản`.
13. Ở Projects, Kanban, My Task, Gantt, Analytics, Wiki, Notifications, Activity Log bấm nút tải CSV để chứng minh có xuất dữ liệu.
14. Vào Thông báo, lọc unread/read, mark read, mark all read và delete.
15. Vào Cài đặt/Diagnostics để chứng minh Gateway và 3 service đều OK.

## 5. Checklist F12

Khi demo, tab Network chỉ nên xuất hiện Gateway:

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

## 6. Test tự động trước khi bàn giao

```powershell
dotnet build Microservices\ProjectHubMicroservices.slnx
npm run build --prefix frontend
.\scripts\check-sprintflow-health.ps1 -GatewayBase http://localhost:7100 -ProjectBase http://localhost:5101 -TaskBase http://localhost:5102 -NotifyBase http://localhost:5103
.\scripts\test-sprintflow-flow.ps1 -GatewayBase http://localhost:7100
```

## 7. Vai trò từng nhóm khi báo cáo

Nhóm 1:

```text
Trình bày ProjectService: project, member, sprint, milestone, project timeline.
Demo tạo project và thêm thành viên.
```

Nhóm 2:

```text
Trình bày TaskService: task, Kanban, subtask, worklog, deadline, Gantt, analytics.
Demo đổi trạng thái task, tích subtask, log giờ và xem thống kê.
```

Nhóm 3:

```text
Trình bày NotifyService và Gateway: JWT auth, user management, comment, notification,
activity log, diagnostics và chứng minh F12 chỉ gọi Gateway.
```

## 8. Import/export dữ liệu

```text
Admin có chức năng import nhân viên hàng loạt bằng file CSV mở được bằng Excel.
Nút Mẫu Excel tải file mẫu gồm fullName, email, role, password, isOnline.
Nút Xuất tài khoản tải danh sách user, email, role và mật khẩu demo.
Các trang dữ liệu chính đều có nút tải CSV: Projects, Kanban, My Task, Gantt, Analytics, Wiki, Notifications và Activity Log.
```

## 9. Câu nói chốt khi thầy hỏi

```text
Bọn em tách đúng 3 service backend chạy Docker, frontend VueJS chạy trực tiếp trên host.
Gateway là điểm vào duy nhất của frontend.
Các service có dữ liệu riêng và giao tiếp qua API/event, không gọi chéo database.
Nhóm 3 làm nổi bật phần Auth, Comment, Notification, Activity Log, Diagnostics và quản trị user.
```
