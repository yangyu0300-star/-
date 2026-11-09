"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTopic } from "@/app/actions";
import { msg, type Locale } from "@/lib/i18n";

const OWNER_KEY_STORAGE = "rr_owner_key";
const MY_TOPICS_STORAGE = "rr_my_topics";
const DELETE_PWD_MIN = 6;

export default function DeleteTopic({
  topicId,
  locale,
}: {
  topicId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [owned, setOwned] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MY_TOPICS_STORAGE);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      setOwned(ids.includes(topicId));
    } catch {
      setOwned(false);
    }
  }, [topicId]);

  async function doDelete(params: { ownerKey?: string; deletePassword?: string }) {
    setBusy(true);
    setError(null);
    const result = await deleteTopic({ topicId, ...params });
    setBusy(false);

    if (!result.ok) {
      setError(result.error ?? msg(locale, "deleteFailed"));
      return false;
    }

    try {
      const raw = localStorage.getItem(MY_TOPICS_STORAGE);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      localStorage.setItem(
        MY_TOPICS_STORAGE,
        JSON.stringify(ids.filter((id) => id !== topicId))
      );
    } catch {
      // 本地记录清理失败不影响删除结果
    }

    router.push("/");
    router.refresh();
    return true;
  }

  async function handleBrowserDelete() {
    if (!window.confirm(msg(locale, "confirmDeleteText"))) {
      return;
    }
    const ownerKey = localStorage.getItem(OWNER_KEY_STORAGE) ?? "";
    await doDelete({ ownerKey });
  }

  async function handlePasswordDelete() {
    if (pwd.trim().length < DELETE_PWD_MIN) {
      setError(msg(locale, "errDeletePwdMin", { min: DELETE_PWD_MIN }));
      return;
    }
    if (!window.confirm(msg(locale, "confirmDeleteText"))) {
      return;
    }
    const ok = await doDelete({ deletePassword: pwd.trim() });
    if (ok) {
      setPwd("");
      setPwdOpen(false);
    }
  }

  return (
    <div className="delete-topic">
      {error && <p className="field-error">{error}</p>}

      {owned ? (
        <>
          <button
            type="button"
            className="delete-topic-btn"
            disabled={busy}
            onClick={handleBrowserDelete}
          >
            {busy ? msg(locale, "deleteBusy") : msg(locale, "browserDelete")}
          </button>
          <span className="hint">{msg(locale, "browserHint")}</span>
        </>
      ) : null}

      {!pwdOpen ? (
        <button
          type="button"
          className="delete-topic-link"
          onClick={() => setPwdOpen(true)}
        >
          {msg(locale, "pwdLink")}
        </button>
      ) : (
        <div className="delete-topic-pwd">
          <span className="hint">{msg(locale, "pwdHint")}</span>
          <input
            type="password"
            className="field field-plain"
            value={pwd}
            maxLength={40}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(null);
            }}
            placeholder={msg(locale, "pwdPlaceholder")}
            disabled={busy}
          />
          <div className="delete-topic-pwd-actions">
            <button
              type="button"
              className="delete-topic-link"
              onClick={() => {
                setPwdOpen(false);
                setPwd("");
                setError(null);
              }}
              disabled={busy}
            >
              {msg(locale, "cancel")}
            </button>
            <button
              type="button"
              className="delete-topic-btn"
              disabled={busy}
              onClick={handlePasswordDelete}
            >
              {busy ? msg(locale, "deleteBusy") : msg(locale, "confirmDelete")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
