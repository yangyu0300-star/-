import * as Sentry from "@sentry/nextjs";

// Vercel 2024 新版 UI 加 env var 不便，先硬编码兜底（Sentry DSN 是公开的，浏览器必须能读到）
// 后续在 Vercel 加了 NEXT_PUBLIC_SENTRY_DSN 环境变量后可移除 fallback
const FALLBACK_DSN = "https://f43da2aa1bac992be48d710167b02f31@o4512410855211008.ingest.us.sentry.io/4512410909081600";
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN ?? FALLBACK_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  enabled: !!dsn,
});
