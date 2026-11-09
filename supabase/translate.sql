-- ============================================================
-- 翻译缓存表：同一条内容同一种语言只翻译一次
-- 使用方法：Supabase 控制台 → SQL Editor → 粘贴运行
-- ============================================================

create table if not exists public.translations (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null check (entity_type in ('topic', 'comment')),
  entity_id    text not null,
  lang         text not null check (char_length(lang) between 2 and 8),
  content      text not null,
  created_at   timestamptz not null default now(),
  unique (entity_type, entity_id, lang)
);

alter table public.translations enable row level security;

drop policy if exists "translations readable by anon" on public.translations;
create policy "translations readable by anon"
  on public.translations for select using (true);

drop policy if exists "translations insertable by anon" on public.translations;
create policy "translations insertable by anon"
  on public.translations for insert with check (true);

drop policy if exists "translations updateable by anon" on public.translations;
create policy "translations updateable by anon"
  on public.translations for update using (true) with check (true);
