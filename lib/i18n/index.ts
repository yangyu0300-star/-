export const LOCALE_COOKIE = "rr_locale";

export type Locale = "zh" | "en" | "es" | "fr" | "de" | "pt" | "ja" | "ko";

export const DEFAULT_LOCALE: Locale = "zh";

export const SUPPORTED_LOCALES: Locale[] = [
  "zh",
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ja",
  "ko",
];

/** 顶栏语言下拉框用的原生语言名 */
export const LOCALE_LABEL: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ja: "日本語",
  ko: "한국어",
};

const zh = {
  brand: "驳学者",
  tagline: "每条新评论，只能反驳上一条",
  backToList: "← 返回话题列表",
  cancel: "取消",
  submitFailed: "提交失败，请稍后再试。",

  ruleA: "这里没有并列的观点，只有",
  ruleStrong: "一条链",
  ruleC: "：想发言，就反驳紧邻的上一条评论。规则是玩法的一部分，不接受跳层回复。",

  searchPlaceholder: "搜索话题标题或简介",
  searchBtn: "搜索",
  clear: "清除",
  homeTitle: "进行中的话题",
  homeSubtitle: "选一个话题，从链尾接上你的反驳。",
  searchTitle: "搜索「{q}」",
  searchSub: "找到 {n} 个匹配话题。",
  emptySearch: "没有匹配的话题，换个关键词试试。",
  emptyNone: "还没有话题，来发起第一个。",
  newTopic: "＋ 发起新话题",
  comments: "{n} 条评论",
  lastActivity: "最后活动 {d}",
  startedAt: "起始于 {d}",

  topicStarted: "起始于 {d}",
  chainTitle: "评论链",
  chainMeta: "共 {n} 环 · 由上到下依次接力",
  removedBadge: "已移除",
  ring: "第 {n} 环",
  removedText: "该评论因违反社区规则已被移除",
  voteHint: "这两个按钮只评价论证过程，不评价你是否认同观点。不同意就直接接力反驳。",
  qualityHint:
    "本话题投票量已足够，评论旁标签是同话题内投票的相对比较：只评价论证过程，不影响排列顺序，也不代表观点对错。",
  voteUp: "逻辑站得住",
  voteDown: "逻辑有漏洞",
  qualitySolid: "论证更完整",
  qualityFlawed: "论证待补充",
  reportToggle: "举报这条评论",
  reportedNote: "已举报，等待处理",
  reportTitle: "选择举报原因",
  reportSubmit: "提交举报",
  reportBusy: "提交中…",
  reportIllegal: "违法违规内容",
  reportSpam: "广告或引流",
  reportAttack: "人身攻击",
  reportOther: "其他",
  translateBtn: "翻译成英文",
  translateHide: "收起翻译",
  translating: "翻译中…",
  translateFailed: "翻译失败，请稍后再试。",
  openingFull: "我不同意上一条评论的结论：",
  openingPartial: "我认同其中一部分，但我不同意以下内容：",
  chainBlocked: "链尾这条是你发的。等别人接上之后，你才能继续在这条链上反驳。",

  targetTail: "你的反驳对象是链尾唯一一条评论：",
  targetTailRemoved:
    "你的反驳对象是链尾唯一一条评论，但它已被移除（{removed}）。你仍然接在它后面，位置保留。",
  targetFirst: "这个话题还没有评论，你将成为第 1 环。",
  authorLabel: "你的昵称",
  authorPlaceholder: "最多 20 字",
  typeGroup: "选择反驳类型",
  typeFull: "完全反驳",
  typeFullDesc: "整条观点都不成立，包括它的前提。",
  typePartial: "部分反驳",
  typePartialDesc: "同意其中一部分，但有一处必须反驳。",
  reasonHeading: "反驳理由（开场语之外的内容）",
  countRange: "{n} / {max}，最少 {min}",
  lockedTag: "固定开场语 · 不可删改",
  reasonPlaceholder: "只写开场语之后的内容。说清楚上一条哪里不成立，为什么。",
  quoteLabel: "你要反驳的是哪一部分？（引用或概括，必填）",
  quotePlaceholder: "例如：上一条里「之后每一次收紧都会被当成背叛」这句",
  footHint: "你的反驳会接在链尾，成为下一条评论唯一可反驳的对象。",
  replySubmit: "接上这一环",

  errAuthorRequired: "请留一个昵称。",
  errAuthorMax: "昵称最多 {max} 字。",
  errTypeRequired: "请先选择「完全反驳」或「部分反驳」。",
  errReasonEmpty: "反驳理由不能为空。",
  errReasonMin: "反驳理由至少 {min} 字，当前 {n} 字。",
  errReasonMax: "反驳理由最多 {max} 字，当前 {n} 字。",
  errQuoteRequired: "部分反驳必须指出具体反驳的是哪一部分。",
  errQuoteMax: "引用请控制在 {max} 字以内，当前 {n} 字。",
  errTitleMin: "标题至少 {min} 字，当前 {n} 字。",
  errTitleMax: "标题最多 {max} 字，当前 {n} 字。",
  errSummaryMax: "简介最多 {max} 字，当前 {n} 字。",
  errBodyMin: "正文至少 {min} 字，当前 {n} 字。",
  errBodyMax: "正文最多 {max} 字，当前 {n} 字。",
  errPwdMin: "删除密码至少 {min} 字，当前 {n} 字。",
  errPwdMax: "删除密码最多 {max} 字。",
  errDeletePwdMin: "删除密码至少 {min} 位。",

  newTopicTitle: "发起一个新话题",
  newTopicSubtitle:
    "话题不是提问箱，而是一个可以被接力反驳的争议点。写清楚各方立场，别预设立场对错。",

  formTitleLabel: "话题标题（要有争议性，让人想反驳）",
  formTitlePlaceholder: "例如：「算法推荐让人越来越极端」这个说法站得住脚吗？",
  formSummaryLabel: "一句话简介（可留空，自动取正文开头）",
  formSummaryPlaceholder: "一句话说清这个争议点",
  formBodyLabel: "话题正文（交代背景和双方观点）",
  formBodyPlaceholder:
    "说清楚这个问题的两三种立场，以及争论的焦点在哪里。段落之间空一行。",
  formPwdLabel:
    "删除密码（可选，{min}–{max} 位；留空则只有本浏览器能删，换浏览器就删不了）",
  formPwdPlaceholder: "设一个只有你自己知道的密码，用它在任何浏览器都能删这个话题",
  formFootHint: "话题发布后不能修改，第一条评论由你在话题页接上。",
  formSubmit: "发布话题",
  formBusy: "发布中…",

  browserDelete: "删除这个话题（本浏览器）",
  browserHint: "本浏览器是发起人，可以直接删。",
  deleteBusy: "删除中…",
  pwdLink: "用删除密码删除",
  pwdHint: "如果你创建话题时设置了删除密码，在这里输入就能删：",
  pwdPlaceholder: "输入删除密码",
  confirmDelete: "确认删除",
  confirmDeleteText: "删除后话题和整条评论链都会消失，且无法恢复。确定删除？",
  deleteFailed: "删除失败，请稍后再试。",
  voteFailed: "投票失败，请稍后再试。",
  reportFailed: "举报失败，请稍后再试。",
} as const;

export type MsgKey = keyof typeof zh;

const en: Record<MsgKey, string> = {
  brand: "Boxuezhe",
  tagline: "Every new comment can only rebut the one above it",
  backToList: "← Back to topics",
  cancel: "Cancel",
  submitFailed: "Submission failed, please try again later.",

  ruleA: "There are no parallel opinions here — only ",
  ruleStrong: "one chain",
  ruleC:
    ": to speak, you must rebut the comment directly above yours. The rule is part of the game; skipped replies are not allowed.",

  searchPlaceholder: "Search topic titles or summaries",
  searchBtn: "Search",
  clear: "Clear",
  homeTitle: "Ongoing debates",
  homeSubtitle: "Pick a topic and add your rebuttal at the end of the chain.",
  searchTitle: "Search “{q}”",
  searchSub: "{n} matching topic(s).",
  emptySearch: "No matching topics. Try another keyword.",
  emptyNone: "No topics yet. Start the first one.",
  newTopic: "+ Start a topic",
  comments: "{n} comment(s)",
  lastActivity: "Last activity {d}",
  startedAt: "Started {d}",

  topicStarted: "Started {d}",
  chainTitle: "The chain",
  chainMeta: "{n} link(s) · each rebuts the one above",
  removedBadge: "Removed",
  ring: "Link {n}",
  removedText: "This comment was removed for violating community rules",
  voteHint:
    "These two buttons rate the reasoning only, not whether you agree with the opinion. Disagree? Rebut it in the chain.",
  qualityHint:
    "There are enough votes in this topic. Labels compare reasoning within this topic only: they rate the argument, not the opinion, and never change the order.",
  voteUp: "Argument holds",
  voteDown: "Argument has gaps",
  qualitySolid: "Stronger reasoning",
  qualityFlawed: "Reasoning needs work",
  reportToggle: "Report this comment",
  reportedNote: "Reported, awaiting review",
  reportTitle: "Choose a reason",
  reportSubmit: "Submit report",
  reportBusy: "Submitting…",
  reportIllegal: "Illegal content",
  reportSpam: "Spam or promotion",
  reportAttack: "Personal attack",
  reportOther: "Other",
  translateBtn: "Translate to English",
  translateHide: "Hide translation",
  translating: "Translating…",
  translateFailed: "Translation failed, please try again later.",
  openingFull: "I disagree with the conclusion of the comment above: ",
  openingPartial: "I agree with part of it, but I disagree with the following: ",
  chainBlocked: "The last link is yours. Wait until someone rebuts it before adding another.",

  targetTail: "Your rebuttal targets the only last comment in the chain:",
  targetTailRemoved:
    "Your rebuttal targets the last comment in the chain, but it has been removed ({removed}). You still reply after it; its position is kept.",
  targetFirst: "This topic has no comments yet. You will be link 1.",
  authorLabel: "Your name",
  authorPlaceholder: "Up to 20 characters",
  typeGroup: "Choose rebuttal type",
  typeFull: "Full rebuttal",
  typeFullDesc: "The whole claim fails, including its premise.",
  typePartial: "Partial rebuttal",
  typePartialDesc: "You agree with part of it, but one point must be rebutted.",
  reasonHeading: "Your rebuttal (beyond the fixed opening line)",
  countRange: "{n} / {max}, minimum {min}",
  lockedTag: "Fixed opening · cannot be edited",
  reasonPlaceholder:
    "Write only what comes after the opening line. Explain what fails above and why.",
  quoteLabel: "Which part are you rebutting? (quote or paraphrase, required)",
  quotePlaceholder: "e.g. the line “every tightening will be seen as betrayal”",
  footHint:
    "Your rebuttal joins the end of the chain and becomes the only target of the next comment.",
  replySubmit: "Add your link",

  errAuthorRequired: "Please enter a name.",
  errAuthorMax: "Name can be at most {max} characters.",
  errTypeRequired: "Choose “Full rebuttal” or “Partial rebuttal” first.",
  errReasonEmpty: "Rebuttal cannot be empty.",
  errReasonMin: "Rebuttal needs at least {min} characters; currently {n}.",
  errReasonMax: "Rebuttal can be at most {max} characters; currently {n}.",
  errQuoteRequired: "A partial rebuttal must name the part being rebutted.",
  errQuoteMax: "Keep the quote within {max} characters; currently {n}.",
  errTitleMin: "Title needs at least {min} characters; currently {n}.",
  errTitleMax: "Title can be at most {max} characters; currently {n}.",
  errSummaryMax: "Summary can be at most {max} characters; currently {n}.",
  errBodyMin: "Body needs at least {min} characters; currently {n}.",
  errBodyMax: "Body can be at most {max} characters; currently {n}.",
  errPwdMin: "Delete password needs at least {min} characters; currently {n}.",
  errPwdMax: "Delete password can be at most {max} characters.",
  errDeletePwdMin: "Delete password needs at least {min} characters.",

  newTopicTitle: "Start a new topic",
  newTopicSubtitle:
    "A topic is not a question box but a contested point open to chained rebuttals. Lay out the positions; don't presume who is right.",

  formTitleLabel: "Topic title (make it debatable)",
  formTitlePlaceholder: "e.g. Does “algorithms make us more extreme” hold up?",
  formSummaryLabel: "One-line summary (optional; defaults to the start of the body)",
  formSummaryPlaceholder: "State the contested point in one line",
  formBodyLabel: "Topic body (background and both sides)",
  formBodyPlaceholder:
    "Describe two or three positions and where the disagreement lies. Separate paragraphs with a blank line.",
  formPwdLabel:
    "Delete password (optional, {min}–{max} chars; if left empty only this browser can delete it)",
  formPwdPlaceholder:
    "Set a password known only to you to delete it from any browser",
  formFootHint:
    "A topic cannot be edited after publishing; you add the first comment on its page.",
  formSubmit: "Publish topic",
  formBusy: "Publishing…",

  browserDelete: "Delete this topic (this browser)",
  browserHint: "This browser created the topic, so you can delete it directly.",
  deleteBusy: "Deleting…",
  pwdLink: "Delete with a password",
  pwdHint: "If you set a delete password when creating the topic, enter it here:",
  pwdPlaceholder: "Enter delete password",
  confirmDelete: "Confirm delete",
  confirmDeleteText:
    "The topic and its entire comment chain will be deleted permanently. Continue?",
  deleteFailed: "Delete failed, please try again later.",
  voteFailed: "Vote failed, please try again later.",
  reportFailed: "Report failed, please try again later.",
};

import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { de } from "./locales/de";
import { pt } from "./locales/pt";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";

const DICT: Record<Locale, Record<MsgKey, string>> = {
  zh,
  en,
  es,
  fr,
  de,
  pt,
  ja,
  ko,
};

/** 取文案；{n} 之类的占位符会被替换 */
export function msg(
  locale: Locale,
  key: MsgKey,
  vars?: Record<string, string | number>
): string {
  let text: string = DICT[locale]?.[key] ?? DICT.zh[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function isLocale(value: string | undefined | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

/** 把 Accept-Language 头映射成我们支持的语言，找不到就回中文 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return {
        tag: tag.trim().toLowerCase(),
        q: q ? Number.parseFloat(q) : 1,
      };
    })
    .filter((item) => item.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of prefs) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
    // 葡萄牙语、日语、韩语的各种区域变体都归到主语言
    if (base === "pt" || base === "ja" || base === "ko") return base;
  }

  return DEFAULT_LOCALE;
}

/** 举报原因在数据库里存中文，展示时按当前语言映射 */
export function reportReasonLabel(locale: Locale, reason: string): string {
  const map: Record<string, MsgKey> = {
    违法违规内容: "reportIllegal",
    广告或引流: "reportSpam",
    人身攻击: "reportAttack",
    其他: "reportOther",
  };
  const key = map[reason];
  return key ? msg(locale, key) : reason;
}
