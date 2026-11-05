"use client";

import { useState } from "react";
import ReplyForm from "./ReplyForm";
import {
  OPENING_PHRASE,
  REFUTE_LABEL,
  REMOVED_PLACEHOLDER,
  REPORT_REASONS,
} from "@/lib/types";
import type { Comment, RefuteType } from "@/lib/types";
import { submitComment, submitReport } from "@/app/actions";

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
  };
}

export default function TopicDetail({
  topicId,
  initialComments,
}: {
  topicId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const tail = comments.length > 0 ? comments[comments.length - 1] : null;
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [reportFor, setReportFor] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportBusy, setReportBusy] = useState(false);
  const [reported, setReported] = useState<string[]>([]);

  async function handleReply(payload: {
    authorName: string;
    refuteType: RefuteType;
    reason: string;
    targetQuote?: string;
  }) {
    setGlobalError(null);
    const result = await submitComment({ topicId, ...payload });
    if (!result.ok || !result.comment) {
      setGlobalError(result.ok ? "提交失败，请稍后再试。" : (result.error ?? "未知错误"));
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
      setReportError(result.error ?? "举报失败，请稍后再试。");
      return;
    }

    setReported((prev) => [...prev, commentId]);
    setReportFor(null);
  }

  return (
    <>
      <div className="section-head">
        <h2>评论链</h2>
        <span>共 {comments.length} 环 · 由上到下依次接力</span>
      </div>

      <div className="chain">
        {comments.map((comment, index) => {
          if (comment.status === "removed") {
            return (
              <article key={comment.id} className="comment comment-removed">
                <div className="comment-head">
                  <span className={"badge badge-removed"}>已移除</span>
                  <span>第 {index + 1} 环</span>
                  <span>{comment.createdAt}</span>
                </div>
                <p className="removed-text">{REMOVED_PLACEHOLDER}</p>
              </article>
            );
          }

          return (
            <article
              key={comment.id}
              className="comment"
              data-type={comment.refuteType}
            >
              <div className="comment-head">
                <span className="author">{comment.author}</span>
                <span className={"badge badge-" + comment.refuteType}>
                  {REFUTE_LABEL[comment.refuteType]}
                </span>
                <span>第 {index + 1} 环</span>
                <span>{comment.createdAt}</span>
              </div>

              {comment.refuteType === "partial" && comment.targetQuote && (
                <p className="quote">{comment.targetQuote}</p>
              )}

              <p className="comment-text">
                <span className="opening">
                  {OPENING_PHRASE[comment.refuteType]}
                </span>
                {comment.reason}
              </p>

              <div className="comment-actions">
                {reported.includes(comment.id) ? (
                  <span className="reported-note">已举报，等待处理</span>
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
                    举报这条评论
                  </button>
                )}
              </div>

              {reportFor === comment.id && (
                <div className="report-panel">
                  <p className="report-title">选择举报原因</p>
                  <div className="report-reasons">
                    {REPORT_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        className="report-reason"
                        aria-pressed={reportReason === reason}
                        onClick={() => setReportReason(reason)}
                      >
                        {reason}
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
                      取消
                    </button>
                    <button
                      type="button"
                      className="report-submit"
                      disabled={reportBusy}
                      onClick={() => handleReport(comment.id)}
                    >
                      {reportBusy ? "提交中…" : "提交举报"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {globalError && <p className="field-error" style={{ marginTop: 14 }}>{globalError}</p>}

      <ReplyForm tail={tail} onSubmit={handleReply} />
    </>
  );
}
