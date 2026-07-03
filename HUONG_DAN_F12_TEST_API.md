# Hướng Dẫn Test API Bằng F12

## 1. Mở ứng dụng

Local:

```text
http://localhost:8080
```

VPS sau khi deploy:

```text
http://103.77.242.126
```

Đăng nhập:

```text
admin@projecthub.com / admin123
```

## 2. Bật Network

1. Bấm `F12`.
2. Chọn tab `Network`.
3. Chọn bộ lọc `Fetch/XHR`.
4. Tick `Preserve log` nếu cần giữ request khi chuyển trang.
5. Bấm từng chức năng và đọc cột `Name`, `Status`, `Method`, `Initiator`.

## 3. Request bắt buộc phải đi qua Gateway

Khi chạy local với Gateway `7100`:

```text
POST  http://localhost:7100/api/auth/login
GET   http://localhost:7100/api/projects
GET   http://localhost:7100/api/tasks
GET   http://localhost:7100/api/notifications
GET   http://localhost:7100/api/users
GET   http://localhost:7100/api/users/credentials
POST  http://localhost:7100/api/tasks/{taskId}/comments
PUT   http://localhost:7100/api/tasks/{taskId}/subtasks/{subTaskId}/toggle
POST  http://localhost:7100/api/tasks/{taskId}/worklogs
PATCH http://localhost:7100/api/notifications/{id}/read
```

Khi chạy VPS:

```text
POST  http://103.77.242.126/api/auth/login
GET   http://103.77.242.126/api/projects
GET   http://103.77.242.126/api/tasks
GET   http://103.77.242.126/api/notifications
GET   http://103.77.242.126/api/users
GET   http://103.77.242.126/api/users/credentials
POST  http://103.77.242.126/api/tasks/{taskId}/comments
PUT   http://103.77.242.126/api/tasks/{taskId}/subtasks/{subTaskId}/toggle
POST  http://103.77.242.126/api/tasks/{taskId}/worklogs
PATCH http://103.77.242.126/api/notifications/{id}/read
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

Nếu thấy request nghiệp vụ đi thẳng vào các port trên thì sai kiến trúc Gateway.

## 5. Luồng demo cho thầy

1. Login admin và chỉ ra request `/api/auth/login`.
2. Vào Dashboard, chứng minh request `/api/projects`, `/api/tasks`, `/api/notifications`.
3. Dùng ô tìm kiếm để lọc project/task.
4. Vào Projects để chứng minh chức năng nhóm 1.
5. Vào Tasks, lọc và chuyển trang để chứng minh nhiều dữ liệu task.
6. Vào Kanban, đổi trạng thái task để chứng minh nhóm 2.
7. Mở Task Detail, tick subtask, log giờ, comment và @mention để chứng minh nhóm 3.
8. Vào Admin, xem thống kê user, danh sách tài khoản, role, mật khẩu demo và reset mật khẩu.
9. Vào Notifications, mark read, mark all read hoặc delete.
10. Vào Settings/Diagnostics để kiểm tra Gateway và 3 service OK.

## 6. Test terminal trước khi chấm

```powershell
.\scripts\check-sprintflow-health.ps1
.\scripts\test-sprintflow-flow.ps1
```
