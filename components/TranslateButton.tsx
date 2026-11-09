"use client";

import { useState } from "react";
import { translateContent } from "@/app/actions";
import { msg, type Locale } from "@/lib/i18n";

export default function TranslateButton({
  entityType,
  entityId,
  locale,
}: {
  entityType: "topic" | "comment";
  entityId: string;
  locale: Locale;
}) {
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    if (text) {
      setOpen(true);
      return;
    }

    setBusy(true);
    setError(null);
    const result = await translateContent({ entityType, entityId });
    setBusy(false);

    if (!result.ok) {
      setError(msg(locale, "translateFailed"));
      return;
    }
    setText(result.text);
    setOpen(true);
  }

  return (
    <div className="translate-block">
      <button
        type="button"
        className="report-toggle"
        onClick={toggle}
        disabled={busy}
      >
        {busy
          ? msg(locale, "translating")
          : open
            ? msg(locale, "translateHide")
            : msg(locale, "translateBtn")}
      </button>
      {open && text && <p className="translated-text">{text}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
