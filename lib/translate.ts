/**
 * 机器翻译（源语言自动识别，目标语言跟随界面语言），无需 API Key。
 * 先试 Google 的非官方接口，失败再用 MyMemory 兜底。
 * 只做 best effort：失败就抛错，由调用方决定怎么提示。
 */

const TIMEOUT_MS = 8000;
const MAX_CHARS = 2000;

// 我们的语言代码 → 翻译接口用的语言代码
const TARGET_CODE: Record<string, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  ja: "ja",
  ko: "ko",
};

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function googleTranslate(text: string, target: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`google http ${res.status}`);

  const data = (await res.json()) as Array<Array<Array<string>>>;
  const segments = data?.[0];
  if (!Array.isArray(segments)) throw new Error("google: bad response");

  const out = segments
    .map((seg) => (Array.isArray(seg) ? seg[0] : ""))
    .join("")
    .trim();
  if (!out) throw new Error("google: empty translation");
  return out;
}

async function myMemoryTranslate(text: string, target: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text.slice(0, 500)
  )}&langpair=zh-CN|${target}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`mymemory http ${res.status}`);

  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
  };
  const out = data?.responseData?.translatedText?.trim();
  if (!out) throw new Error("mymemory: empty translation");
  return out;
}

export async function translateTo(text: string, locale: string): Promise<string> {
  const target = TARGET_CODE[locale];
  if (!target) throw new Error(`unsupported target locale: ${locale}`);

  const source = text.slice(0, MAX_CHARS);

  try {
    return await googleTranslate(source, target);
  } catch (googleError) {
    console.warn("[translate] google failed:", googleError);
    return await myMemoryTranslate(source, target);
  }
}
