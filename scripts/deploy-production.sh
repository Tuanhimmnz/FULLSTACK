#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.prod"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing .env.prod. Copy .env.prod.example to .env.prod and update domain/password values." >&2
  exit 1
fi

set -a
source "${ENV_FILE}"
set +a

FRONTEND_ROOT="${FRONTEND_ROOT:-/var/www/sprintflow}"
APP_PUBLIC_URL="${APP_PUBLIC_URL:-http://${APP_DOMAIN}}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-${APP_PUBLIC_URL}/api}"

cd "${ROOT_DIR}"
docker compose -f docker-compose.prod.yml --env-file "${ENV_FILE}" up -d --build

cd "${ROOT_DIR}/frontend"
npm install
VITE_API_BASE_URL="${VITE_API_BASE_URL}" npm run build

sudo mkdir -p "${FRONTEND_ROOT}"
sudo rm -rf "${FRONTEND_ROOT:?}/"*
sudo cp -r dist/* "${FRONTEND_ROOT}/"

sudo cp "${ROOT_DIR}/Caddyfile" /etc/caddy/Caddyfile
sudo systemctl reload caddy

echo "SprintFlow production deployment completed."
echo "Frontend: ${APP_PUBLIC_URL}"
echo "Gateway:  ${VITE_API_BASE_URL}"
