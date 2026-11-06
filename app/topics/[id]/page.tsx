import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteTopic from "@/components/DeleteTopic";
import TopicDetail from "@/components/TopicDetail";
import { getCommentsByTopic, getTopic } from "@/lib/db";

// 评论链随时会变，不在构建时预渲染，避免构建期依赖数据库
export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await getTopic(id);
  if (!topic) notFound();

  const comments = await getCommentsByTopic(id);

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

        <h1 className="page-title">{topic.title}</h1>
        <div className="topic-meta" style={{ marginBottom: 22 }}>
          <span>起始于 {topic.createdAt}</span>
          <span>{comments.length} 条评论</span>
        </div>

        <article className="topic-body">
          {topic.body
            .replace(/\\n\\n/g, "\n\n")
            .split(/\n{2,}/)
            .filter((paragraph) => paragraph.trim().length > 0)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </article>

        <TopicDetail topicId={topic.id} initialComments={comments} />

        <DeleteTopic topicId={topic.id} />
      </main>
    </>
  );
}
