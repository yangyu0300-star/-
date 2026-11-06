"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "@/app/admin/actions";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const result = await adminLogin({ password });
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setPassword("");
    router.refresh();
  }

  return (
    <form className="admin-login" onSubmit={submit} noValidate>
      <h1 className="page-title">举报处理后台</h1>
      <p className="admin-login-note">
        输入管理员密码。密码只以哈希形式存在数据库和 cookie 里，不会明文保存。
      </p>

      <label className="field-label" htmlFor="admin-password">
        管理员密码
      </label>
      <input
        id="admin-password"
        className={error ? "field field-plain field-invalid" : "field field-plain"}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="至少 6 位"
      />

      {error && <p className="field-error">{error}</p>}

      <div className="admin-login-foot">
        <button type="submit" className="submit" disabled={busy}>
          {busy ? "校验中…" : "进入后台"}
        </button>
      </div>
    </form>
  );
}
