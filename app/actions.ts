"use server";

import { supabase } from "@/lib/supabase";
import type { RefuteType } from "@/lib/types";

export interface SubmitInput {
  topicId: string;
  authorName: string;
  refuteType: RefuteType;
  reason: string;
  targetQuote?: string;
}

export async function submitComment(input: SubmitInput) {
  // 服务端二次校验（双保险，数据库层还有 check 约束）
  const author = input.authorName.trim();
  const reason = input.reason.trim();
  const quote = input.targetQuote?.trim();

  if (author.length === 0 || author.length > 20) {
    return { ok: false, error: "昵称需 1–20 字。" };
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
    .select("id")
    .eq("topic_id", input.topicId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (tailErr) return { ok: false, error: `读取话题失败：${tailErr.message}` };

  const { data, error } = await supabase
    .from("comments")
    .insert({
      topic_id: input.topicId,
      parent_id: tail?.id ?? null,
      refute_type: input.refuteType,
      target_quote: input.refuteType === "partial" ? quote : null,
      reason,
      author_name: author,
    })
    .select("id, topic_id, parent_id, refute_type, target_quote, reason, author_name, created_at")
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

  return { ok: true, comment: data };
}
