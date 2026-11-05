-- ============================================================
-- 阶段 6 迁移脚本：违规保护（软隐藏 + 举报）
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query
--           粘贴全部内容 → Run
-- 注意：本脚本只加字段和表，不会删除任何已有评论
-- ============================================================

-- 1. 评论软隐藏状态：removed 时前端渲染占位块，链结构保留
alter table public.comments
  add column if not exists status text not null default 'visible';

alter table public.comments
  drop constraint if exists comment_status_valid;

alter table public.comments
  add constraint comment_status_valid
  check (status in ('visible', 'removed'));

-- 2. 举报记录表
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  comment_id  uuid not null references public.comments(id) on delete cascade,
  reason      text not null check (char_length(reason) between 1 and 200),
  created_at  timestamptz not null default now()
);

create index if not exists reports_comment_idx
  on public.reports (comment_id, created_at desc);

-- 3. RLS：匿名只能提交举报，不能读取举报列表
alter table public.reports enable row level security;

drop policy if exists "reports insertable by anon" on public.reports;
create policy "reports insertable by anon"
  on public.reports for insert with check (true);

-- ============================================================
-- 管理员操作备忘（不在本脚本中执行，需要时手动跑）
-- 查看举报：
--   select r.created_at, r.reason, c.author_name, c.reason as comment_reason
--   from public.reports r join public.comments c on c.id = r.comment_id
--   order by r.created_at desc;
-- 隐藏某条违规评论：
--   update public.comments set status = 'removed' where id = '<评论 id>';
-- 恢复：
--   update public.comments set status = 'visible' where id = '<评论 id>';
-- ============================================================
