# Báo Cáo Chức Năng Chi Tiết SprintFlow

## 1. Tổng quan hệ thống

SprintFlow là hệ thống quản lý dự án và phân công công việc theo mô hình microservices.

```text
Frontend VueJS -> API Gateway -> 3 service backend
ProjectService -> ProjectDB
TaskService -> TaskDB
NotifyService -> NotifyDB
```

Frontend chỉ gọi Gateway. Khi mở F12/Network, các request nghiệp vụ phải đi qua `/api/...`, không gọi thẳng port service.

## 2. Phân công nhiệm vụ 3 nhóm

### Nhóm 1 - Project & Member Service

Phụ trách quản lý dự án và thành viên.

Chức năng:

```text
CRUD project
Quản lý thành viên theo vai trò
Theo dõi tiến độ project
Project activity
Publish project event cho NotifyService
```

Màn hình liên quan:

```text
Projects
Dashboard project cards
Admin project management
Diagnostics route /api/projects
```

### Nhóm 2 - Task & Kanban Service

Phụ trách quản lý công việc, Kanban, subtask, worklog và lịch sử task.

Chức năng:

```text
CRUD task
Kanban: Backlog, ToDo, InProgress, Review, Done
Danh sách task có tìm kiếm, filter, phân trang
Subtask checklist
Worklog/log giờ làm
Đổi trạng thái task
Timeline Gantt
Analytics workload
Publish task event cho NotifyService
```

Màn hình liên quan:

```text
Tasks
Kanban
Task Detail
Gantt
Analytics
Dashboard task stats
Diagnostics route /api/tasks
```

### Nhóm 3 - Comment & Notify Service

Phụ trách Auth, User, Comment, Notification, Activity Log và Gateway demo.

Chức năng:

```text
JWT login/register/profile/password
Admin quản lý tài khoản, xem mật khẩu demo, reset mật khẩu, đổi role
Comment CRUD theo task
Mention @user trong comment
Notification center: all/unread/read, mark read, mark all read, delete
Activity log tự động
Consume task/project events
Settings/Diagnostics kiểm tra 3 service
```

Màn hình liên quan:

```text
Login/Register
Profile
Admin
Task Detail comments
Notifications
Activity Log
Settings/Diagnostics
Wiki/Tài liệu demo
```

## 3. Chức năng tăng điểm mới

### Dashboard

```text
Thống kê tổng task, task đang làm, task quá hạn, thành viên online
Service health cho 3 nhóm
Burndown chart 7 ngày
Tìm kiếm task/project
Tài khoản demo nhanh
Notification badge và popup
```

### Tasks

```text
Danh sách task dạng bảng
Search theo title, mô tả, project, người phụ trách
Filter theo trạng thái, ưu tiên, project
Phân trang khoảng 10 task/trang
Mở Task Detail trực tiếp
Hiển thị progress theo subtask và logged hours
```

### Task Detail

```text
Đổi trạng thái task
Tick từng subtask
Hoàn thành toàn bộ subtask
Log giờ làm việc
Blocked by task
Tag @member trong comment
Comment CRUD
Activity timeline
```

### Gantt

```text
Timeline theo ngày/tuần
Filter theo project
Thanh task theo createdAt -> dueDate
Màu task theo trạng thái
Avatar người phụ trách
Click task mở Task Detail
```

### Analytics

```text
Tổng số task đang làm, trễ hạn, hoàn thành
Biểu đồ donut trạng thái task
Biểu đồ workload theo role
Chi tiết tải việc từng người
Leaderboard năng suất
```

### Wiki/Tài liệu

```text
Tạo/sửa/xóa tài liệu project
Lọc tài liệu theo project
Tìm kiếm tài liệu
Lưu yêu cầu, API spec, checklist deploy, biên bản họp
Lưu localStorage để demo chắc chắn không phụ thuộc backend mới
```

### Admin User Management

```text
Thống kê tổng người dùng, online, manager, viewer
Danh sách người dùng đầy đủ
Xem email, role, mật khẩu demo
Đổi role
Reset mật khẩu
```

## 4. Dữ liệu demo

Hệ thống seed sẵn nhiều project, hơn 20 tài khoản và nhiều task chi tiết để đủ phân trang, thống kê, Gantt và Kanban.

Tài khoản chính:

```text
admin@projecthub.com / admin123
pm@projecthub.com / 123456
dev@projecthub.com / 123456
member@projecthub.com / 123456
viewer@projecthub.com / 123456
```

Tài khoản chia việc:

```text
backend01@projecthub.com / 123456
backend02@projecthub.com / 123456
frontend01@projecthub.com / 123456
frontend02@projecthub.com / 123456
ba01@projecthub.com / 123456
ba02@projecthub.com / 123456
qa01@projecthub.com / 123456
qa02@projecthub.com / 123456
devops01@projecthub.com / 123456
uiux01@projecthub.com / 123456
uiux02@projecthub.com / 123456
member01@projecthub.com / 123456
member02@projecthub.com / 123456
viewer01@projecthub.com / 123456
viewer02@projecthub.com / 123456
```

## 5. Cách chứng minh với thầy

```text
1. Login admin.
2. Mở F12 -> Network -> Fetch/XHR.
3. Chứng minh request login đi qua Gateway.
4. Vào Dashboard, Projects, Kanban, Tasks.
5. Mở Task Detail, tick subtask, log giờ, comment @mention.
6. Vào Gantt chứng minh timeline.
7. Vào Analytics chứng minh thống kê nguồn lực.
8. Vào Wiki chứng minh tài liệu dự án.
9. Vào Admin chứng minh quản lý tài khoản, role, reset mật khẩu.
10. Vào Diagnostics chứng minh 3 service OK.
```
