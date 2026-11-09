#!/usr/bin/env bash
# 服务器上拉取最新代码并重启。首次部署见 deploy/DEPLOY.md
set -euo pipefail

APP_DIR=/var/www/boxuezhe

cd "$APP_DIR"
git pull --ff-only
npm ci
npm run build
sudo systemctl restart boxuezhe
sudo systemctl status boxuezhe --no-pager -l
