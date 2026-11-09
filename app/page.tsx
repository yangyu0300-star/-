import Link from "next/link";
import Topbar from "@/components/Topbar";
import { getTopics } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { msg } from "@/lib/i18n";

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
  const locale = await getLocale();

  return (
    <>
      <Topbar locale={locale} />

      <main className="shell">
        <div className="rule-banner">
          {msg(locale, "ruleA")}
          <strong>{msg(locale, "ruleStrong")}</strong>
          {msg(locale, "ruleC")}
        </div>

        <form action="/" method="get" className="search-bar">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            placeholder={msg(locale, "searchPlaceholder")}
            maxLength={50}
            className="field field-plain search-input"
          />
          <button type="submit" className="submit">
            {msg(locale, "searchBtn")}
          </button>
          {keyword && (
            <Link href="/" className="search-clear">
              {msg(locale, "clear")}
            </Link>
          )}
        </form>

        <div className="list-head">
          <div>
            <h1 className="page-title">
              {keyword
                ? msg(locale, "searchTitle", { q: keyword })
                : msg(locale, "homeTitle")}
            </h1>
            <p className="page-sub">
              {keyword
                ? msg(locale, "searchSub", { n: topics.length })
                : msg(locale, "homeSubtitle")}
            </p>
          </div>
          <Link href="/topics/new" className="new-topic-link">
            {msg(locale, "newTopic")}
          </Link>
        </div>

        {topics.length === 0 ? (
          <p className="empty-note">
            {keyword ? msg(locale, "emptySearch") : msg(locale, "emptyNone")}
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
                  <span>{msg(locale, "comments", { n: commentCount })}</span>
                  <span>
                    {msg(locale, "lastActivity", {
                      d: lastActivity ?? topic.createdAt,
                    })}
                  </span>
                  <span>{msg(locale, "startedAt", { d: topic.createdAt })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
