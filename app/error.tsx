"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  useEffect(() => {
    setIsEn(!(navigator.language ?? "").toLowerCase().startsWith("zh"));
  }, []);

  return (
    <div className="shell">
      <div className="fallback">
        <p className="fallback-code">Error</p>
        <h1>{isEn ? "This page failed to load" : "这一页没能加载出来"}</h1>
        <p>
          {isEn
            ? "A temporary network or server issue. Nothing you typed was lost — try again."
            : "可能是网络抖动或服务临时不可用，刚才填的内容不会丢，重试一下就好。"}
        </p>
        <div className="fallback-actions">
          <button type="button" className="submit" onClick={reset}>
            {isEn ? "Retry" : "重试"}
          </button>
          <Link className="fallback-link" href="/">
            {isEn ? "Back to home" : "回首页"}
          </Link>
        </div>
      </div>
    </div>
  );
}
