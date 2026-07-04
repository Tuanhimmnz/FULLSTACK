# Hướng Dẫn Chạy 3 Nhóm SprintFlow

## 1. Mô hình chạy chuẩn

Ứng dụng triển khai theo đúng yêu cầu: 3 service backend chạy bằng Docker, VueJS chạy trực tiếp trên host, frontend chỉ gọi API Gateway.

```text
Người dùng -> Frontend Vue
Frontend Vue -> API Gateway
API Gateway -> ProjectService / TaskService / NotifyService
SQL Server -> ProjectDB / TaskDB / NotifyDB
```

Luồng kết nối cần trình bày:

```text
Frontend Vue không biết port 5001/5002/5003.
Frontend chỉ gọi http://<host>:7000/api hoặc http://103.77.242.126/api.
Gateway nhận request, kiểm tra JWT, sau đó route:
- /api/projects -> ProjectService của nhóm 1.
- /api/tasks -> TaskService của nhóm 2.
- /api/auth, /api/users, /api/notifications, /api/activity-logs, /api/tasks/{id}/comments -> NotifyService của nhóm 3.
ProjectService và TaskService không ghi DB của nhóm 3; hai service này chỉ bắn internal event sang NotifyService.
NotifyService nhận event để tạo notification và activity log.
```

## 2. Tài khoản demo

Tài khoản chính:

```text
admin@projecthub.com / admin123
pm@projecthub.com / 123456
dev@projecthub.com / 123456
member@projecthub.com / 123456
viewer@projecthub.com / 123456
```

Tài khoản seed thêm để chia task:

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

Admin có thể vào trang `Quản trị` để xem danh sách tài khoản, role, mật khẩu demo, sửa hồ sơ người dùng, phân trang danh sách và reset mật khẩu.

## 3. Chạy local để kiểm tra giao diện

Chạy backend bằng Docker:

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
Copy-Item .env.local.example .env -Force
docker compose -f docker-compose.microservices.yml up -d --build
```

Chạy Vue trực tiếp trên host:

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
npm install --prefix frontend
$env:VITE_API_BASE_URL="http://localhost:7000/api"
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

Mở:

```text
http://localhost:8080
```

Nếu muốn máy khác cùng mạng mở được, dùng IP máy đang chạy frontend:

```text
http://<IP_MAY_CUA_BAN>:8080
```

## 4. Chạy riêng theo nhóm

Nhóm 1 - Project & Member Service:

```powershell
docker compose -f docker-compose.group1.yml up -d --build
```

Nhóm 2 - Task & Kanban Service:

```powershell
docker compose -f docker-compose.group2.yml up -d --build
```

Nhóm 3 - Notify Service + API Gateway + Frontend host:

```powershell
docker compose -f docker-compose.group3.yml up -d --build
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

Lưu ý khi chỉ chạy phần nhóm 3:

```text
docker-compose.group3.yml chỉ chạy SQL Server, NotifyService và API Gateway.
Các API nhóm 3 vẫn chạy đầy đủ: auth, users, comments, notifications, activity-logs, diagnostics.
Nếu muốn demo cả /api/projects và /api/tasks thì phải chạy thêm group1/group2 hoặc chạy compose tổng.
Ngày mai nếu thầy yêu cầu "mỗi nhóm chạy phần của mình", nhóm 3 mở group3, còn nhóm 1/2 mở compose riêng của họ.
Khi muốn demo toàn bộ hệ thống kết nối đủ 3 nhóm, dùng docker-compose.microservices.yml hoặc docker-compose.prod.yml.
```

Các cổng chính:

```text
Gateway:        7000
ProjectService: 5001
TaskService:    5002
NotifyService:  5003
SQL Server:     14333
Frontend:       8080
```

## 5. Chạy production trên VPS

Trên VPS Ubuntu:

```bash
cd /opt/sprintflow
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
./scripts/deploy-production.sh
```

Mở public:

```text
http://103.77.242.126
```

Kiểm tra container:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
./scripts/check-production.sh
```

## 6. Kiểm tra nhanh

Trên Windows:

```powershell
.\scripts\check-sprintflow-health.ps1
.\scripts\test-sprintflow-flow.ps1
```

Kết quả đúng cần có:

```text
Gateway OK
ProjectService OK
TaskService OK
NotifyService OK
Login nhận JWT token
Tạo project thành công
Tạo task thành công
Thêm comment thành công
Đọc notification và activity log thành công
```

## 7. Chức năng cần bấm khi demo

```text
Dashboard: xem thống kê, tìm kiếm task/project, burndown chart, notification popup.
Projects: xem project, thành viên, tiến độ, quản lý member.
Tasks: lọc, tìm kiếm, phân trang, mở chi tiết task.
Kanban: đổi trạng thái task theo cột.
Tiến độ (Gantt): xem timeline task theo ngày/tuần, lọc theo project, mở chi tiết task.
Thống kê: xem workload theo vai trò, phân bổ trạng thái, leaderboard năng suất.
Tài liệu: lưu yêu cầu, API spec, checklist deploy, biên bản họp theo từng project.
Task Detail: tick subtask, hoàn thành toàn bộ subtask, log giờ, comment, @mention.
Admin: xem thống kê người dùng, danh sách tài khoản có phân trang, sửa hồ sơ, đổi role, xem mật khẩu demo, reset mật khẩu.
Notifications: lọc all/unread/read, mark read, mark all read, delete.
Settings/Diagnostics: kiểm tra Gateway và 3 service.
```

## 8. Cách nói ngắn gọn với thầy

```text
Bọn em chia thành 3 service đúng theo nhóm. Nhóm 1 quản lý Project, nhóm 2 quản lý Task/Kanban,
nhóm 3 quản lý Auth/User/Comment/Notification/Activity Log và vận hành Gateway.

VueJS chạy trực tiếp trên host, không chạy Docker. Ba service backend và Gateway chạy bằng Docker.
Frontend chỉ gọi Gateway. Gateway route request sang từng service theo path nên F12 chỉ thấy /api/... qua một địa chỉ.

Các service dùng database riêng trong SQL Server, không foreign key chéo database.
Khi ProjectService hoặc TaskService có sự kiện như giao task, đổi trạng thái, cập nhật member,
service đó gửi event sang NotifyService để sinh thông báo trong app và ghi activity log.
```
