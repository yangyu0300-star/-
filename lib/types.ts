export type RefuteType = "full" | "partial";

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
}

export const REFUTE_LABEL: Record<RefuteType, string> = {
  full: "完全反驳",
  partial: "部分反驳",
};

export const OPENING_PHRASE: Record<RefuteType, string> = {
  full: "我不同意上一条评论的结论：",
  partial: "我认同其中一部分，但我不同意以下内容：",
};
