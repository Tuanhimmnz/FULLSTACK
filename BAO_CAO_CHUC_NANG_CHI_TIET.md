# Báo Cáo Chức Năng Chi Tiết SprintFlow

## 1. Tổng quan hệ thống

SprintFlow là hệ thống quản lý dự án và phân công công việc theo mô hình microservices.

```text
Frontend VueJS -> API Gateway -> 3 service backend
ProjectService -> ProjectDB
TaskService -> TaskDB
NotifyService -> NotifyDB
ProjectService / TaskService -> RabbitMQ -> NotifyService
```

Frontend chỉ gọi Gateway. Khi mở F12/Network, các request nghiệp vụ phải đi qua `/api/...`, không gọi thẳng port service.

## 2. Chức năng theo nhóm

### Nhóm 1 - Project & Member Service

```text
CRUD project.
Quản lý thành viên theo vai trò Owner, Manager, Member, Viewer.
Theo dõi tiến độ project.
Sprint, milestone, project activity.
Publish project event qua RabbitMQ cho NotifyService.
```

Màn hình liên quan:

```text
Projects
Dashboard project cards
Admin project management
Diagnostics route /api/projects
```

### Nhóm 2 - Task & Kanban Service

```text
CRUD task.
Kanban: Backlog, ToDo, InProgress, Review, Done.
Danh sách task có tìm kiếm, filter, phân trang.
My Task có lịch task, board detail, Kanban và tải CSV.
Subtask checklist.
Worklog/log giờ làm.
Timeline Gantt.
Analytics workload và leaderboard.
Publish task event qua RabbitMQ cho NotifyService.
```

Màn hình liên quan:

```text
My Task
Kanban
Task Detail
Gantt
Analytics
Dashboard task stats
Diagnostics route /api/tasks
```

### Nhóm 3 - Comment & Notify Service

```text
JWT login/register/profile/password.
Admin quản lý tài khoản, xem mật khẩu demo, reset mật khẩu, đổi role.
Import nhân viên hàng loạt bằng CSV/Excel và xuất danh sách tài khoản.
Comment CRUD theo task, mention @user.
Notification center: all/unread/read, mark read, mark all read, delete.
Activity log tự động.
Consume project/task events từ RabbitMQ.
AI Assistant: chat, suggest task, create task from text, summarize project, meeting to tasks.
Settings/Diagnostics kiểm tra 3 service, broker và route table.
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
Landing AI widget
My Task AI Assistant
```

## 3. Chức năng tăng điểm

### Dashboard

```text
Thống kê tổng task, task đang làm, task quá hạn, thành viên online.
Service health cho 3 nhóm.
Burndown chart 7 ngày.
Tìm kiếm task/project.
Notification badge và popup.
```

### Projects

```text
Tạo dự án.
Sửa tên, mô tả, trạng thái, màu nhận diện.
Quản lý thành viên dự án.
Theo dõi tiến độ từng project.
Xuất dữ liệu project ra CSV.
```

### My Task / Kanban

```text
Lịch công việc theo ngày.
Bảng kéo thả trạng thái.
Board detail bên phải.
Tạo task nhanh.
Thanh cuộn ngang đặt ở phía trên để dễ demo màn hình nhỏ.
Tải CSV danh sách task.
```

### Task Detail

```text
Đổi trạng thái task.
Tick từng subtask.
Tự cập nhật tiến độ theo subtask/worklog.
Log giờ làm việc.
Blocked by task.
Tag @member trong comment.
Comment CRUD.
Activity timeline.
```

### Gantt

```text
Timeline theo ngày/tuần.
Filter theo project.
Thanh task theo createdAt -> dueDate.
Màu task theo trạng thái.
Avatar người phụ trách.
Click task mở Task Detail.
```

### Analytics

```text
Tổng số task đang làm, trễ hạn, hoàn thành.
Biểu đồ donut trạng thái task.
Biểu đồ workload theo role.
Chi tiết tải việc từng người.
Leaderboard năng suất.
```

### Admin User Management

```text
Thống kê tổng người dùng, online, manager, viewer.
Danh sách người dùng đầy đủ và phân trang.
Tìm kiếm theo tên/email/role.
Xem email, role, mật khẩu demo.
Đổi role.
Reset mật khẩu.
Import nhân viên hàng loạt bằng file CSV/Excel.
Xuất thông tin tài khoản ra CSV.
```

### AI Assistant

```text
Landing page có AI giới thiệu sản phẩm.
My Task có panel AI cho nhân viên và admin.
Nhân viên có thể hỏi AI, tóm tắt công việc và xem gợi ý task.
Admin/Project Manager có thể yêu cầu AI lập nháp task và xác nhận tạo task thật.
Token AI nằm ở backend env, không đưa vào Vue.
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
4. Vào Dashboard, Projects, Kanban, My Task.
5. Mở Task Detail, tick subtask, log giờ, comment @mention.
6. Vào Gantt chứng minh timeline.
7. Vào Analytics chứng minh thống kê nguồn lực.
8. Vào Admin chứng minh quản lý tài khoản, role, reset mật khẩu, import/export.
9. Vào My Task, dùng AI gợi ý task và tạo task.
10. Vào Diagnostics chứng minh 3 service và RabbitMQ OK.
```
