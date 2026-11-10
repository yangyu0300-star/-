import * as Sentry from "@sentry/nextjs";

// 浏览器端只能访问 NEXT_PUBLIC_ 前缀的环境变量
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;

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
