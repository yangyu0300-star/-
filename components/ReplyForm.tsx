"use client";

import { useState } from "react";
import { OPENING_PHRASE, REFUTE_LABEL } from "@/lib/types";
import type { Comment, RefuteType } from "@/lib/types";

const TYPE_DESC: Record<RefuteType, string> = {
  full: "整条观点都不成立，包括它的前提。",
  partial: "同意其中一部分，但有一处必须反驳。",
};

const REASON_MIN = 20;
const REASON_MAX = 2000;
const QUOTE_MAX = 200;

type Errors = {
  refuteType?: string;
  reason?: string;
  targetQuote?: string;
};

export default function ReplyForm({
  tail,
  onSubmit,
}: {
  tail: Comment | null;
  onSubmit: (payload: {
    refuteType: RefuteType;
    reason: string;
    targetQuote?: string;
  }) => void;
}) {
  const [refuteType, setRefuteType] = useState<RefuteType | null>(null);
  const [reason, setReason] = useState("");
  const [targetQuote, setTargetQuote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const reasonLength = reason.trim().length;

  function validate(): Errors {
    const next: Errors = {};

    if (!refuteType) {
      next.refuteType = "请先选择「完全反驳」或「部分反驳」。";
    }
    if (reasonLength === 0) {
      next.reason = "反驳理由不能为空。";
    } else if (reasonLength < REASON_MIN) {
      next.reason = `反驳理由至少 ${REASON_MIN} 字，当前 ${reasonLength} 字。`;
    } else if (reasonLength > REASON_MAX) {
      next.reason = `反驳理由最多 ${REASON_MAX} 字，当前 ${reasonLength} 字。`;
    }

    if (refuteType === "partial") {
      const quoteLength = targetQuote.trim().length;
      if (quoteLength === 0) {
        next.targetQuote = "部分反驳必须指出具体反驳的是哪一部分。";
      } else if (quoteLength > QUOTE_MAX) {
        next.targetQuote = `引用请控制在 ${QUOTE_MAX} 字以内，当前 ${quoteLength} 字。`;
      }
    }

    return next;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (!refuteType || Object.keys(next).length > 0) return;

    onSubmit({
      refuteType,
      reason: reason.trim(),
      targetQuote: refuteType === "partial" ? targetQuote.trim() : undefined,
    });
    setReason("");
    setTargetQuote("");
    setErrors({});
  }

  function selectType(type: RefuteType) {
    setRefuteType(type);
    setErrors((prev) => ({ ...prev, refuteType: undefined, targetQuote: undefined }));
    if (type === "full") {
      setTargetQuote("");
    }
  }

  return (
    <form className="reply" onSubmit={submit} noValidate>
      <p className="reply-target">
        {tail ? (
          <>
            你的反驳对象是链尾唯一一条评论：<strong>{tail.author}</strong>
            （{REFUTE_LABEL[tail.refuteType]} · {tail.createdAt}）
          </>
        ) : (
          <>这个话题还没有评论，你将成为第 1 环。</>
        )}
      </p>

      <div className="type-options" role="group" aria-label="选择反驳类型">
        {(Object.keys(REFUTE_LABEL) as RefuteType[]).map((type) => (
          <button
            key={type}
            type="button"
            className="type-option"
            aria-pressed={refuteType === type}
            onClick={() => selectType(type)}
          >
            <strong>{REFUTE_LABEL[type]}</strong>
            <small>{TYPE_DESC[type]}</small>
          </button>
        ))}
      </div>
      {errors.refuteType && <p className="field-error">{errors.refuteType}</p>}

      {refuteType && (
        <>
          <div className="field-head">
            <span>反驳理由（开场语之外的内容）</span>
            <span className={reasonLength > REASON_MAX ? "count over" : "count"}>
              {reasonLength} / {REASON_MAX}，最少 {REASON_MIN}
            </span>
          </div>

          <div className="locked-line">
            <span className="locked-tag">固定开场语 · 不可删改</span>
            <span>{OPENING_PHRASE[refuteType]}</span>
          </div>
          <textarea
            className={errors.reason ? "field field-invalid" : "field"}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setErrors((prev) => ({ ...prev, reason: undefined }));
            }}
            aria-invalid={Boolean(errors.reason)}
            placeholder="只写开场语之后的内容。说清楚上一条哪里不成立，为什么。"
          />

          {refuteType === "partial" && (
            <>
              <label className="field-label" htmlFor="target-quote">
                你要反驳的是哪一部分？（引用或概括，必填）
              </label>
              <input
                id="target-quote"
                className={
                  errors.targetQuote
                    ? "field field-plain field-invalid"
                    : "field field-plain"
                }
                value={targetQuote}
                onChange={(event) => {
                  setTargetQuote(event.target.value);
                  setErrors((prev) => ({ ...prev, targetQuote: undefined }));
                }}
                aria-invalid={Boolean(errors.targetQuote)}
                placeholder="例如：上一条里「之后每一次收紧都会被当成背叛」这句"
              />
            </>
          )}
        </>
      )}

      {errors.reason && <p className="field-error">{errors.reason}</p>}
      {errors.targetQuote && <p className="field-error">{errors.targetQuote}</p>}

      <div className="reply-foot">
        <span className="hint">
          你的反驳会接在链尾，成为下一条评论唯一可反驳的对象。
        </span>
        <button type="submit" className="submit">
          接上这一环
        </button>
      </div>
    </form>
  );
}
