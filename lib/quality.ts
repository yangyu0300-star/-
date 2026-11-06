import type { CommentStatus } from "./types";

export type QualityLabel = "solid" | "flawed";

export const QUALITY_LABEL: Record<QualityLabel, string> = {
  solid: "论证更完整",
  flawed: "论证待补充",
};

export const QUALITY_HINT =
  "本话题投票量已足够，评论旁标签是同话题内投票的相对比较：只评价论证过程，不影响排列顺序，也不代表观点对错。";

// 话题级门槛：至少 3 条评论被投票，且每条评论平均投票数 ≥ 5
const MIN_VOTED_COMMENTS = 3;
const MIN_AVG_VOTES = 5;

export interface QualityInput {
  id: string;
  status: CommentStatus;
  voteUp: number;
  voteDown: number;
}

/**
 * 同话题内相对排名：按「逻辑站得住」占比排序，取头尾各三分之一。
 * 不达门槛、或边界同分时不贴标签，避免噪声式判定。
 */
export function computeQualityLabels(
  comments: QualityInput[]
): Record<string, QualityLabel> {
  const visible = comments.filter((c) => c.status !== "removed");
  const voted = visible
    .map((c) => {
      const total = c.voteUp + c.voteDown;
      return { id: c.id, total, score: total > 0 ? c.voteUp / total : 0 };
    })
    .filter((c) => c.total > 0);

  const totalVotes = voted.reduce((sum, c) => sum + c.total, 0);
  if (voted.length < MIN_VOTED_COMMENTS) return {};
  if (totalVotes < visible.length * MIN_AVG_VOTES) return {};

  const ranked = [...voted].sort((a, b) => b.score - a.score);
  const size = Math.max(1, Math.floor(ranked.length / 3));
  const labels: Record<string, QualityLabel> = {};

  const solid = ranked.slice(0, size);
  const flawed = ranked.slice(ranked.length - size);

  // 边界同分（含并列）时整组不贴标签
  if (solid.length < ranked.length) {
    const cut = ranked[solid.length].score;
    if (solid.every((c) => c.score > cut)) {
      solid.forEach((c) => {
        labels[c.id] = "solid";
      });
    }
  }

  if (flawed.length < ranked.length) {
    const cut = ranked[ranked.length - flawed.length - 1].score;
    if (flawed.every((c) => c.score < cut)) {
      flawed.forEach((c) => {
        labels[c.id] = "flawed";
      });
    }
  }

  return labels;
}
