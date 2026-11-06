import Link from "next/link";
import { getTopics } from "@/lib/db";

// 话题数据随时会变，不在构建时预渲染，避免构建期依赖数据库
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topics = await getTopics();

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">反驳接力</span>
          <span className="brand-note">每条新评论，只能反驳上一条</span>
        </div>
      </header>

      <main className="shell">
        <div className="rule-banner">
          这里没有并列的观点，只有<strong>一条链</strong>：想发言，就反驳紧邻的上一条评论。
          规则是玩法的一部分，不接受跳层回复。
        </div>

        <div className="list-head">
          <div>
            <h1 className="page-title">进行中的话题</h1>
            <p className="page-sub">选一个话题，从链尾接上你的反驳。</p>
          </div>
          <Link href="/topics/new" className="new-topic-link">
            ＋ 发起新话题
          </Link>
        </div>

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
      </main>
    </>
  );
}
