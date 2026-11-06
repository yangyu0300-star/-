import { cookies } from "next/headers";
import Link from "next/link";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import type { AdminReport } from "@/components/AdminDashboard";
import { ADMIN_COOKIE } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

// 举报列表随时会变，不走构建期预渲染
export const dynamic = "force-dynamic";

interface ReportRow {
  report_id: string;
  report_reason: string;
  reported_at: string;
  comment_id: string;
  comment_status: string;
  comment_author: string;
  comment_reason: string;
  refute_type: string;
  target_quote: string | null;
  comment_created_at: string;
  topic_id: string;
  topic_title: string;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toAdminReport(row: ReportRow): AdminReport {
  return {
    reportId: row.report_id,
    reportReason: row.report_reason,
    reportedAt: formatDateTime(row.reported_at),
    commentId: row.comment_id,
    commentStatus: row.comment_status === "removed" ? "removed" : "visible",
    commentAuthor: row.comment_author,
    commentReason: row.comment_reason,
    refuteType: row.refute_type === "partial" ? "partial" : "full",
    targetQuote: row.target_quote,
    commentCreatedAt: formatDateTime(row.comment_created_at),
    topicId: row.topic_id,
    topicTitle: row.topic_title,
  };
}

export default async function AdminPage() {
  const store = await cookies();
  const key = store.get(ADMIN_COOKIE)?.value;

  let authed = false;
  let reports: AdminReport[] = [];

  if (key) {
    const { data, error } = await supabase.rpc("admin_list_reports", {
      p_key: key,
    });

    if (!error && data) {
      authed = true;
      reports = (data as ReportRow[]).map(toAdminReport);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            驳学者
          </Link>
          <span className="brand-note">举报处理后台</span>
        </div>
      </header>

      <main className="shell">
        {authed ? (
          <AdminDashboard initialReports={reports} />
        ) : (
          <AdminLogin />
        )}
      </main>
    </>
  );
}
