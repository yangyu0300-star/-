"use client";

import { useState } from "react";
import { OPENING_PHRASE, REFUTE_LABEL } from "@/lib/types";
import type { Comment, RefuteType } from "@/lib/types";

const TYPE_DESC: Record<RefuteType, string> = {
  full: "整条观点都不成立，包括它的前提。",
  partial: "同意其中一部分，但有一处必须反驳。",
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
  const [refuteType, setRefuteType] = useState<RefuteType>("full");
  const [reason, setReason] = useState("");
  const [targetQuote, setTargetQuote] = useState("");

  const canSubmit = reason.trim().length > 0;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      refuteType,
      reason: reason.trim(),
      targetQuote:
        refuteType === "partial" ? targetQuote.trim() || undefined : undefined,
    });
    setReason("");
    setTargetQuote("");
  }

  return (
    <form className="reply" onSubmit={submit}>
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
            onClick={() => setRefuteType(type)}
          >
            <strong>{REFUTE_LABEL[type]}</strong>
            <small>{TYPE_DESC[type]}</small>
          </button>
        ))}
      </div>

      <div className="locked-line">
        <span className="locked-tag">固定开场语</span>
        <span>{OPENING_PHRASE[refuteType]}</span>
      </div>
      <textarea
        className="field"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="只写开场语之后的内容。说清楚上一条哪里不成立，为什么。"
      />

      {refuteType === "partial" && (
        <>
          <label className="field-label" htmlFor="target-quote">
            你要反驳的是哪一部分？（引用或概括）
          </label>
          <input
            id="target-quote"
            className="field field-plain"
            value={targetQuote}
            onChange={(event) => setTargetQuote(event.target.value)}
            placeholder="例如：上一条里「之后每一次收紧都会被当成背叛」这句"
          />
        </>
      )}

      <div className="reply-foot">
        <span className="hint">
          开场语锁定不可删改，正文只填你自己的理由。
        </span>
        <button type="submit" className="submit" disabled={!canSubmit}>
          接上这一环
        </button>
      </div>
    </form>
  );
}
