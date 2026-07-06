# Báo Cáo Phân Công 3 Nhóm SprintFlow

## 1. Kiến trúc chung

```text
VueJS Frontend -> API Gateway -> ProjectService / TaskService / NotifyService -> SQL Server
ProjectService / TaskService -> RabbitMQ -> NotifyService
```

Điểm cần nói rõ:

```text
Frontend VueJS không deploy bằng Docker, chạy trực tiếp trên host.
Ba service backend deploy bằng Docker đúng yêu cầu đề bài.
API Gateway gom toàn bộ API, frontend chỉ gọi Gateway.
RabbitMQ dùng làm message broker cho event giữa service.
Mỗi service có trách nhiệm nghiệp vụ riêng, không gọi chéo database.
```

## 2. Nhóm 1 - Project & Member Service

Phụ trách: ProjectService.

Nhiệm vụ:

```text
Quản lý dự án.
Quản lý thành viên dự án.
Phân quyền thành viên theo Owner, Manager, Member, Viewer.
Quản lý sprint, milestone và tiến độ dự án.
Publish project event sang RabbitMQ khi thêm thành viên, tạo sprint hoặc hoàn thành milestone.
```

Chức năng demo:

```text
Mở trang Dự án.
Tạo dự án mới.
Đổi tên/sửa mô tả/trạng thái dự án.
Thêm thành viên vào dự án.
Cập nhật tiến độ project.
Kiểm tra F12 thấy request đi qua /api/projects.
```

API chính:

```text
GET    /api/projects
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
PUT    /api/projects/{id}/members
POST   /api/projects/{id}/sprints
POST   /api/projects/{id}/milestones
GET    /api/projects/{id}/activity
```

## 3. Nhóm 2 - Task & Kanban Service

Phụ trách: TaskService.

Nhiệm vụ:

```text
Quản lý task.
Quản lý Kanban theo Backlog, ToDo, InProgress, Review, Done.
Quản lý subtask, worklog, deadline, priority, label và lịch sử task.
Cung cấp dữ liệu cho Gantt, My Task và Analytics.
Publish task event sang RabbitMQ khi giao task, đổi trạng thái hoặc log giờ.
```

Chức năng demo:

```text
Mở Kanban và kéo thả đổi trạng thái task.
Mở My Task để xem lịch task, board detail và tải CSV.
Mở Task Detail để tick subtask, log giờ và cập nhật tiến độ.
Mở Tiến độ (Gantt) để xem lịch triển khai.
Mở Thống kê để xem workload, task trễ hạn và leaderboard.
Kiểm tra F12 thấy request đi qua /api/tasks.
```

API chính:

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/status
POST   /api/tasks/{id}/subtasks
PUT    /api/tasks/{id}/subtasks/{subTaskId}/toggle
POST   /api/tasks/{id}/worklogs
GET    /api/tasks/{id}/history
GET    /api/tasks/deadline-alerts
```

## 4. Nhóm 3 - Comment & Notify Service

Phụ trách: NotifyService, Gateway demo, Auth, Notification, Activity Log, AI.

Nhiệm vụ trọng tâm:

```text
JWT Auth: login, register, profile, đổi mật khẩu, phân quyền.
Admin User Management: danh sách user, tìm kiếm, phân trang, sửa hồ sơ, đổi role, reset mật khẩu, import CSV/Excel, xuất tài khoản.
Comment: bình luận theo task, sửa/xóa, tag thành viên.
Notification: tạo thông báo, unread count, mark read, mark all read, delete.
Activity Log: ghi lại thao tác đăng nhập, profile, comment, notification và event nhận từ nhóm 1/2.
RabbitMQ consumer: nhận project/task event để sinh notification và activity log.
AI Assistant: chat, gợi ý task, tạo task từ mô tả, tóm tắt project, chuyển biên bản họp thành task.
Diagnostics: kiểm tra Gateway, 3 service, RabbitMQ broker và route table.
```

Chức năng cần demo kỹ:

```text
Đăng nhập admin.
Mở Admin để xem 20+ tài khoản demo, tìm kiếm/phân trang, sửa hồ sơ user và reset mật khẩu.
Mở Task Detail, thêm comment có @mention.
Mở Thông báo, mark read, mark all read, delete.
Mở Nhật ký để xem activity log tự động.
Mở My Task, dùng AI gợi ý task và tạo task thật.
Mở Cài đặt/Diagnostics để kiểm tra cả 3 service và RabbitMQ OK.
Mở F12 chứng minh tất cả request đi qua Gateway.
```

API chính:

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/credentials
PUT    /api/users/{id}
PUT    /api/users/{id}/role
PUT    /api/users/{id}/password

GET    /api/tasks/{taskId}/comments
POST   /api/tasks/{taskId}/comments
PUT    /api/tasks/{taskId}/comments/{commentId}
DELETE /api/tasks/{taskId}/comments/{commentId}

GET    /api/notifications
GET    /api/notifications/unread-count
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/mark-all-read
DELETE /api/notifications/{id}

GET    /api/activity-logs
GET    /api/diagnostics/services
GET    /api/diagnostics/routes
GET    /api/diagnostics/broker

POST   /api/ai/chat
POST   /api/ai/suggest-tasks
POST   /api/ai/create-task-from-text
POST   /api/ai/summarize-project
POST   /api/ai/meeting-to-tasks
```

## 5. Tài khoản demo

```text
admin@projecthub.com      / admin123   Admin
pm@projecthub.com         / 123456     Project Manager
backend01@projecthub.com  / 123456     Backend Developer
frontend01@projecthub.com / 123456     Frontend Developer
ba01@projecthub.com       / 123456     Business Analyst
qa01@projecthub.com       / 123456     Tester
devops01@projecthub.com   / 123456     DevOps
uiux01@projecthub.com     / 123456     UI/UX Designer
member01@projecthub.com   / 123456     Member
viewer01@projecthub.com   / 123456     Viewer
```

## 6. Checklist chấm nhanh

```text
Login admin thành công.
Dashboard có project/task/notification/service health.
Projects CRUD được.
Kanban đổi trạng thái task được.
My Task có lịch, board detail, thanh cuộn ngang và tải CSV.
Task Detail tick subtask, log giờ, comment được.
Gantt có timeline.
Analytics có workload và leaderboard.
Admin quản lý tài khoản, phân trang, import/export và đổi mật khẩu được.
Notifications mark read/delete được.
Activity Log có dữ liệu.
Diagnostics báo Gateway, 3 service và RabbitMQ OK.
AI gợi ý task và tạo task qua Gateway.
F12 chỉ thấy request qua Gateway.
```
