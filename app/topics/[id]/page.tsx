import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteTopic from "@/components/DeleteTopic";
import TopicDetail from "@/components/TopicDetail";
import Topbar from "@/components/Topbar";
import TranslateButton from "@/components/TranslateButton";
import { getCommentsByTopic, getTopic } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { msg } from "@/lib/i18n";

// 评论链随时会变，不在构建时预渲染，避免构建期依赖数据库
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const topic = await getTopic(id);
  if (!topic) return { title: "话题不存在" };

  const summary =
    topic.summary?.trim() ||
    topic.body.replace(/\s+/g, " ").trim().slice(0, 140);

  return {
    title: topic.title,
    description: summary,
    alternates: { canonical: `/topics/${id}` },
    openGraph: {
      type: "article",
      url: `/topics/${id}`,
      title: topic.title,
      description: summary,
      siteName: "驳学者",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: summary,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await getTopic(id);
  if (!topic) notFound();

  const comments = await getCommentsByTopic(id);
  const locale = await getLocale();

  return (
    <>
      <Topbar locale={locale} />

      <main className="shell">
        <Link href="/" className="back-link">
          {msg(locale, "backToList")}
        </Link>

        <h1 className="page-title">{topic.title}</h1>
        <div className="topic-meta" style={{ marginBottom: 22 }}>
          <span>{msg(locale, "topicStarted", { d: topic.createdAt })}</span>
          <span>{msg(locale, "comments", { n: comments.length })}</span>
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

        <div className="topic-translate">
          <TranslateButton entityType="topic" entityId={topic.id} locale={locale} />
        </div>

        <TopicDetail
          topicId={topic.id}
          initialComments={comments}
          locale={locale}
        />

        <DeleteTopic topicId={topic.id} locale={locale} />
      </main>
    </>
  );
}
