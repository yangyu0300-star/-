-- ============================================================
-- 阶段 7 迁移脚本：赞踩计数（只记录，不排序、不隐藏、不打标签）
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query
--           粘贴全部内容 → Run
-- 注意：本脚本不删除任何已有评论
-- ============================================================

-- 1. 评论上的计数字段（由触发器维护，页面只读这两个字段）
alter table public.comments
  add column if not exists vote_up int not null default 0;

alter table public.comments
  add column if not exists vote_down int not null default 0;

-- 2. 投票表：同一条评论 + 同一个浏览器只能有一票
create table if not exists public.votes (
  id          uuid primary key default gen_random_uuid(),
  comment_id  uuid not null references public.comments(id) on delete cascade,
  voter_key   text not null check (char_length(voter_key) between 8 and 64),
  value       text not null check (value in ('up', 'down')),
  created_at  timestamptz not null default now(),
  unique (comment_id, voter_key)
);

create index if not exists votes_comment_idx
  on public.votes (comment_id);

-- 3. 触发器：任何投票变动后重算该评论的两个计数
create or replace function public.refresh_comment_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  cid := coalesce(new.comment_id, old.comment_id);

  update public.comments c
    set vote_up = (
          select count(*) from public.votes v
          where v.comment_id = cid and v.value = 'up'
        ),
        vote_down = (
          select count(*) from public.votes v
          where v.comment_id = cid and v.value = 'down'
        )
    where c.id = cid;

  return null;
end;
$$;

drop trigger if exists votes_refresh on public.votes;
create trigger votes_refresh
  after insert or update or delete on public.votes
  for each row execute function public.refresh_comment_votes();

-- 4. RLS：匿名可提交、可改自己那一票（改不了别人的，因为没有暴露投票 id）
alter table public.votes enable row level security;

drop policy if exists "votes insertable by anon" on public.votes;
create policy "votes insertable by anon"
  on public.votes for insert with check (true);

drop policy if exists "votes updateable by anon" on public.votes;
create policy "votes updateable by anon"
  on public.votes for update using (true) with check (true);

-- 不开放 select / delete：页面只读 comments 上的计数，票本身不可见
