-- ============================================================
-- 阶段 9：AI 敏感内容筛查（只提示、不拦截，chain 不中断）
-- 使用方法：Supabase → SQL Editor → New query → 粘贴 → Run
-- ============================================================

-- 1. 筛查结果表：只存快照（三态 + 模型名），不存原文风险词
create table if not exists public.moderations (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null check (entity_type in ('topic', 'comment')),
  entity_id    uuid not null,
  status       text not null check (status in ('passed', 'flagged', 'error')),
  model        text not null,
  reason       text,                              -- AI 简述原因，nullable
  created_at   timestamptz not null default now(),
  unique (entity_type, entity_id)
);

-- 唯一索引 + 反向查询索引
create index if not exists moderations_entity_idx
  on public.moderations (entity_type, entity_id);

-- 2. RLS：所有人可读（页面要显示警告），只允许服务端插入（AI 是后台行为）
alter table public.moderations enable row level security;

drop policy if exists "moderations readable by anon" on public.moderations;
create policy "moderations readable by anon"
  on public.moderations for select using (true);

-- insert 不开放给匿名前端——AI 由服务端 rpc / 后台写入
