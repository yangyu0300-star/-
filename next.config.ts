import { withSentryConfig } from "@sentry/nextjs/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 防点击劫持：禁止本站内容被 iframe 嵌入
          { key: "X-Frame-Options", value: "DENY" },
          // 防 MIME 嗅探：浏览器不许猜文件类型
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 控制 Referer 泄露：跨域请求只发 origin
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 权限策略：禁用不需要的浏览器功能
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "yangyu",
  project: "boxuezhe",
  silent: !process.env.NEXT_PUBLIC_SENTRY_DSN,
});
