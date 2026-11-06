"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/app/actions";

const TITLE_MIN = 6;
const TITLE_MAX = 60;
const SUMMARY_MAX = 120;
const BODY_MIN = 20;
const BODY_MAX = 2000;

type Errors = {
  title?: string;
  summary?: string;
  body?: string;
};

export default function TopicForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const titleLength = title.trim().length;
  const summaryLength = summary.trim().length;
  const bodyLength = body.trim().length;

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
    return next;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const result = await createTopic({ title, summary, body });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error ?? "创建失败，请稍后再试。");
      return;
    }
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
