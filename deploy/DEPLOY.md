# 从 Vercel 迁到香港服务器（可大陆直连）

目标：`boxuezhe.cc` 不挂 VPN 也能在大陆打开。Supabase 云端数据库不迁移，只把 Next.js 挪到香港。

## 0. 前置说明

- 香港服务器不需要 ICP 备案；大陆服务器做论坛类 UGC 需要企业资质，个人走不通，所以选香港。
- Vercel 项目先别删，留作备份和回滚。

## 1. 买服务器

推荐：**腾讯云 轻量应用服务器 · 香港 · 2核2G · Ubuntu 24.04**（约 ¥24–40/月，大陆方向线路比阿里云香港轻量稳）。
预算 ¥100 内也可以选 CN2/优化线路的独立 VPS（搬瓦工 CN2 GIA、DMIT），但轻量云更省心。

买完记录：公网 IP、root 密码（或 SSH 密钥）。

防火墙/安全组放通：22、80、443。

## 2. 初始化系统

SSH 登录后依次执行：

```bash
# 时区、基础软件
sudo timedatectl set-timezone Asia/Shanghai
sudo apt update && sudo apt install -y git nginx certbot python3-certbot-nginx curl

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # 应输出 v22.x
```

## 3. 部署代码

```bash
# 专用运行用户
sudo useradd -m -s /bin/bash boxuezhe || true
sudo mkdir -p /var/www/boxuezhe
sudo chown -R boxuezhe:boxuezhe /var/www

# 拉代码（用 GitHub 仓库地址）
sudo -u boxuezhe git clone https://github.com/yangyu0300-star/-.git /var/www/boxuezhe
cd /var/www/boxuezhe

# 环境变量（和本地 .env.local 一致）
sudo -u boxuezhe tee /var/www/boxuezhe/.env.local >/dev/null <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://eggsumdkegskfzlgmnot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=粘贴你的 publishable key
EOF

# 安装依赖 + 构建
sudo -u boxuezhe npm ci
sudo -u boxuezhe npm run build
```

> `NEXT_PUBLIC_*` 是构建时写进产物的，改环境变量后必须重新 `npm run build`。

## 4. 用 systemd 常驻

```bash
sudo cp /var/www/boxuezhe/deploy/boxuezhe.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now boxuezhe
systemctl status boxuezhe --no-pager -l
curl -I http://127.0.0.1:3000     # 期望 200
```

## 5. Nginx 反代 + HTTPS

```bash
sudo cp /var/www/boxuezhe/deploy/nginx-boxuezhe.conf /etc/nginx/sites-available/boxuezhe.conf
sudo ln -sf /etc/nginx/sites-available/boxuezhe.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

先验证域名解析能到这台机器（见下一步），再签证书：

```bash
sudo certbot --nginx -d boxuezhe.cc -d www.boxuezhe.cc
```

## 6. DNS 先切子域名验证

在阿里云域名控制台 → 云解析 DNS：

1. 新增 `test` 的 **A 记录** → 服务器公网 IP（先别动主域）
2. 等 1–5 分钟，**手机用流量（不连 VPN）** 打开 `http://test.boxuezhe.cc`
3. 能正常看到首页、能发评论，再继续

验证通过后：

- 把 `@` 的 A 记录改成服务器 IP（原来是 Vercel 的解析）
- 把 `www` 改成 A 记录或 CNAME 指向 `@`
- 删除原来指向 Vercel 的记录
- 重新跑一次 `sudo certbot --nginx -d boxuezhe.cc -d www.boxuezhe.cc`

## 7. 验收

- 手机 4G/5G 不开 VPN，打开 `https://boxuezhe.cc`：列表、话题详情、发评论、投票、举报、`/admin` 全部走一遍
- 后台确认 Supabase 有新数据（说明服务器到 Supabase 出网正常）

## 8. 日常更新

```bash
bash /var/www/boxuezhe/deploy/update.sh
```

## 9. 回滚

DNS 把 `@` 改回 Vercel 的 CNAME 即可（项目还在，随时能切回）。
