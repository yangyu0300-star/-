import Link from "next/link";
import { getTopics } from "@/lib/db";

// 话题数据随时会变，不在构建时预渲染，避免构建期依赖数据库
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = (q ?? "").trim();
  const topics = await getTopics(keyword);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">驳学者</span>
          <span className="brand-note">每条新评论，只能反驳上一条</span>
        </div>
      </header>

      <main className="shell">
        <div className="rule-banner">
          这里没有并列的观点，只有<strong>一条链</strong>：想发言，就反驳紧邻的上一条评论。
          规则是玩法的一部分，不接受跳层回复。
        </div>

        <form action="/" method="get" className="search-bar">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            placeholder="搜索话题标题或简介"
            maxLength={50}
            className="field field-plain search-input"
          />
          <button type="submit" className="submit">
            搜索
          </button>
          {keyword && (
            <Link href="/" className="search-clear">
              清除
            </Link>
          )}
        </form>

        <div className="list-head">
          <div>
            <h1 className="page-title">
              {keyword ? `搜索「${keyword}」` : "进行中的话题"}
            </h1>
            <p className="page-sub">
              {keyword
                ? `找到 ${topics.length} 个匹配话题。`
                : "选一个话题，从链尾接上你的反驳。"}
            </p>
          </div>
          <Link href="/topics/new" className="new-topic-link">
            ＋ 发起新话题
          </Link>
        </div>

        {topics.length === 0 ? (
          <p className="empty-note">
            {keyword
              ? "没有匹配的话题，换个关键词试试。"
              : "还没有话题，来发起第一个。"}
          </p>
        ) : (
          <div className="topic-list">
            {topics.map(({ topic, commentCount, lastActivity }) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="topic-card"
              >
                <h2 className="topic-card-title">{topic.title}</h2>
                <p className="topic-card-summary">{topic.summary}</p>
                <div className="topic-meta">
                  <span>{commentCount} 条评论</span>
                  <span>
                    最后活动 {lastActivity ?? topic.createdAt}
                  </span>
                  <span>起始于 {topic.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
