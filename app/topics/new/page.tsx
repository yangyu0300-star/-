import Link from "next/link";
import TopicForm from "@/components/TopicForm";
import Topbar from "@/components/Topbar";
import { getLocale } from "@/lib/i18n-server";
import { msg } from "@/lib/i18n";

export default async function NewTopicPage() {
  const locale = await getLocale();

  return (
    <>
      <Topbar locale={locale} />

      <main className="shell">
        <Link href="/" className="back-link">
          {msg(locale, "backToList")}
        </Link>

        <h1 className="page-title">{msg(locale, "newTopicTitle")}</h1>
        <p className="page-sub">{msg(locale, "newTopicSubtitle")}</p>

        <TopicForm locale={locale} />
      </main>
    </>
  );
}
