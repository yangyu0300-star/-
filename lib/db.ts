import { supabase } from "./supabase";
import type { Comment, Topic } from "./types";

export interface TopicRow {
  id: string;
  title: string;
  summary: string;
  body: string;
  created_at: string;
}

export interface CommentRow {
  id: string;
  topic_id: string;
  parent_id: string | null;
  refute_type: "full" | "partial";
  target_quote: string | null;
  reason: string;
  author_name: string;
  created_at: string;
  status: "visible" | "removed" | null;
}

export interface TopicWithStats {
  topic: Topic;
  commentCount: number;
  lastActivity: string | null;
}

export async function getTopics(): Promise<TopicWithStats[]> {
  const { data: topicsData, error: tErr } = await supabase
    .from("topics")
    .select("id, title, summary, body, created_at")
    .order("created_at", { ascending: false });
  if (tErr) throw tErr;

  const topicIds = (topicsData as TopicRow[]).map((t) => t.id);
  if (topicIds.length === 0) return [];

  const { data: commentsData, error: cErr } = await supabase
    .from("comments")
    .select("topic_id, created_at")
    .in("topic_id", topicIds);
  if (cErr) throw cErr;

  const stats = new Map<string, { count: number; latest: string | null }>();
  for (const row of (commentsData as { topic_id: string; created_at: string }[])) {
    const cur = stats.get(row.topic_id) ?? { count: 0, latest: null };
    cur.count += 1;
    if (!cur.latest || row.created_at > cur.latest) cur.latest = row.created_at;
    stats.set(row.topic_id, cur);
  }

  return (topicsData as TopicRow[]).map((row) => {
    const s = stats.get(row.id) ?? { count: 0, latest: null };
    return {
      topic: fromTopicRow(row),
      commentCount: s.count,
      lastActivity: s.latest ? formatDate(s.latest) : null,
    };
  });
}

export async function getTopic(id: string): Promise<Topic | undefined> {
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, summary, body, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromTopicRow(data) : undefined;
}

export async function getCommentsByTopic(topicId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, topic_id, parent_id, refute_type, target_quote, reason, author_name, created_at, status")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as CommentRow[]).map(fromCommentRow);
}

export function fromTopicRow(row: TopicRow): Topic {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body,
    createdAt: formatDate(row.created_at),
  };
}

export function fromCommentRow(row: CommentRow): Comment {
  return {
    id: row.id,
    topicId: row.topic_id,
    parentId: row.parent_id,
    refuteType: row.refute_type,
    targetQuote: row.target_quote ?? undefined,
    reason: row.reason,
    author: row.author_name,
    createdAt: formatDateTime(row.created_at),
    status: row.status ?? "visible",
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
