import Link from "next/link";
import TopicForm from "@/components/TopicForm";

export default function NewTopicPage() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            驳学者
          </Link>
          <span className="brand-note">每条新评论，只能反驳上一条</span>
        </div>
      </header>

      <main className="shell">
        <Link href="/" className="back-link">
          ← 返回话题列表
        </Link>

        <h1 className="page-title">发起一个新话题</h1>
        <p className="page-sub">
          话题不是提问箱，而是一个可以被接力反驳的争议点。写清楚各方立场，别预设立场对错。
        </p>

        <TopicForm />
      </main>
    </>
  );
}
