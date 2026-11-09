import Link from "next/link";
import LangSwitch from "./LangSwitch";
import { msg, type Locale } from "@/lib/i18n";

export default function Topbar({ locale }: { locale: Locale }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          {msg(locale, "brand")}
        </Link>
        <span className="brand-note">{msg(locale, "tagline")}</span>
        <LangSwitch locale={locale} />
      </div>
    </header>
  );
}
