"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { REPORT_REASONS } from "@/lib/types";
import { translateTo } from "@/lib/translate";
import { isLocale, type Locale } from "@/lib/i18n";
import type { RefuteType, VoteValue } from "@/lib/types";

export interface SubmitInput {
  topicId: string;
  authorName: string;
  authorKey: string;
  refuteType: RefuteType;
  reason: string;
  targetQuote?: string;
}

const TITLE_MIN = 6;
const TITLE_MAX = 60;
const SUMMARY_MAX = 120;
const BODY_MIN = 20;
const BODY_MAX = 2000;
const DELETE_PWD_MIN = 6;
const DELETE_PWD_MAX = 40;

// 话题 id 用「标题里的英文数字 + 随机尾巴」，保证短、可读、不重复
function makeTopicId(title: string): string {
  const slug = (title.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .join("-")
    .slice(0, 24)
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return slug ? `${slug}-${suffix}` : `topic-${suffix}${Math.random().toString(36).slice(2, 4)}`;
}

export async function createTopic(input: {
  title: string;
  summary: string;
  body: string;
  ownerKey: string;
  deletePassword?: string;
}) {
  const title = input.title.trim();
  const body = input.body.trim().replace(/\r\n/g, "\n");
  let summary = input.summary.trim().replace(/\s+/g, " ");
  const deletePassword = (input.deletePassword ?? "").trim();

  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    return { ok: false as const, error: `话题标题需 ${TITLE_MIN}–${TITLE_MAX} 字。` };
  }
  if (summary.length > SUMMARY_MAX) {
    return { ok: false as const, error: `一句话简介最多 ${SUMMARY_MAX} 字。` };
  }
  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    return { ok: false as const, error: `话题正文需 ${BODY_MIN}–${BODY_MAX} 字。` };
  }
  if (input.ownerKey.length < 8 || input.ownerKey.length > 64) {
    return { ok: false as const, error: "发起凭证无效，请刷新页面重试。" };
  }
  if (deletePassword.length > 0 && deletePassword.length < DELETE_PWD_MIN) {
    return { ok: false as const, error: `删除密码至少 ${DELETE_PWD_MIN} 字，留空则不设置密码删除方式。` };
  }
  if (deletePassword.length > DELETE_PWD_MAX) {
    return { ok: false as const, error: `删除密码最多 ${DELETE_PWD_MAX} 字。` };
  }
  // 没填简介就自动取正文前一句，避免卡片上留空
  if (summary.length === 0) {
    summary = body.slice(0, SUMMARY_MAX).replace(/\n+/g, " ");
  }

  // 密码哈希（调用数据库函数做 bcrypt）
  let deletePasswordHash: string | null = null;
  if (deletePassword.length > 0) {
    const { data: hash, error: hashErr } = await supabase.rpc("hash_delete_password", {
      p_pwd: deletePassword,
    });
    if (hashErr) {
      return { ok: false as const, error: `密码加密失败：${hashErr.message}` };
    }
    deletePasswordHash = (hash as string) ?? null;
  }

  // id 冲突（极小概率）时换一个尾巴重试
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const id = makeTopicId(title);
    const { data, error } = await supabase
      .from("topics")
      .insert({
        id,
        title,
        summary,
        body,
        owner_key: input.ownerKey,
        delete_password_hash: deletePasswordHash,
      })
      .select("id")
      .single();

    if (!error) {
      revalidatePath("/");
      return { ok: true as const, id: data.id as string };
    }
    if (error.code !== "23505") {
      return { ok: false as const, error: `创建话题失败：${error.message}` };
    }
  }

  return { ok: false as const, error: "创建话题失败：编号重复，请重试。" };
}

export async function deleteTopic(input: {
  topicId: string;
  ownerKey?: string;
  deletePassword?: string;
}) {
  if (!input.topicId) {
    return { ok: false as const, error: "话题编号无效。" };
  }

  // owner_key 模式优先（本浏览器发起的最方便）
  if (input.ownerKey && input.ownerKey.length >= 8) {
    const { data, error } = await supabase.rpc("delete_topic", {
      p_id: input.topicId,
      p_secret: input.ownerKey,
    });
    if (error) {
      return { ok: false as const, error: `删除失败：${error.message}` };
    }
    if (data) {
      revalidatePath("/");
      return { ok: true as const };
    }
  }

  // 密码模式（owner_key 对不上或没传时才走这里）
  const pwd = (input.deletePassword ?? "").trim();
  if (pwd.length >= DELETE_PWD_MIN && pwd.length <= DELETE_PWD_MAX) {
    const { data, error } = await supabase.rpc("delete_topic", {
      p_id: input.topicId,
      p_secret: `pwd:${pwd}`,
    });
    if (error) {
      return { ok: false as const, error: `删除失败：${error.message}` };
    }
    if (data) {
      revalidatePath("/");
      return { ok: true as const };
    }
    return { ok: false as const, error: "删除密码不对。" };
  }

  return {
    ok: false as const,
    error: "你不是这个浏览器发的话题，也没填密码，无法删除。",
  };
}

export async function submitComment(input: SubmitInput) {
  // 服务端二次校验（双保险，数据库层还有 check 约束）
  const author = input.authorName.trim();
  const authorKey = input.authorKey.trim();
  const reason = input.reason.trim();
  const quote = input.targetQuote?.trim();

  if (author.length === 0 || author.length > 20) {
    return { ok: false, error: "昵称需 1–20 字。" };
  }
  if (authorKey.length < 8 || authorKey.length > 64) {
    return { ok: false, error: "浏览器标识无效。" };
  }
  if (!["full", "partial"].includes(input.refuteType)) {
    return { ok: false, error: "反驳类型无效。" };
  }
  if (reason.length < 20 || reason.length > 2000) {
    return { ok: false, error: "反驳理由需 20–2000 字。" };
  }
  if (input.refuteType === "partial") {
    if (!quote || quote.length > 200) {
      return { ok: false, error: "部分反驳必须指出反驳的具体部分（1–200 字）。" };
    }
  }

  // 找到当前话题的链尾评论（按 created_at 升序最后一条）
  const { data: tail, error: tailErr } = await supabase
    .from("comments")
    .select("id, author_key")
    .eq("topic_id", input.topicId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (tailErr) return { ok: false, error: `读取话题失败：${tailErr.message}` };

  // 同一浏览器不能连续接龙：链尾是自己发的，就要等别人先接上
  if (tail?.author_key && tail.author_key === authorKey) {
    return { ok: false, error: "CHAIN_BLOCKED" };
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      topic_id: input.topicId,
      parent_id: tail?.id ?? null,
      refute_type: input.refuteType,
      target_quote: input.refuteType === "partial" ? quote : null,
      reason,
      author_name: author,
      author_key: authorKey,
    })
    .select(
      "id, topic_id, parent_id, refute_type, target_quote, reason, author_name, created_at, status, vote_up, vote_down"
    )
    .single();

  if (error) {
    // 把数据库约束的报错翻译成用户友好的提示
    if (error.code === "23514") {
      return {
        ok: false,
        error:
          "提交失败：数据库校验未通过。部分反驳必须填具体反驳的内容；理由需 20–2000 字。",
      };
    }
    return { ok: false, error: `提交失败：${error.message}` };
  }

  // 让列表页的评论数、最后活动时间跟着更新
  revalidatePath("/");
  revalidatePath(`/topics/${input.topicId}`);

  return { ok: true, comment: data };
}

export async function submitReport(input: { commentId: string; reason: string }) {
  const reason = input.reason.trim();

  if (!REPORT_REASONS.includes(reason as (typeof REPORT_REASONS)[number])) {
    return { ok: false, error: "举报原因无效。" };
  }
  if (!input.commentId) {
    return { ok: false, error: "举报对象无效。" };
  }

  const { error } = await supabase.from("reports").insert({
    comment_id: input.commentId,
    reason,
  });

  if (error) {
    return { ok: false, error: `举报提交失败：${error.message}` };
  }

  return { ok: true };
}

export type VoteResult =
  | { ok: false; error: string }
  | { ok: true; voteUp: number; voteDown: number };

export async function submitVote(input: {
  commentId: string;
  value: VoteValue;
  voterKey: string;
}): Promise<VoteResult> {
  if (!["up", "down"].includes(input.value)) {
    return { ok: false, error: "投票类型无效。" };
  }
  if (!input.commentId) {
    return { ok: false, error: "投票对象无效。" };
  }
  if (input.voterKey.length < 8 || input.voterKey.length > 64) {
    return { ok: false, error: "投票标识无效。" };
  }

  // 同一 comment + voter_key 只保留一票；重复点击会改写这一票
  const { error } = await supabase.from("votes").upsert(
    {
      comment_id: input.commentId,
      voter_key: input.voterKey,
      value: input.value,
    },
    { onConflict: "comment_id,voter_key" }
  );

  if (error) {
    return { ok: false, error: `投票失败：${error.message}` };
  }

  const { data, error: readErr } = await supabase
    .from("comments")
    .select("vote_up, vote_down")
    .eq("id", input.commentId)
    .single();

  if (readErr) {
    return { ok: false, error: `读取计数失败：${readErr.message}` };
  }

  return {
    ok: true,
    voteUp: (data?.vote_up as number | null) ?? 0,
    voteDown: (data?.vote_down as number | null) ?? 0,
  };
}

export type TranslateResult = { ok: false; error: string } | { ok: true; text: string };

export async function translateContent(input: {
  entityType: "topic" | "comment";
  entityId: string;
  lang: Locale;
}): Promise<TranslateResult> {
  if (!["topic", "comment"].includes(input.entityType) || !input.entityId) {
    return { ok: false, error: "翻译对象无效。" };
  }
  if (!isLocale(input.lang) || input.lang === "zh") {
    return { ok: false, error: "翻译目标语言无效。" };
  }

  const lang = input.lang;

  // 命中缓存直接返回，避免重复调用翻译接口
  const { data: cached } = await supabase
    .from("translations")
    .select("content")
    .eq("entity_type", input.entityType)
    .eq("entity_id", input.entityId)
    .eq("lang", lang)
    .maybeSingle();
  if (cached?.content) {
    return { ok: true, text: cached.content as string };
  }

  let source = "";
  if (input.entityType === "topic") {
    const { data, error } = await supabase
      .from("topics")
      .select("title, body")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error || !data) return { ok: false, error: "读取话题失败。" };
    source = `${data.title}\n\n${data.body}`;
  } else {
    const { data, error } = await supabase
      .from("comments")
      .select("reason")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error || !data) return { ok: false, error: "读取评论失败。" };
    // 开场语随界面语言显示，属于界面文案，不参与机器翻译
    source = data.reason;
  }

  try {
    const text = await translateTo(source, lang);
    await supabase.from("translations").upsert(
      {
        entity_type: input.entityType,
        entity_id: input.entityId,
        lang,
        content: text,
      },
      { onConflict: "entity_type,entity_id,lang" }
    );
    return { ok: true, text };
  } catch (err) {
    console.error("[translate] failed:", err);
    return { ok: false, error: "翻译失败，请稍后再试。" };
  }
}
