"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminAct, adminLogout } from "@/app/admin/actions";

export interface AdminReport {
  reportId: string;
  reportReason: string;
  reportedAt: string;
  commentId: string;
  commentStatus: "visible" | "removed";
  commentAuthor: string;
  commentReason: string;
  refuteType: "full" | "partial";
  targetQuote: string | null;
  commentCreatedAt: string;
  topicId: string;
  topicTitle: string;
}

const REFUTE_TEXT: Record<AdminReport["refuteType"], string> = {
  full: "完全反驳",
  partial: "部分反驳",
};

export default function AdminDashboard({
  initialReports,
}: {
  initialReports: AdminReport[];
}) {
  const router = useRouter();
  const [reports, setReports] = useState<AdminReport[]>(initialReports);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(
    report: AdminReport,
    action: "remove" | "restore" | "dismiss"
  ) {
    setBusyId(report.reportId);
    setError(null);

    const result = await adminAct({
      reportId: report.reportId,
      commentId: report.commentId,
      action,
    });

    setBusyId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (action === "restore") {
      setReports((prev) =>
        prev.map((item) =>
          item.commentId === report.commentId
            ? { ...item, commentStatus: "visible" }
            : item
        )
      );
    } else {
      // 隐藏评论或忽略举报后，这条举报都不再需要显示
      setReports((prev) =>
        prev.filter((item) => item.reportId !== report.reportId)
      );
    }

    router.refresh();
  }

  async function logout() {
    await adminLogout();
    router.refresh();
  }

  return (
    <>
      <div className="section-head">
        <h2>待处理举报</h2>
        <span>共 {reports.length} 条</span>
      </div>

      <p className="admin-hint">
        隐藏后评论会变成灰色占位块，评论链的结构和顺序不受影响，仍然可以继续接力。
      </p>

      {error && <p className="field-error">{error}</p>}

      {reports.length === 0 ? (
        <p className="admin-empty">目前没有待处理的举报。</p>
      ) : (
        <div className="admin-list">
          {reports.map((report) => (
            <article key={report.reportId} className="admin-card">
              <div className="admin-card-head">
                <span className="badge badge-removed">{report.reportReason}</span>
                <span className="admin-time">举报于 {report.reportedAt}</span>
              </div>

              <p className="admin-topic">
                <Link href={`/topics/${report.topicId}`} className="admin-topic-link">
                  {report.topicTitle}
                </Link>
              </p>

              <div className="comment" data-type={report.refuteType}>
                <div className="comment-head">
                  <span className="author">{report.commentAuthor}</span>
                  <span className={`badge badge-${report.refuteType}`}>
                    {REFUTE_TEXT[report.refuteType]}
                  </span>
                  <span>{report.commentCreatedAt}</span>
                  {report.commentStatus === "removed" && (
                    <span className="badge badge-removed">已移除</span>
                  )}
                </div>

                {report.refuteType === "partial" && report.targetQuote && (
                  <p className="quote">{report.targetQuote}</p>
                )}

                <p className="comment-text">{report.commentReason}</p>
              </div>

              <div className="admin-actions">
                <Link
                  href={`/topics/${report.topicId}`}
                  className="admin-btn admin-btn-ghost"
                >
                  查看话题
                </Link>

                {report.commentStatus === "removed" ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-soft"
                    disabled={busyId === report.reportId}
                    onClick={() => act(report, "restore")}
                  >
                    恢复显示
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    disabled={busyId === report.reportId}
                    onClick={() => act(report, "remove")}
                  >
                    {busyId === report.reportId ? "处理中…" : "隐藏这条评论"}
                  </button>
                )}

                <button
                  type="button"
                  className="admin-btn admin-btn-soft"
                  disabled={busyId === report.reportId}
                  onClick={() => act(report, "dismiss")}
                >
                  忽略举报
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-foot">
        <button type="button" className="report-toggle" onClick={logout}>
          退出后台
        </button>
      </div>
    </>
  );
}
