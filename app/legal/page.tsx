import Topbar from "@/components/Topbar";
import { getLocale } from "@/lib/i18n-server";
import { msg, type MsgKey } from "@/lib/i18n";
import { getLegalPack } from "@/lib/legal";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { LegalPack, LegalDoc } from "@/lib/legal/legal-types";

type LegalDocKey = "community" | "privacy" | "terms";

const TABS: Array<{ key: LegalDocKey; labelKey: string }> = [
  { key: "community", labelKey: "legalCommunity" },
  { key: "privacy", labelKey: "legalPrivacy" },
  { key: "terms", labelKey: "legalTerms" },
];

export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const locale: Locale = await getLocale();
  const { doc } = await searchParams;
  const pack = getLegalPack(locale);
  const docKey: LegalDocKey | undefined = doc === "community" || doc === "privacy" || doc === "terms" ? doc : undefined;
  const current: LegalDocKey = docKey ?? "community";
  const content: LegalDoc = pack[current];
  const isEnFallback = locale !== "zh" && locale !== "en";

  return (
    <>
      <Topbar locale={locale} />

      <main className="shell legal-page">
        <Link href="/" className="back-link">
          ← {msg(locale, "backToList")}
        </Link>

        <h1 className="page-title">{msg(locale, "legalTitle")}</h1>
        <p className="page-sub">
          {msg(locale, "legalUpdatedAt", { d: content.updatedAt })}
        </p>

        <nav className="legal-tabs" role="tablist">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/legal?doc=${t.key}`}
              role="tab"
              aria-selected={current === t.key}
              className="legal-tab"
              aria-current={current === t.key ? "page" : undefined}
            >
              {msg(locale, t.labelKey as MsgKey)}
            </Link>
          ))}
        </nav>

        {isEnFallback && (
          <p className="legal-fallback">{msg(locale, "legalFallback")}</p>
        )}

        <article className="legal-doc">
          <p className="legal-preamble">{content.preamble}</p>
          {content.sections.map(
            (sec: { title: string; body: string }, i: number) => (
              <section key={i} className="legal-section">
                <h2 className="legal-h2">{sec.title}</h2>
                <p className="legal-body">{sec.body}</p>
              </section>
            )
          )}
        </article>
      </main>
    </>
  );
}
