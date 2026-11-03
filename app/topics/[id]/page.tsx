import Link from "next/link";
import { notFound } from "next/navigation";
import TopicDetail from "@/components/TopicDetail";
import { getComments, getTopic } from "@/lib/mock-data";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = getTopic(id);

  if (!topic) {
    notFound();
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            反驳接力
          </Link>
          <span className="brand-note">每条新评论，只能反驳上一条</span>
        </div>
      </header>

      <main className="shell">
        <Link href="/" className="back-link">
          ← 返回话题列表
        </Link>

        <h1 className="page-title">{topic.title}</h1>
        <div className="topic-meta" style={{ marginBottom: 22 }}>
          <span>起始于 {topic.createdAt}</span>
          <span>{getComments(topic.id).length} 条评论</span>
        </div>

        <article className="topic-body">
          {topic.body.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <TopicDetail topicId={topic.id} initialComments={getComments(topic.id)} />
      </main>
    </>
  );
}
