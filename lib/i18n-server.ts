import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, isLocale, matchLocale, type Locale } from "./i18n";

/**
 * 读当前语言：cookie 里用户手动选过就用它；
 * 否则按浏览器 Accept-Language 自动识别，识别不到回中文。
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const saved = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const headerStore = await headers();
  return matchLocale(headerStore.get("accept-language"));
}
