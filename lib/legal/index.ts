import type { LegalPack } from "./legal-types";
import { zh } from "./zh";
import { en } from "./en";
import type { Locale } from "@/lib/i18n";

const DICT: Record<Locale, LegalPack> = { zh, en, es: en, fr: en, de: en, pt: en, ja: en, ko: en };

export function getLegalPack(locale: Locale): LegalPack {
  return DICT[locale];
}
