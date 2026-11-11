// 临时测试页：访问此页面会主动抛一个错误，用于验证 Sentry 链路
// 验证完成后立即删除
export default function TestSentryPage() {
  throw new Error("Sentry 链路测试：这是一个刻意触发的错误，来自 /test-sentry");
}
