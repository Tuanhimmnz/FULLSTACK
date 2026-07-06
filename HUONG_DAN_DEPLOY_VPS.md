# Huong Dan Deploy SprintFlow Len VPS

## 1. Dia chi demo

- Frontend public: `http://103.77.242.126`
- API Gateway public: `http://103.77.242.126/api`
- Gateway health: `http://103.77.242.126/health`

Tai khoan demo:

```text
admin@projecthub.com / admin123
```

## 2. Kien truc dang chay tren VPS

```text
Vue frontend: /var/www/sprintflow, chay truc tiep tren host, khong Docker
API Gateway: Docker container, port noi bo 7000
ProjectService nhom 1: Docker container, port noi bo 5001
TaskService nhom 2: Docker container, port noi bo 5002
NotifyService nhom 3: Docker container, port noi bo 5003
SQL Server: Docker container, database ProjectDB, TaskDB, NotifyDB
```

Frontend chi goi `http://103.77.242.126/api/...`. Gateway route request sang 3 service.

## 3. Lenh deploy frontend moi len VPS

Chay o may local:

```powershell
cd C:\Users\linzi\Downloads\BTL_FULLSTACK\ProjectHub
npm.cmd run build --prefix frontend

Compress-Archive -Path frontend\dist\* -DestinationPath deploy\sprintflow-frontend-fix.zip -Force
pscp deploy\sprintflow-frontend-fix.zip root@103.77.242.126:/tmp/sprintflow-frontend-fix.zip
pscp scripts\deploy-vps-frontend.sh root@103.77.242.126:/tmp/deploy-vps-frontend.sh
plink root@103.77.242.126 "chmod +x /tmp/deploy-vps-frontend.sh && /tmp/deploy-vps-frontend.sh /tmp/sprintflow-frontend-fix.zip /var/www/sprintflow /opt/sprintflow"
```

Script `scripts/deploy-vps-frontend.sh` se:

```text
1. Backup frontend cu trong /root/backups/sprintflow-www-<time>
2. Giai nen dist moi vao /tmp/sprintflow-dist
3. Thay noi dung /var/www/sprintflow
4. Reload Caddy/Nginx neu co
5. In asset moi va health check 4 service
6. Luu log tai /root/deploy-logs/sprintflow-ui-fix-<time>.log
```

Lan deploy gan nhat da tao log:

```text
/root/deploy-logs/sprintflow-ui-fix-20260704-015225.log
```

## 4. Lenh deploy backend Docker neu co sua backend

SSH vao VPS:

```bash
ssh root@103.77.242.126
cd /opt/sprintflow
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

Kiem tra health trong VPS:

```bash
curl http://127.0.0.1:7000/health
curl http://127.0.0.1:5001/health
curl http://127.0.0.1:5002/health
curl http://127.0.0.1:5003/health
```

## 5. Kiem tra sau khi deploy

Tren trinh duyet:

```text
1. Mo http://103.77.242.126
2. Ctrl + F5 de xoa cache
3. F12 -> Network -> Fetch/XHR
4. Login admin@projecthub.com / admin123
5. Kiem tra request deu di qua http://103.77.242.126/api/...
```

API public da test:

```text
POST /api/auth/login: OK
GET /api/projects: OK
GET /api/tasks: OK
GET /api/users: OK
GET /api/notifications: OK
```

## 6. Cap nhat moi: RabbitMQ va AI

Backend Docker tren VPS hien co them RabbitMQ:

```text
RabbitMQ container: rabbitmq:3-management
Exchange: sprintflow.events
Queue NotifyService consume: notify.events
ProjectService va TaskService publish event vao exchange nay.
NotifyService consume queue de tao notification va activity log.
```

Bien moi trong `.env.prod`:

```bash
RABBITMQ_ENABLED=true
RABBITMQ_USER=sprintflow
RABBITMQ_PASSWORD=doi-mat-khau-rabbitmq
RABBITMQ_EXCHANGE=sprintflow.events
RABBITMQ_QUEUE=notify.events

AI_PROVIDER_TOKEN=
AI_PROVIDER_BASE_URL=
AI_PROVIDER_MODEL=

# Provider phu OpenAI-compatible, dung khi Gemini/provider chinh bi rate limit.
AI_FALLBACK_PROVIDER_TOKEN=
AI_FALLBACK_PROVIDER_BASE_URL=
AI_FALLBACK_PROVIDER_MODEL=
```

Luu y bao mat:

```text
Khong dua token AI vao frontend Vue.
Frontend chi goi /api/ai/* qua Gateway.
NotifyService doc token tu env. Khong co token thi dung fallback demo bang data that.
Neu co provider chinh va phu, backend thu provider chinh truoc, gap 429/loi thi tu chuyen sang provider phu.
```

Vi du cau hinh provider phu:

```bash
AI_FALLBACK_PROVIDER_BASE_URL=https://api.example.com
AI_FALLBACK_PROVIDER_MODEL=gpt-4
AI_FALLBACK_PROVIDER_TOKEN=<dat-token-tren-vps-khong-commit-git>
```

Neu base URL chi la domain goc, backend se tu thu ca `/chat/completions` va `/v1/chat/completions`.

Test nhanh sau deploy:

```powershell
.\scripts\test-sprintflow-ai-broker.ps1 -ApiBase http://103.77.242.126/api
```

Test tren VPS:

```bash
cd /opt/sprintflow
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
curl http://127.0.0.1:7000/health
curl -H "Authorization: Bearer <TOKEN>" http://127.0.0.1:7000/api/diagnostics/broker
```
