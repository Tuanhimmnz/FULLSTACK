#!/usr/bin/env bash
set -euo pipefail

PACKAGE_PATH="${1:-/tmp/sprintflow-frontend-fix.zip}"
WEB_ROOT="${2:-/var/www/sprintflow}"
APP_ROOT="${3:-/opt/sprintflow}"
TS="$(date +%Y%m%d-%H%M%S)"
LOG_DIR="/root/deploy-logs"
BACKUP_DIR="/root/backups"
WORK_DIR="/tmp/sprintflow-dist"
LOG_FILE="$LOG_DIR/sprintflow-ui-fix-$TS.log"

mkdir -p "$LOG_DIR" "$BACKUP_DIR" "$WORK_DIR"

{
  echo "=== SprintFlow frontend deploy ==="
  date
  echo "Package: $PACKAGE_PATH"
  echo "Web root: $WEB_ROOT"
  echo "App root: $APP_ROOT"

  echo "Step 1: backup current frontend"
  if [ -d "$WEB_ROOT" ]; then
    cp -a "$WEB_ROOT" "$BACKUP_DIR/sprintflow-www-$TS"
  fi

  echo "Step 2: extract new frontend dist"
  rm -rf "$WORK_DIR"/*
  unzip -oq "$PACKAGE_PATH" -d "$WORK_DIR" || true

  echo "Step 3: replace web root"
  mkdir -p "$WEB_ROOT"
  find "$WEB_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -a "$WORK_DIR"/. "$WEB_ROOT"/
  chown -R www-data:www-data "$WEB_ROOT" 2>/dev/null || true

  echo "Step 4: reload web server"
  systemctl reload caddy 2>/dev/null || systemctl reload nginx 2>/dev/null || true

  echo "Step 5: show deployed frontend assets"
  grep -o "assets/[^\"']*" "$WEB_ROOT/index.html" || true

  echo "Step 6: local health checks"
  curl -fsS http://127.0.0.1:7000/health || true
  echo
  curl -fsS http://127.0.0.1:5001/health || true
  echo
  curl -fsS http://127.0.0.1:5002/health || true
  echo
  curl -fsS http://127.0.0.1:5003/health || true
  echo

  echo "DONE"
} | tee "$LOG_FILE"

echo "LOG_FILE=$LOG_FILE"
