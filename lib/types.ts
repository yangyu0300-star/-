export type RefuteType = "full" | "partial";

export type CommentStatus = "visible" | "removed";

export interface Topic {
  id: string;
  title: string;
  summary: string;
  body: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  topicId: string;
  parentId: string | null;
  refuteType: RefuteType;
  targetQuote?: string;
  reason: string;
  author: string;
  createdAt: string;
  status: CommentStatus;
  voteUp: number;
  voteDown: number;
}

export type VoteValue = "up" | "down";

export const VOTE_LABEL: Record<VoteValue, string> = {
  up: "逻辑站得住",
  down: "逻辑有漏洞",
};

export const VOTE_HINT =
  "这两个按钮只评价论证过程，不评价你是否认同观点。不同意就直接接力反驳。";

export const REPORT_REASONS = [
  "违法违规内容",
  "广告或引流",
  "人身攻击",
  "其他",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REMOVED_PLACEHOLDER = "该评论因违反社区规则已被移除";

export const REFUTE_LABEL: Record<RefuteType, string> = {
  full: "完全反驳",
  partial: "部分反驳",
};

export const OPENING_PHRASE: Record<RefuteType, string> = {
  full: "我不同意上一条评论的结论：",
  partial: "我认同其中一部分，但我不同意以下内容：",
};
