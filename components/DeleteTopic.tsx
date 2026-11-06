"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTopic } from "@/app/actions";

const OWNER_KEY_STORAGE = "rr_owner_key";
const MY_TOPICS_STORAGE = "rr_my_topics";
const DELETE_PWD_MIN = 6;

export default function DeleteTopic({ topicId }: { topicId: string }) {
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
      setError(result.error ?? "删除失败，请稍后再试。");
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
    if (!window.confirm("删除后话题和整条评论链都会消失，且无法恢复。确定删除？")) {
      return;
    }
    const ownerKey = localStorage.getItem(OWNER_KEY_STORAGE) ?? "";
    await doDelete({ ownerKey });
  }

  async function handlePasswordDelete() {
    if (pwd.trim().length < DELETE_PWD_MIN) {
      setError(`删除密码至少 ${DELETE_PWD_MIN} 位。`);
      return;
    }
    if (!window.confirm("删除后话题和整条评论链都会消失，且无法恢复。确定删除？")) {
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
            {busy ? "删除中…" : "删除这个话题（本浏览器）"}
          </button>
          <span className="hint">
            本浏览器是发起人，可以直接删。
          </span>
        </>
      ) : null}

      {!pwdOpen ? (
        <button
          type="button"
          className="delete-topic-link"
          onClick={() => setPwdOpen(true)}
        >
          用删除密码删除
        </button>
      ) : (
        <div className="delete-topic-pwd">
          <span className="hint">
            如果你创建话题时设置了删除密码，在这里输入就能删：
          </span>
          <input
            type="password"
            className="field field-plain"
            value={pwd}
            maxLength={40}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(null);
            }}
            placeholder="输入删除密码"
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
              取消
            </button>
            <button
              type="button"
              className="delete-topic-btn"
              disabled={busy}
              onClick={handlePasswordDelete}
            >
              {busy ? "删除中…" : "确认删除"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
