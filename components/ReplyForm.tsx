"use client";

import { useState } from "react";
import { REMOVED_PLACEHOLDER } from "@/lib/types";
import type { Comment, RefuteType } from "@/lib/types";
import { msg, type Locale } from "@/lib/i18n";

const REASON_MIN = 20;
const REASON_MAX = 2000;
const QUOTE_MAX = 200;
const AUTHOR_MAX = 20;

type Errors = {
  author?: string;
  refuteType?: string;
  reason?: string;
  targetQuote?: string;
};

export default function ReplyForm({
  tail,
  onSubmit,
  locale,
  blocked,
}: {
  tail: Comment | null;
  onSubmit: (payload: {
    authorName: string;
    refuteType: RefuteType;
    reason: string;
    targetQuote?: string;
  }) => void;
  locale: Locale;
  blocked: boolean;
}) {
  const [authorName, setAuthorName] = useState("");
  const [refuteType, setRefuteType] = useState<RefuteType | null>(null);
  const [reason, setReason] = useState("");
  const [targetQuote, setTargetQuote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const reasonLength = reason.trim().length;
  const trimmedAuthor = authorName.trim();

  function validate(): Errors {
    const next: Errors = {};

    if (trimmedAuthor.length === 0) {
      next.author = msg(locale, "errAuthorRequired");
    } else if (trimmedAuthor.length > AUTHOR_MAX) {
      next.author = msg(locale, "errAuthorMax", { max: AUTHOR_MAX });
    }

    if (!refuteType) {
      next.refuteType = msg(locale, "errTypeRequired");
    }
    if (reasonLength === 0) {
      next.reason = msg(locale, "errReasonEmpty");
    } else if (reasonLength < REASON_MIN) {
      next.reason = msg(locale, "errReasonMin", { min: REASON_MIN, n: reasonLength });
    } else if (reasonLength > REASON_MAX) {
      next.reason = msg(locale, "errReasonMax", { max: REASON_MAX, n: reasonLength });
    }

    if (refuteType === "partial") {
      const quoteLength = targetQuote.trim().length;
      if (quoteLength === 0) {
        next.targetQuote = msg(locale, "errQuoteRequired");
      } else if (quoteLength > QUOTE_MAX) {
        next.targetQuote = msg(locale, "errQuoteMax", { max: QUOTE_MAX, n: quoteLength });
      }
    }

    return next;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (blocked) return;
    const next = validate();
    setErrors(next);
    if (!refuteType || Object.keys(next).length > 0) return;

    onSubmit({
      authorName: trimmedAuthor,
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
          tail.status === "removed" ? (
            msg(locale, "targetTailRemoved", { removed: REMOVED_PLACEHOLDER })
          ) : (
            <>
              {msg(locale, "targetTail")}
              <strong>{tail.author}</strong>
              {" · "}
              {msg(locale, tail.refuteType === "full" ? "typeFull" : "typePartial")}
              {` · ${tail.createdAt}`}
            </>
          )
        ) : (
          msg(locale, "targetFirst")
        )}
      </p>

      <label className="field-label" htmlFor="author">
        {msg(locale, "authorLabel")}
      </label>
      <input
        id="author"
        className={errors.author ? "field field-plain field-invalid" : "field field-plain"}
        value={authorName}
        maxLength={AUTHOR_MAX}
        onChange={(event) => {
          setAuthorName(event.target.value);
          setErrors((prev) => ({ ...prev, author: undefined }));
        }}
        aria-invalid={Boolean(errors.author)}
        placeholder={msg(locale, "authorPlaceholder")}
      />
      {errors.author && <p className="field-error">{errors.author}</p>}

      <div className="type-options" role="group" aria-label={msg(locale, "typeGroup")}>
        {(["full", "partial"] as RefuteType[]).map((type) => (
          <button
            key={type}
            type="button"
            className="type-option"
            aria-pressed={refuteType === type}
            onClick={() => selectType(type)}
          >
            <strong>
              {msg(locale, type === "full" ? "typeFull" : "typePartial")}
            </strong>
            <small>
              {msg(locale, type === "full" ? "typeFullDesc" : "typePartialDesc")}
            </small>
          </button>
        ))}
      </div>
      {errors.refuteType && <p className="field-error">{errors.refuteType}</p>}

      {refuteType && (
        <>
          <div className="field-head">
            <span>{msg(locale, "reasonHeading")}</span>
            <span className={reasonLength > REASON_MAX ? "count over" : "count"}>
              {msg(locale, "countRange", {
                n: reasonLength,
                max: REASON_MAX,
                min: REASON_MIN,
              })}
            </span>
          </div>

          <div className="locked-line">
            <span className="locked-tag">{msg(locale, "lockedTag")}</span>
            <span>
              {msg(locale, refuteType === "full" ? "openingFull" : "openingPartial")}
            </span>
          </div>
          <textarea
            className={errors.reason ? "field field-invalid" : "field"}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setErrors((prev) => ({ ...prev, reason: undefined }));
            }}
            aria-invalid={Boolean(errors.reason)}
            placeholder={msg(locale, "reasonPlaceholder")}
          />

          {refuteType === "partial" && (
            <>
              <label className="field-label" htmlFor="target-quote">
                {msg(locale, "quoteLabel")}
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
                placeholder={msg(locale, "quotePlaceholder")}
              />
            </>
          )}
        </>
      )}

      {errors.reason && <p className="field-error">{errors.reason}</p>}
      {errors.targetQuote && <p className="field-error">{errors.targetQuote}</p>}

      <div className="reply-foot">
        <span className="hint">{msg(locale, "footHint")}</span>
        <button type="submit" className="submit" disabled={blocked}>
          {msg(locale, "replySubmit")}
        </button>
      </div>

      {blocked && <p className="field-error">{msg(locale, "chainBlocked")}</p>}
    </form>
  );
}
