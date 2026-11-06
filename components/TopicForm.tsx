"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/app/actions";

const TITLE_MIN = 6;
const TITLE_MAX = 60;
const SUMMARY_MAX = 120;
const BODY_MIN = 20;
const BODY_MAX = 2000;
const DELETE_PWD_MIN = 6;
const DELETE_PWD_MAX = 40;

type Errors = {
  title?: string;
  summary?: string;
  body?: string;
  deletePassword?: string;
};

const OWNER_KEY_STORAGE = "rr_owner_key";
const MY_TOPICS_STORAGE = "rr_my_topics";

// 发起凭证：存在这个浏览器里，用来证明「这个话题是我发的」，进而允许删除
function getOwnerKey(): string {
  let key = localStorage.getItem(OWNER_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(OWNER_KEY_STORAGE, key);
  }
  return key;
}

function rememberMyTopic(topicId: string) {
  try {
    const raw = localStorage.getItem(MY_TOPICS_STORAGE);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    if (!ids.includes(topicId)) {
      localStorage.setItem(MY_TOPICS_STORAGE, JSON.stringify([...ids, topicId]));
    }
  } catch {
    // 本地记录失败不影响发布
  }
}

export default function TopicForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const titleLength = title.trim().length;
  const summaryLength = summary.trim().length;
  const bodyLength = body.trim().length;
  const pwdLength = deletePassword.trim().length;

  function validate(): Errors {
    const next: Errors = {};
    if (titleLength < TITLE_MIN) {
      next.title = `标题至少 ${TITLE_MIN} 字，当前 ${titleLength} 字。`;
    } else if (titleLength > TITLE_MAX) {
      next.title = `标题最多 ${TITLE_MAX} 字，当前 ${titleLength} 字。`;
    }
    if (summaryLength > SUMMARY_MAX) {
      next.summary = `简介最多 ${SUMMARY_MAX} 字，当前 ${summaryLength} 字。`;
    }
    if (bodyLength < BODY_MIN) {
      next.body = `正文至少 ${BODY_MIN} 字，当前 ${bodyLength} 字。`;
    } else if (bodyLength > BODY_MAX) {
      next.body = `正文最多 ${BODY_MAX} 字，当前 ${bodyLength} 字。`;
    }
    if (pwdLength > 0 && pwdLength < DELETE_PWD_MIN) {
      next.deletePassword = `删除密码至少 ${DELETE_PWD_MIN} 字，当前 ${pwdLength} 字。`;
    } else if (pwdLength > DELETE_PWD_MAX) {
      next.deletePassword = `删除密码最多 ${DELETE_PWD_MAX} 字。`;
    }
    return next;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const result = await createTopic({
      title,
      summary,
      body,
      ownerKey: getOwnerKey(),
      deletePassword: deletePassword.trim() || undefined,
    });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error ?? "创建失败，请稍后再试。");
      return;
    }
    rememberMyTopic(result.id);
    router.push(`/topics/${result.id}`);
  }

  return (
    <form className="reply" onSubmit={submit} noValidate>
      <label className="field-label" htmlFor="topic-title">
        话题标题（要有争议性，让人想反驳）
      </label>
      <input
        id="topic-title"
        className={
          errors.title ? "field field-plain field-invalid" : "field field-plain"
        }
        value={title}
        maxLength={TITLE_MAX}
        onChange={(event) => {
          setTitle(event.target.value);
          setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        aria-invalid={Boolean(errors.title)}
        placeholder="例如：「算法推荐让人越来越极端」这个说法站得住脚吗？"
        disabled={busy}
      />
      {errors.title && <p className="field-error">{errors.title}</p>}

      <label className="field-label" htmlFor="topic-summary">
        一句话简介（可留空，自动取正文开头）
      </label>
      <input
        id="topic-summary"
        className={
          errors.summary ? "field field-plain field-invalid" : "field field-plain"
        }
        value={summary}
        maxLength={SUMMARY_MAX}
        onChange={(event) => {
          setSummary(event.target.value);
          setErrors((prev) => ({ ...prev, summary: undefined }));
        }}
        aria-invalid={Boolean(errors.summary)}
        placeholder="一句话说清这个争议点"
        disabled={busy}
      />
      {errors.summary && <p className="field-error">{errors.summary}</p>}

      <div className="field-head">
        <span>话题正文（交代背景和双方观点）</span>
        <span className={bodyLength > BODY_MAX ? "count over" : "count"}>
          {bodyLength} / {BODY_MAX}，最少 {BODY_MIN}
        </span>
      </div>
      <textarea
        className={errors.body ? "field field-invalid" : "field"}
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setErrors((prev) => ({ ...prev, body: undefined }));
        }}
        aria-invalid={Boolean(errors.body)}
        placeholder="说清楚这个问题的两三种立场，以及争论的焦点在哪里。段落之间空一行。"
        disabled={busy}
      />
      {errors.body && <p className="field-error">{errors.body}</p>}

      <label className="field-label" htmlFor="delete-password">
        删除密码（可选，{DELETE_PWD_MIN}–{DELETE_PWD_MAX} 位；留空则只有本浏览器能删，换浏览器就删不了）
      </label>
      <input
        id="delete-password"
        type="password"
        className={
          errors.deletePassword
            ? "field field-plain field-invalid"
            : "field field-plain"
        }
        value={deletePassword}
        maxLength={DELETE_PWD_MAX}
        onChange={(event) => {
          setDeletePassword(event.target.value);
          setErrors((prev) => ({ ...prev, deletePassword: undefined }));
        }}
        aria-invalid={Boolean(errors.deletePassword)}
        placeholder="设一个只有你自己知道的密码，用它在任何浏览器都能删这个话题"
        disabled={busy}
      />
      {errors.deletePassword && (
        <p className="field-error">{errors.deletePassword}</p>
      )}

      {formError && <p className="field-error">{formError}</p>}

      <div className="reply-foot">
        <span className="hint">
          话题发布后不能修改，第一条评论由你在话题页接上。
        </span>
        <button type="submit" className="submit" disabled={busy}>
          {busy ? "发布中…" : "发布话题"}
        </button>
      </div>
    </form>
  );
}
