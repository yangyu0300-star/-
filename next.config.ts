import { withSentryConfig } from "@sentry/nextjs/config";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "yangyu",
  project: "boxuezhe",
  silent: !process.env.NEXT_PUBLIC_SENTRY_DSN,
});
