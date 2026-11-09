"use client";

import { useEffect, useMemo, useState } from "react";
import ReplyForm from "./ReplyForm";
import TranslateButton from "./TranslateButton";
import { REPORT_REASONS } from "@/lib/types";
import type { Comment, RefuteType, VoteValue } from "@/lib/types";
import { computeQualityLabels } from "@/lib/quality";
import { msg, reportReasonLabel, type Locale } from "@/lib/i18n";
import { submitComment, submitReport, submitVote } from "@/app/actions";

function adaptFromActionRow(row: {
  id: string;
  topic_id: string;
  parent_id: string | null;
  refute_type: "full" | "partial";
  target_quote: string | null;
  reason: string;
  author_name: string;
  created_at: string;
  status?: "visible" | "removed" | null;
  vote_up?: number | null;
  vote_down?: number | null;
}): Comment {
  const d = new Date(row.created_at);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    id: row.id,
    topicId: row.topic_id,
    parentId: row.parent_id,
    refuteType: row.refute_type,
    targetQuote: row.target_quote ?? undefined,
    reason: row.reason,
    author: row.author_name,
    createdAt: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`,
    status: row.status ?? "visible",
    voteUp: row.vote_up ?? 0,
    voteDown: row.vote_down ?? 0,
  };
}

const VOTER_KEY_STORAGE = "rr_voter_key";
const MY_VOTES_STORAGE = "rr_my_votes";

function getVoterKey(): string {
  let key = localStorage.getItem(VOTER_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY_STORAGE, key);
  }
  return key;
}

export default function TopicDetail({
  topicId,
  initialComments,
  locale,
}: {
  topicId: string;
  initialComments: Comment[];
  locale: Locale;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const tail = comments.length > 0 ? comments[comments.length - 1] : null;
  const qualityLabels = useMemo(() => computeQualityLabels(comments), [comments]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [reportFor, setReportFor] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportBusy, setReportBusy] = useState(false);
  const [reported, setReported] = useState<string[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, VoteValue>>({});
  const [voting, setVoting] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MY_VOTES_STORAGE);
      if (raw) setMyVotes(JSON.parse(raw) as Record<string, VoteValue>);
    } catch {
      // 本地记录损坏就当作没投过，不影响使用
    }
  }, []);

  async function handleVote(commentId: string, value: VoteValue) {
    setVoting(commentId);
    setVoteError(null);

    const result = await submitVote({
      commentId,
      value,
      voterKey: getVoterKey(),
    });
    setVoting(null);

    if (!result.ok) {
      setVoteError(result.error ?? msg(locale, "voteFailed"));
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, voteUp: result.voteUp, voteDown: result.voteDown }
          : c
      )
    );

    const nextVotes = { ...myVotes, [commentId]: value };
    setMyVotes(nextVotes);
    localStorage.setItem(MY_VOTES_STORAGE, JSON.stringify(nextVotes));
  }

  async function handleReply(payload: {
    authorName: string;
    refuteType: RefuteType;
    reason: string;
    targetQuote?: string;
  }) {
    setGlobalError(null);
    const result = await submitComment({ topicId, ...payload });
    if (!result.ok || !result.comment) {
      setGlobalError(result.ok ? msg(locale, "submitFailed") : (result.error ?? "unknown"));
      return;
    }
    const comment = adaptFromActionRow(result.comment);
    setComments((prev) => [...prev, comment]);
  }

  async function handleReport(commentId: string) {
    setReportBusy(true);
    setReportError(null);
    const result = await submitReport({ commentId, reason: reportReason });
    setReportBusy(false);

    if (!result.ok) {
      setReportError(result.error ?? msg(locale, "reportFailed"));
      return;
    }

    setReported((prev) => [...prev, commentId]);
    setReportFor(null);
  }

  return (
    <>
      <div className="section-head">
        <h2>{msg(locale, "chainTitle")}</h2>
        <span>{msg(locale, "chainMeta", { n: comments.length })}</span>
      </div>

      <p className="vote-hint">{msg(locale, "voteHint")}</p>

      {Object.keys(qualityLabels).length > 0 && (
        <p className="vote-hint">{msg(locale, "qualityHint")}</p>
      )}

      {voteError && <p className="field-error">{voteError}</p>}

      <div className="chain">
        {comments.map((comment, index) => {
          if (comment.status === "removed") {
            return (
              <article key={comment.id} className="comment comment-removed">
                <div className="comment-head">
                  <span className="badge badge-removed">
                    {msg(locale, "removedBadge")}
                  </span>
                  <span>{msg(locale, "ring", { n: index + 1 })}</span>
                  <span>{comment.createdAt}</span>
                </div>
                <p className="removed-text">{msg(locale, "removedText")}</p>
              </article>
            );
          }

          const quality = qualityLabels[comment.id];

          return (
            <article
              key={comment.id}
              className="comment"
              data-type={comment.refuteType}
            >
              <div className="comment-head">
                <span className="author">{comment.author}</span>
                <span className={`badge badge-${comment.refuteType}`}>
                  {msg(locale, comment.refuteType === "full" ? "typeFull" : "typePartial")}
                </span>
                {quality && (
                  <span className={`badge badge-${quality}`}>
                    {msg(locale, quality === "solid" ? "qualitySolid" : "qualityFlawed")}
                  </span>
                )}
                <span>{msg(locale, "ring", { n: index + 1 })}</span>
                <span>{comment.createdAt}</span>
              </div>

              {comment.refuteType === "partial" && comment.targetQuote && (
                <p className="quote">{comment.targetQuote}</p>
              )}

              <p className="comment-text">
                <span className="opening">
                  {msg(
                    locale,
                    comment.refuteType === "full" ? "openingFull" : "openingPartial"
                  )}
                </span>
                {comment.reason}
              </p>

              <div className="vote-row">
                {(Object.keys({ up: 1, down: 1 }) as VoteValue[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="vote-btn"
                    aria-pressed={myVotes[comment.id] === value}
                    disabled={voting === comment.id}
                    onClick={() => handleVote(comment.id, value)}
                  >
                    {msg(locale, value === "up" ? "voteUp" : "voteDown")}
                    <span className="vote-count">
                      {value === "up" ? comment.voteUp : comment.voteDown}
                    </span>
                  </button>
                ))}
              </div>

              <div className="comment-actions">
                <TranslateButton
                  entityType="comment"
                  entityId={comment.id}
                  locale={locale}
                />
                {reported.includes(comment.id) ? (
                  <span className="reported-note">{msg(locale, "reportedNote")}</span>
                ) : (
                  <button
                    type="button"
                    className="report-toggle"
                    onClick={() => {
                      setReportFor(comment.id);
                      setReportError(null);
                      setReportReason(REPORT_REASONS[0]);
                    }}
                  >
                    {msg(locale, "reportToggle")}
                  </button>
                )}
              </div>

              {reportFor === comment.id && (
                <div className="report-panel">
                  <p className="report-title">{msg(locale, "reportTitle")}</p>
                  <div className="report-reasons">
                    {REPORT_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        className="report-reason"
                        aria-pressed={reportReason === reason}
                        onClick={() => setReportReason(reason)}
                      >
                        {reportReasonLabel(locale, reason)}
                      </button>
                    ))}
                  </div>
                  {reportError && <p className="field-error">{reportError}</p>}
                  <div className="report-foot">
                    <button
                      type="button"
                      className="report-cancel"
                      onClick={() => setReportFor(null)}
                    >
                      {msg(locale, "cancel")}
                    </button>
                    <button
                      type="button"
                      className="report-submit"
                      disabled={reportBusy}
                      onClick={() => handleReport(comment.id)}
                    >
                      {reportBusy
                        ? msg(locale, "reportBusy")
                        : msg(locale, "reportSubmit")}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {globalError && (
        <p className="field-error" style={{ marginTop: 14 }}>
          {globalError}
        </p>
      )}

      <ReplyForm tail={tail} onSubmit={handleReply} locale={locale} />
    </>
  );
}
