-- ============================================================
-- 防刷：同一浏览器不能连续接龙（链尾是自己发的就不能再发）
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query → 粘贴全部 → Run
-- 说明：历史评论该列为 NULL，服务端只对「已知作者」的链尾做拦截
-- ============================================================

alter table public.comments
  add column if not exists author_key text;

-- 允许历史数据为 NULL，新数据由服务端校验长度（8–64）
alter table public.comments
  drop constraint if exists comments_author_key_len;

alter table public.comments
  add constraint comments_author_key_len
  check (author_key is null or char_length(author_key) between 8 and 64);

create index if not exists comments_author_key_idx
  on public.comments (author_key);
