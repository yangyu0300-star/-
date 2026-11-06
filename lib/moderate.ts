"use server";

/**
 * OpenRouter 调用封装——AI 敏感内容筛查
 *
 * 设计原则：
 *  - Best effort：AI 挂了 / 超时 / 返回 5xx → 静默跳过，绝不阻断主流程
 *  - 3 秒超时：Vercel Serverless 冷启动 + 免费模型一般 1 秒内返回，3 秒足够
 *  - 免费模型：google/gemma-3-4b-it:free，OpenRouter 免费通道，不走计费
 *  - 只扫三类：违法违规 / 明显人身攻击 / 色情低俗
 *  - 尖锐的反驳观点 ≠ 风险——我们是驳学者，prompt 里专门排除这个
 */

export type ModerationStatus = "passed" | "flagged" | "error";

export interface ModerationResult {
  status: ModerationStatus;
  model: string;
  reason: string | null;
}

const MODEL = "google/gemma-3-4b-it:free";
const TIMEOUT_MS = 3000;
const MAX_INPUT_CHARS = 4000;

const SYSTEM_PROMPT = `你是一个中文社区的内容筛查员，社区叫"驳学者"，是人们用来互相反驳、辩论、接力观点的。你必须区分"激烈但合法的观点反驳"和"真正违规的内容"。

**要标记为 flag 的只有三类：**
1. 违法违规：恐怖主义、仇恨言论、煽动暴力、极端主义
2. 明显人身攻击：直接辱骂对方（例如"你是废物"、"去死"），而不是批评观点
3. 色情低俗：露骨性描述

**以下情况必须标记为 passed（常见误判场景）：**
- 激烈但针对观点的反驳（例如"你的逻辑完全站不住脚"）
- 讽刺、挖苦、反话（只要不是直接辱骂）
- 政治、宗教、哲学观点（哪怕偏激也不是违规）
- 脏话但针对观点而非个人

**输出格式：严格只返回一行，内容是 JSON：**
{"status": "passed" | "flagged", "reason": "一句话说明"}

如果无法判断就返回 {"status": "passed", "reason": null}。
不要输出任何 JSON 以外的文字。`;

export async function moderateText(text: string): Promise<ModerationResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { status: "error", model: MODEL, reason: "no api key configured" };
  }

  const truncated = text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) : text;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://boxuezhe.cc",
        "X-Title": "boxuezhe.cc",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: truncated },
        ],
        temperature: 0,
        max_tokens: 200,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        status: "error",
        model: MODEL,
        reason: `http ${res.status}`,
      };
    }

    const data = await res.json();
    const raw: string | undefined = data?.choices?.[0]?.message?.content;

    if (!raw) {
      return { status: "error", model: MODEL, reason: "empty response" };
    }

    // 从模型输出里抠 JSON（免费小模型可能输出 markdown code fence）
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { status: "error", model: MODEL, reason: "no json in response" };
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      status?: string;
      reason?: string | null;
    };

    const status: ModerationStatus =
      parsed.status === "flagged" ? "flagged" : "passed";

    return {
      status,
      model: MODEL,
      reason: typeof parsed.reason === "string" ? parsed.reason : null,
    };
  } catch (err) {
    return {
      status: "error",
      model: MODEL,
      reason: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}
