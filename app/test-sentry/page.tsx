"use client";

// 临时测试页：点击按钮触发浏览器端错误，验证 Sentry client 链路
// 验证完成后立即删除
import { useState } from "react";

export default function TestSentryPage() {
  const [msg, setMsg] = useState("点击下方按钮，触发一个浏览器端错误");

  return (
    <main className="shell">
      <h1>Sentry 链路测试</h1>
      <p>{msg}</p>
      <button
        className="submit"
        onClick={() => {
          // 故意访问 undefined 的属性，触发 TypeError
          // @ts-expect-error - 故意制造错误
          window.nonexistentObj.deep.property.access;
        }}
      >
        触发客户端错误
      </button>
    </main>
  );
}
