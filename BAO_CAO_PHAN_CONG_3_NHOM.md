# Báo Cáo Phân Công 3 Nhóm SprintFlow

## 1. Kiến trúc chung

```text
VueJS Frontend -> API Gateway -> ProjectService / TaskService / NotifyService -> SQL Server
```

Điểm cần nói rõ với thầy:

```text
Frontend VueJS không deploy bằng Docker, chạy trực tiếp trên host.
Ba service backend deploy bằng Docker đúng yêu cầu đề bài.
API Gateway gom toàn bộ API, frontend chỉ gọi Gateway.
Mỗi service có trách nhiệm nghiệp vụ riêng, không gọi chéo database.
```

Lưu ý về Docker:

```text
Frontend/Dockerfile đã được bỏ là đúng yêu cầu.
Dockerfile của ProjectService, TaskService, NotifyService và ApiGateway vẫn còn.
docker-compose.prod.yml dùng để chạy SQL Server, 3 service backend và Gateway trên VPS.
```

## 2. Nhóm 1 - Project & Member Service

Nhóm trưởng: Chien2711

Nhiệm vụ:

```text
Quản lý dự án.
Quản lý thành viên dự án.
Phân quyền thành viên theo Owner, Manager, Member, Viewer.
Quản lý sprint, milestone và tiến độ dự án.
Gửi event sang nhóm 3 khi project có thay đổi quan trọng.
```

Chức năng cần demo:

```text
Mở trang Dự án.
Tạo project mới.
Sửa thông tin project.
Thêm thành viên vào project.
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

Câu trả lời mẫu:

```text
Nhóm 1 chịu trách nhiệm ProjectService. Service này quản lý dữ liệu dự án và thành viên,
đồng thời cung cấp API để frontend thông qua Gateway tạo/sửa/xóa project và cập nhật tiến độ.
```

## 3. Nhóm 2 - Task & Kanban Service

Nhóm trưởng: ngocbao72

Nhiệm vụ:

```text
Quản lý task.
Quản lý Kanban theo Backlog, ToDo, InProgress, Review, Done.
Quản lý subtask, worklog, deadline, priority, label và lịch sử task.
Cung cấp dữ liệu cho Gantt và Analytics.
Gửi event sang nhóm 3 khi task được giao, đổi trạng thái hoặc log giờ.
```

Chức năng cần demo:

```text
Mở Kanban và đổi trạng thái task.
Mở Danh sách task để tìm kiếm, lọc, phân trang.
Mở Task Detail để tick subtask và log giờ.
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

Câu trả lời mẫu:

```text
Nhóm 2 chịu trách nhiệm TaskService. Service này quản lý toàn bộ vòng đời công việc,
từ tạo task, giao người phụ trách, đổi trạng thái, chia subtask đến log thời gian làm việc.
Các màn hình Kanban, Danh sách task, Gantt và Analytics đều lấy dữ liệu từ TaskService qua Gateway.
```

## 4. Nhóm 3 - Comment & Notify Service

Nhóm trưởng: Tuanhimmnz

Nhiệm vụ trọng tâm:

```text
JWT Auth: login, register, profile, đổi mật khẩu, phân quyền.
Admin User Management: danh sách user, role, tài khoản demo, reset mật khẩu.
Comment: bình luận theo task, sửa/xóa, tag thành viên.
Notification: tạo thông báo, xem danh sách, unread count, mark read, mark all read, delete.
Activity Log: ghi lại thao tác đăng nhập, profile, comment, notification và event nhận từ nhóm 1/2.
Internal Event: nhận event từ ProjectService và TaskService để sinh notification.
Diagnostics: kiểm tra Gateway, ProjectService, TaskService, NotifyService và route table.
Frontend demo chính và Gateway.
```

Chức năng cần demo kỹ nhất:

```text
Đăng nhập admin.
Đăng ký user mới.
Mở Admin để xem 20+ tài khoản demo và reset mật khẩu.
Mở Task Detail, thêm comment có @mention.
Mở Thông báo, mark read, mark all read, delete.
Mở Nhật ký để xem activity log tự động.
Mở Cài đặt/Diagnostics để kiểm tra cả 3 service OK.
Mở F12 chứng minh tất cả request đi qua Gateway.
```

API chính:

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/password
GET    /api/users/credentials
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
POST   /api/internal/task-events
POST   /api/internal/project-events
GET    /api/diagnostics/services
GET    /api/diagnostics/routes
```

Câu trả lời mẫu:

```text
Nhóm 3 là phần kết nối và trải nghiệm người dùng cuối. Nhóm 3 xử lý đăng nhập JWT,
quản lý tài khoản, comment theo task, notification trong app, activity log và Diagnostics.
Khi nhóm 1/2 tạo event, NotifyService nhận event để sinh thông báo cho người dùng liên quan.
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

Danh sách đầy đủ nằm trong trang Quản trị sau khi đăng nhập admin.

## 6. Checklist chấm nhanh

```text
Login admin thành công.
Dashboard có project/task/notification/service health.
Projects CRUD được.
Kanban đổi trạng thái task được.
Danh sách task có tìm kiếm, lọc, phân trang.
Task Detail tick subtask, log giờ, comment được.
Gantt có timeline.
Analytics có workload và leaderboard.
Wiki tạo tài liệu được.
Admin quản lý tài khoản và đổi mật khẩu được.
Notifications mark read/delete được.
Activity Log có dữ liệu.
Diagnostics báo Gateway và 3 service OK.
F12 chỉ thấy request qua Gateway.
```

## 7. Câu chốt khi bảo vệ

```text
Bọn em đã triển khai theo đúng yêu cầu: 3 service backend chạy Docker, VueJS chạy trực tiếp trên host,
Gateway là cổng API duy nhất cho frontend. Nhóm 3 nổi bật ở Auth, User Management, Comment,
Notification, Activity Log và Diagnostics để chứng minh hệ thống microservices kết nối thật.
```
