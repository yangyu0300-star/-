"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/app/actions";
import { msg, type Locale } from "@/lib/i18n";

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

export default function TopicForm({ locale }: { locale: Locale }) {
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
      next.title = msg(locale, "errTitleMin", { min: TITLE_MIN, n: titleLength });
    } else if (titleLength > TITLE_MAX) {
      next.title = msg(locale, "errTitleMax", { max: TITLE_MAX, n: titleLength });
    }
    if (summaryLength > SUMMARY_MAX) {
      next.summary = msg(locale, "errSummaryMax", { max: SUMMARY_MAX, n: summaryLength });
    }
    if (bodyLength < BODY_MIN) {
      next.body = msg(locale, "errBodyMin", { min: BODY_MIN, n: bodyLength });
    } else if (bodyLength > BODY_MAX) {
      next.body = msg(locale, "errBodyMax", { max: BODY_MAX, n: bodyLength });
    }
    if (pwdLength > 0 && pwdLength < DELETE_PWD_MIN) {
      next.deletePassword = msg(locale, "errPwdMin", {
        min: DELETE_PWD_MIN,
        n: pwdLength,
      });
    } else if (pwdLength > DELETE_PWD_MAX) {
      next.deletePassword = msg(locale, "errPwdMax", { max: DELETE_PWD_MAX });
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
      setFormError(result.error ?? msg(locale, "submitFailed"));
      return;
    }
    rememberMyTopic(result.id);
    router.push(`/topics/${result.id}`);
  }

  return (
    <form className="reply" onSubmit={submit} noValidate>
      <label className="field-label" htmlFor="topic-title">
        {msg(locale, "formTitleLabel")}
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
        placeholder={msg(locale, "formTitlePlaceholder")}
        disabled={busy}
      />
      {errors.title && <p className="field-error">{errors.title}</p>}

      <label className="field-label" htmlFor="topic-summary">
        {msg(locale, "formSummaryLabel")}
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
        placeholder={msg(locale, "formSummaryPlaceholder")}
        disabled={busy}
      />
      {errors.summary && <p className="field-error">{errors.summary}</p>}

      <div className="field-head">
        <span>{msg(locale, "formBodyLabel")}</span>
        <span className={bodyLength > BODY_MAX ? "count over" : "count"}>
          {msg(locale, "countRange", { n: bodyLength, max: BODY_MAX, min: BODY_MIN })}
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
        placeholder={msg(locale, "formBodyPlaceholder")}
        disabled={busy}
      />
      {errors.body && <p className="field-error">{errors.body}</p>}

      <label className="field-label" htmlFor="delete-password">
        {msg(locale, "formPwdLabel", {
          min: DELETE_PWD_MIN,
          max: DELETE_PWD_MAX,
        })}
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
        placeholder={msg(locale, "formPwdPlaceholder")}
        disabled={busy}
      />
      {errors.deletePassword && (
        <p className="field-error">{errors.deletePassword}</p>
      )}

      {formError && <p className="field-error">{formError}</p>}

      <div className="reply-foot">
        <span className="hint">{msg(locale, "formFootHint")}</span>
        <button type="submit" className="submit" disabled={busy}>
          {busy ? msg(locale, "formBusy") : msg(locale, "formSubmit")}
        </button>
      </div>
    </form>
  );
}
