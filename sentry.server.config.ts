import * as Sentry from "@sentry/nextjs";

const FALLBACK_DSN = "https://f43da2aa1bac992be48d710167b02f31@o4512410855211008.ingest.us.sentry.io/4512410909081600";
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN ?? FALLBACK_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: 0.1,
  enabled: !!dsn,
});
