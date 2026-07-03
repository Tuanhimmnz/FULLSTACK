# SprintFlow - De Tai 06

He thong quan ly du an va phan cong cong viec theo Kanban/Scrum, kien truc microservices ASP.NET Core 8 + Vue 3.

## Repo va nhanh

Remote nop bai:

```text
https://github.com/Chien2711/BTL-Full-Stack.git
```

Nhanh chinh theo nhom:

```text
main                  Tong hop
nhom-1-chien2711      Project & Member Service
nhom-2-ngocbao72      Task & Kanban Service
nhom-3-tuanhimmnz     Comment & Notify Service, Gateway, Frontend
```

## Kien truc chay demo

```text
Frontend Vue:      http://<IP_MAY_DEMO>:8080
API Gateway:       http://<IP_MAY_DEMO>:7000
Project Service:   http://<IP_MAY_DEMO>:5001/swagger
Task Service:      http://<IP_MAY_DEMO>:5002/swagger
Notify Service:    http://<IP_MAY_DEMO>:5003/swagger
SQL Server:        <IP_MAY_DEMO>,14333
```

Frontend chi goi API Gateway. Khi mo F12/Network, request nghiep vu phai di qua:

```text
http://<IP_MAY_DEMO>:7000/api/...
```

## Chay nhanh full server

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
Copy-Item .env.local.example .env -Force
docker compose -f docker-compose.microservices.yml up -d --build
npm install --prefix frontend
npm run dev --prefix frontend -- --host 0.0.0.0 --port 8080
```

Mo web:

```text
http://localhost:8080
http://<IP_MAY_DEMO>:8080
```

Tai khoan:

```text
admin@projecthub.com / admin123
pm@projecthub.com    / 123456
dev@projecthub.com   / 123456
viewer@projecthub.com / 123456
```

## Test nhanh

```powershell
.\scripts\check-sprintflow-health.ps1
.\scripts\test-sprintflow-flow.ps1
```

Mo terminal va browser demo:

```powershell
.\scripts\open-demo-windows.ps1
```

## Tai lieu

```text
HUONG_DAN_CHAY_3_NHOM.md
HUONG_DAN_F12_TEST_API.md
HUONG_DAN_DEMO_DAY_DU.md
BAO_CAO_CHUC_NANG_CHI_TIET.md
KICH_BAN_TRA_LOI_THAY.md
```
