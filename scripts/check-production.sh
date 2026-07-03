#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.prod"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing .env.prod" >&2
  exit 1
fi

set -a
source "${ENV_FILE}"
set +a

APP_PUBLIC_URL="${APP_PUBLIC_URL:-http://${APP_DOMAIN}}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-${APP_PUBLIC_URL}/api}"

check() {
  local name="$1"
  local url="$2"
  echo "==> ${name}: ${url}"
  curl -fsS "${url}" && echo
}

check "Frontend" "${APP_PUBLIC_URL}"
check "Gateway" "${APP_PUBLIC_URL}/health"

echo "==> Gateway login: ${VITE_API_BASE_URL}/auth/login"
login_response="$(
  curl -fsS \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@projecthub.com","password":"admin123"}' \
    "${VITE_API_BASE_URL}/auth/login"
)"
token="$(
  printf '%s' "${login_response}" | node -e "let s=''; process.stdin.on('data', d => s += d); process.stdin.on('end', () => console.log(JSON.parse(s).token || ''));"
)"

if [[ -z "${token}" ]]; then
  echo "Login did not return token" >&2
  exit 1
fi

echo "==> Gateway diagnostics: ${VITE_API_BASE_URL}/diagnostics/services"
curl -fsS -H "Authorization: Bearer ${token}" "${VITE_API_BASE_URL}/diagnostics/services" && echo

echo "==> Gateway routes: ${VITE_API_BASE_URL}/diagnostics/routes"
curl -fsS -H "Authorization: Bearer ${token}" "${VITE_API_BASE_URL}/diagnostics/routes" && echo

echo "Production health checks completed."
