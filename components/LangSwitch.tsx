"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/locale-actions";
import { LOCALE_LABEL, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

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
    <div className="lang-switch">
      <select
        className="lang-select"
        value={locale}
        disabled={pending}
        aria-label="Language"
        onChange={(event) => change(event.target.value as Locale)}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABEL[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
