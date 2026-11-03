"use client";

import { useState } from "react";
import ReplyForm from "./ReplyForm";
import { OPENING_PHRASE, REFUTE_LABEL } from "@/lib/types";
import type { Comment, RefuteType } from "@/lib/types";

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function TopicDetail({
  topicId,
  initialComments,
}: {
  topicId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const tail = comments.length > 0 ? comments[comments.length - 1] : null;

  function handleReply(payload: {
    refuteType: RefuteType;
    reason: string;
    targetQuote?: string;
  }) {
    const comment: Comment = {
      id: `local-${Date.now()}`,
      topicId,
      parentId: tail ? tail.id : null,
      refuteType: payload.refuteType,
      targetQuote: payload.targetQuote,
      reason: payload.reason,
      author: "你",
      createdAt: nowStamp(),
    };
    setComments((prev) => [...prev, comment]);
  }

  return (
    <>
      <div className="section-head">
        <h2>评论链</h2>
        <span>共 {comments.length} 环 · 由上到下依次接力</span>
      </div>

      <div className="chain">
        {comments.map((comment, index) => (
          <article
            key={comment.id}
            className="comment"
            data-type={comment.refuteType}
          >
            <div className="comment-head">
              <span className="author">{comment.author}</span>
              <span className={`badge badge-${comment.refuteType}`}>
                {REFUTE_LABEL[comment.refuteType]}
              </span>
              <span>第 {index + 1} 环</span>
              <span>{comment.createdAt}</span>
            </div>

            {comment.refuteType === "partial" && comment.targetQuote && (
              <p className="quote">{comment.targetQuote}</p>
            )}

            <p className="comment-text">
              <span className="opening">{OPENING_PHRASE[comment.refuteType]}</span>
              {comment.reason}
            </p>
          </article>
        ))}
      </div>

      <ReplyForm tail={tail} onSubmit={handleReply} />
    </>
  );
 }

