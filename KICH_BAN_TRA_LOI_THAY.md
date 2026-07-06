# Kịch Bản Trả Lời Thầy

## 1. Mở đầu

```text
Bọn em xây dựng SprintFlow theo mô hình microservices cho đề tài quản lý dự án và phân công công việc.
Frontend dùng VueJS, build ra file tĩnh và chạy trực tiếp trên host, không đóng Docker.
Backend có 3 service chính chạy bằng Docker: ProjectService, TaskService, NotifyService.
API Gateway là cổng vào duy nhất cho frontend, frontend không gọi thẳng từng service.
```

## 2. Kiến trúc triển khai

```text
Người dùng -> VueJS Frontend -> API Gateway -> ProjectService / TaskService / NotifyService -> SQL Server
```

Luồng event mới:

```text
ProjectService / TaskService -> RabbitMQ exchange sprintflow.events -> NotifyService queue notify.events
NotifyService -> Notification + Activity Log
```

Khi thầy hỏi vì sao vẫn dùng Docker:

```text
Yêu cầu đề bài là 3 service backend deploy bằng Docker, nên bọn em đóng ProjectService, TaskService và NotifyService thành container.
VueJS không chạy Docker, chỉ build ra file tĩnh và serve trực tiếp trên host.
Gateway cũng chạy trên server để gom toàn bộ API về một cổng, giúp frontend gọi thống nhất.
```

## 3. Phân công 3 nhóm

Nhóm 1 - Project & Member Service:

```text
Nhóm 1 phụ trách quản lý dự án, thành viên, vai trò trong dự án, sprint và milestone.
Các chức năng chính gồm tạo/sửa/xóa project, thêm thành viên, xem tiến độ, quản lý sprint và milestone.
Khi project thay đổi quan trọng, service publish event sang RabbitMQ để NotifyService tạo thông báo.
```

Nhóm 2 - Task & Kanban Service:

```text
Nhóm 2 phụ trách task, Kanban, subtask, worklog, deadline, Gantt và thống kê.
Các chức năng chính gồm tạo task, đổi trạng thái task, tick subtask, log thời gian, kéo thả Kanban, xem Gantt và Analytics.
Khi task được giao, đổi trạng thái hoặc log giờ, TaskService publish event sang RabbitMQ.
```

Nhóm 3 - Comment & Notify Service:

```text
Nhóm 3 phụ trách JWT login/register, quản lý tài khoản, hồ sơ người dùng, comment task, notification, activity log, diagnostics và AI assistant.
NotifyService consume event từ RabbitMQ để sinh notification và activity log.
Nhóm 3 cũng vận hành Gateway và giao diện demo chính để chứng minh 3 service kết nối với nhau.
```

## 4. Điểm nhấn chức năng

```text
Dashboard có dữ liệu thật từ Gateway, thống kê project, task, notification và service health.
Projects có CRUD dự án, sửa tên dự án, thành viên, tiến độ và xuất dữ liệu.
Kanban/My Task có tạo task, kéo thả trạng thái, thanh cuộn ngang, task detail, subtask, worklog và tải CSV.
Task Detail có comment, sửa/xóa comment, tag thành viên, timeline hoạt động và progress tự cập nhật.
Admin quản lý người dùng, danh sách tài khoản demo, phân trang, import CSV/Excel, xuất tài khoản, đổi role và reset mật khẩu.
Notifications có lọc all/unread/read, mark read, mark all read, delete và xuất file.
Diagnostics kiểm tra Gateway, ProjectService, TaskService, NotifyService, RabbitMQ broker và route table.
AI Assistant đọc project/task/user/comment/activity log để gợi ý task, tóm tắt dự án và tạo task từ mô tả.
```

## 5. Cách chứng minh F12

```text
Thầy mở F12 -> Network -> Fetch/XHR.
Em thao tác login, Projects, Kanban, My Task, Notifications, Admin và AI.
Tất cả request nghiệp vụ đều đi qua /api trên Gateway.
Không có request nào từ frontend gọi thẳng ProjectService, TaskService hoặc NotifyService qua port 5001/5002/5003.
```

Request cần chỉ cho thầy:

```text
POST  /api/auth/login
GET   /api/projects
GET   /api/tasks
GET   /api/users/credentials
POST  /api/tasks/{taskId}/comments
POST  /api/tasks/{taskId}/worklogs
GET   /api/notifications
GET   /api/activity-logs
GET   /api/diagnostics/services
GET   /api/diagnostics/broker
POST  /api/ai/chat
POST  /api/ai/suggest-tasks
POST  /api/ai/create-task-from-text
```

## 6. Cách trả lời về database

```text
Mỗi service quản lý dữ liệu của mình, tránh foreign key chéo service.
ProjectService quản lý ProjectDB.
TaskService quản lý TaskDB.
NotifyService quản lý NotifyDB, trong đó có user, comment, notification và activity log.
SQL Server chạy trong Docker để môi trường local và VPS đồng nhất.
```

## 7. Cách trả lời về AI

```text
AI không đặt token ở frontend. Token Antigravity/OpenAI-compatible chỉ đặt trong backend bằng biến môi trường AI_PROVIDER_TOKEN.
Frontend gọi /api/ai/* qua Gateway.
NotifyService lấy dữ liệu project, task, user, comment và activity log, sau đó gửi prompt sang AI provider hoặc dùng fallback demo nếu chưa cấu hình token.
AI chỉ gợi ý task/subtask/deadline/người phụ trách. Admin hoặc Project Manager phải bấm xác nhận thì backend mới tạo task thật.
Khi task được tạo, TaskService lưu task và publish event, NotifyService tạo notification và activity log.
```

## 8. Tài khoản demo

```text
admin@projecthub.com / admin123      Admin
pm@projecthub.com    / 123456        Project Manager
backend01@projecthub.com / 123456    Backend Developer
frontend01@projecthub.com / 123456   Frontend Developer
qa01@projecthub.com / 123456         Tester
viewer01@projecthub.com / 123456     Viewer
```

## 9. Kết luận ngắn

```text
Điểm chính của bài là bọn em không làm một app nguyên khối.
Bọn em tách thành 3 service backend, có Gateway tổng hợp API, RabbitMQ cho event giữa service,
NotifyService xử lý Auth/Comment/Notification/Activity Log/AI, và VueJS chỉ gọi Gateway.
```
