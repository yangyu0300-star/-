"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/locale-actions";
import type { Locale } from "@/lib/i18n";

export default function LangSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        type="button"
        className="lang-btn"
        aria-pressed={locale === "zh"}
        onClick={() => change("zh")}
      >
        中文
      </button>
      <button
        type="button"
        className="lang-btn"
        aria-pressed={locale === "en"}
        onClick={() => change("en")}
      >
        EN
      </button>
    </div>
  );
}
