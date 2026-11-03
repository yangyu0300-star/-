import type { Comment, Topic } from "./types";

export const topics: Topic[] = [
  {
    id: "traffic-before-quality",
    title: "「先有流量，再谈质量」这个说法站得住脚吗？",
    summary: "一个常见的发展顺序假设：先把人聚起来，内容质量自然会跟上。",
    body:
      "很多社区在起步阶段都会选择先追求流量：放宽准入、降低门槛、用争议内容换曝光。支持者的理由是「没有流量就没有讨论，质量无从谈起」。\n\n但也有人认为顺序反过来才成立：早期用户的口味决定了社区的气质，一旦用低质量内容拉新，后面再想收紧就来不及了。\n\n请在下方评论链中接力反驳，注意：每条新评论只能针对紧邻的上一条评论。",
    createdAt: "2026-10-28",
  },
  {
    id: "remote-trust",
    title: "远程办公一定会削弱团队信任吗？",
    summary: "线下见面减少之后，信任是靠流程补足，还是必然流失？",
    body:
      "远程办公的支持者强调结果导向：只要交付稳定，坐在哪里并不重要。反对者则认为信任来自高频的、非正式的接触，视频会议替代不了这些。\n\n有意思的是，双方的争论经常混在一起：一边在谈协作效率，一边在谈人际关系。接力时请先说清楚你到底在反驳哪一层。",
    createdAt: "2026-10-30",
  },
];

export const initialComments: Comment[] = [
  {
    id: "c1",
    topicId: "traffic-before-quality",
    parentId: null,
    refuteType: "full",
    reason:
      "流量本身不区分好坏，早期为了拉新而放宽的规则会成为默认预期。社区一旦用争议内容获客，之后的每一次收紧都会被当成背叛，成本远高于一开始就慢一点。",
    author: "林一",
    createdAt: "2026-10-28 21:10",
  },
  {
    id: "c2",
    topicId: "traffic-before-quality",
    parentId: "c1",
    refuteType: "partial",
    targetQuote: "之后的每一次收紧都会被当成背叛",
    reason:
      "假设太绝对。规则收紧确实有阻力，但阻力大小取决于是否提前公示。如果社区从一开始就把规则写在显眼位置，收紧只是执行既有承诺，并不会被当成背叛。",
    author: "周衡",
    createdAt: "2026-10-29 09:02",
  },
  {
    id: "c3",
    topicId: "traffic-before-quality",
    parentId: "c2",
    refuteType: "full",
    reason:
      "提前公示并不能解决执行层面的问题。真正决定阻力的是早期用户构成：靠争议内容吸引来的人群，本来就不是为了规则而来，公示对他们没有约束力。",
    author: "陈默",
    createdAt: "2026-10-29 15:40",
  },
  {
    id: "c4",
    topicId: "traffic-before-quality",
    parentId: "c3",
    refuteType: "partial",
    targetQuote: "本来就不是为了规则而来，公示对他们没有约束力",
    reason:
      "前半句成立，后半句过头了。用户不为规则而来，不等于规则无效；真正起作用的是规则的执行一致性，而不是用户的初始动机。把动机当作唯一变量，会让结论无法被验证。",
    author: "许言",
    createdAt: "2026-10-30 11:05",
  },
  {
    id: "c5",
    topicId: "remote-trust",
    parentId: null,
    refuteType: "full",
    reason:
      "「一定」这个词就不成立。信任的来源是预测能力：能预期对方在什么情况下会怎么反应。远程办公削弱的是非正式互动，但可以用更明确的交付约定和更短的反馈周期补上，两者不是同一件事。",
    author: "何嘉",
    createdAt: "2026-10-30 20:18",
  },
  {
    id: "c6",
    topicId: "remote-trust",
    parentId: "c5",
    refuteType: "partial",
    targetQuote: "可以用更明确的交付约定和更短的反馈周期补上",
    reason:
      "补上的部分我同意，但补上的方式被高估了。明确约定能解决任务层面的预期，解决不了「这个人愿不愿意在关键时刻帮我」的判断，后者仍然依赖长期的非正式接触。",
    author: "方屿",
    createdAt: "2026-10-31 10:26",
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

export function getComments(topicId: string): Comment[] {
  return initialComments.filter((comment) => comment.topicId === topicId);
}
