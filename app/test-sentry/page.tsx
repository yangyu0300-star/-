"use client";

// 调试 Sentry 是否真的加载：直接从浏览器手动 init + captureException
import * as Sentry from "@sentry/nextjs";
import { useState, useEffect } from "react";

const DSN = "https://f43da2aa1bac992be48d710167b02f31@o4512410855211008.ingest.us.sentry.io/4512410909081600";

export default function TestSentryPage() {
  const [status, setStatus] = useState("等待触发...");

  useEffect(() => {
    // 确认 Sentry SDK 是否真的加载了
    const loaded = typeof (Sentry as any).captureException === "function";
    setStatus(`Sentry 已加载: ${loaded} | DSN: ${DSN.slice(0, 20)}...`);
  }, []);

  return (
    <main className="shell">
      <h1>Sentry 链路测试</h1>
      <p style={{ fontFamily: "monospace", fontSize: 12 }}>{status}</p>

      <button
        className="submit"
        style={{ marginRight: 12 }}
        onClick={() => {
          // 1. 直接 captureMessage，不抛错
          const id = (Sentry as any).captureMessage("手动 captureMessage 测试");
          setStatus(`captureMessage sent, event_id = ${id || "null"}`);
        }}
      >
        测试 captureMessage
      </button>

      <button
        className="submit"
        onClick={() => {
          // 2. captureException
          try {
            // @ts-expect-error 故意制造错误
            const x = undefined.deep.property;
          } catch (e) {
            const id = (Sentry as any).captureException(e);
            setStatus(`captureException sent, event_id = ${id || "null"}`);
          }
        }}
      >
        测试 captureException
      </button>
    </main>
  );
}
