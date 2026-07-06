# Kịch Bản Trả Lời Thầy

## 1. Mở đầu

```text
Bọn em xây dựng SprintFlow theo mô hình microservices cho đề tài quản lý dự án và phân công công việc.
Frontend dùng VueJS, chạy trực tiếp trên host, không đóng Docker.
Ba service backend chạy bằng Docker: ProjectService, TaskService, NotifyService.
API Gateway là cổng vào duy nhất cho frontend, frontend không gọi thẳng từng service.
```

## 2. Kiến trúc triển khai

```text
Người dùng -> VueJS Frontend -> API Gateway -> ProjectService / TaskService / NotifyService -> SQL Server
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
Khi project có thay đổi quan trọng, service có thể gửi event sang nhóm 3 để tạo thông báo.
```

Nhóm 2 - Task & Kanban Service:

```text
Nhóm 2 phụ trách task, Kanban, subtask, worklog, deadline và lịch sử trạng thái.
Các chức năng chính gồm tạo task, đổi trạng thái task, tích hoàn thành subtask, log giờ làm,
xem danh sách công việc, biểu đồ Gantt và thống kê nguồn lực.
```

Nhóm 3 - Comment & Notify Service:

```text
Nhóm 3 phụ trách JWT login/register, quản lý tài khoản, hồ sơ người dùng, comment task,
notification, activity log và diagnostics.
Nhóm 3 cũng vận hành Gateway và frontend demo chính để chứng minh 3 service kết nối với nhau.
```

## 4. Điểm nhấn chức năng

```text
Dashboard có dữ liệu thật từ Gateway, thống kê project, task, notification và service health.
Kanban cho phép đổi trạng thái task và mở chi tiết task.
Danh sách công việc có tìm kiếm, lọc, phân trang, tiến độ, ưu tiên và người phụ trách.
Task Detail có subtask, worklog, comment, tag thành viên, activity timeline và cập nhật tiến độ.
Gantt hiển thị tiến độ theo thời gian, lọc theo project và mở chi tiết task.
Analytics thống kê trạng thái, workload, người quá tải và bảng xếp hạng năng suất.
Wiki lưu tài liệu dự án, API specs, checklist triển khai và ghi chú họp.
Admin quản lý người dùng, tài khoản demo, vai trò, đổi mật khẩu, import nhân viên hàng loạt từ file CSV/Excel và xuất danh sách tài khoản.
Notifications có lọc all/unread/read, mark read, mark all read, delete và xuất file CSV.
Các trang Projects, Kanban, My Task, Gantt, Analytics, Wiki, Notifications, Activity Log đều có nút tải dữ liệu để lưu trữ.
Diagnostics kiểm tra Gateway, ProjectService, TaskService, NotifyService và route table.
```

## 5. Cách chứng minh F12

```text
Thầy mở F12 -> Network -> Fetch/XHR.
Em thao tác login, Projects, Tasks, Kanban, Gantt, Analytics, Notifications và Admin.
Tất cả request nghiệp vụ đều đi qua Gateway.
Không có request nào từ frontend gọi thẳng ProjectService, TaskService hoặc NotifyService.
```

Các request cần chỉ cho thầy:

```text
POST  /api/auth/login
GET   /api/projects
GET   /api/tasks
GET   /api/users/credentials
POST  /api/tasks/{taskId}/comments
POST  /api/tasks/{taskId}/subtasks
POST  /api/tasks/{taskId}/worklogs
GET   /api/notifications
GET   /api/activity-logs
GET   /api/diagnostics/services
```

## 6. Cách trả lời khi thầy hỏi về database

```text
Mỗi service quản lý dữ liệu của mình, tránh foreign key chéo service.
ProjectService quản lý ProjectDB.
TaskService quản lý TaskDB.
NotifyService quản lý NotifyDB, trong đó có user, comment, notification và activity log.
Khi demo local hoặc VPS, SQL Server chạy trong Docker để dễ dựng môi trường đồng nhất.
```

## 7. Tài khoản demo

```text
admin@projecthub.com / admin123      Admin
pm@projecthub.com    / 123456        Project Manager
backend01@projecthub.com / 123456    Backend Developer
frontend01@projecthub.com / 123456   Frontend Developer
qa01@projecthub.com / 123456         Tester
viewer01@projecthub.com / 123456     Viewer
```

Trong trang Admin có danh sách đầy đủ khoảng 20 tài khoản demo để thầy kiểm thử phân quyền và chia task.

## 8. Kết luận ngắn

```text
Điểm chính của bài là bọn em không làm một app nguyên khối.
Bọn em tách thành 3 service backend, có Gateway tổng hợp API, frontend chỉ gọi Gateway,
có dữ liệu demo đủ lớn, có kiểm thử nhanh bằng script và có giao diện quản trị trực quan để demo.
```
