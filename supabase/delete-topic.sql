-- ============================================================
-- 删除话题 · 数据库迁移
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query
--           粘贴全部内容 → Run
-- 规则：只有发起人（浏览器本地保存的 owner_key）能删除自己的话题
-- ============================================================

-- 1. 话题上记录发起凭证（旧话题为 null，任何浏览器都删不掉）
alter table public.topics
  add column if not exists owner_key text;

-- 2. 删除函数：凭证匹配才真正删除（评论通过 on delete cascade 一并清掉）
create or replace function public.delete_topic(p_id text, p_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_key is null or char_length(p_key) < 8 then
    return false;
  end if;

  delete from public.topics t
   where t.id = p_id
     and t.owner_key = p_key;

  return found;
end;
$$;

-- 3. 允许匿名调用这个函数，但不允许直接 delete 表（表级 RLS 没开 delete 策略）
revoke all on function public.delete_topic(text, text) from public;
grant execute on function public.delete_topic(text, text) to anon, authenticated;
