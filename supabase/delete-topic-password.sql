-- ============================================================
-- 话题删除：密码模式（与 owner_key 并存，两种方式任一成立即可删）
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query
--           粘贴全部内容 → Run
-- 依赖：pgcrypto 扩展（Supabase 默认已启用）
-- ============================================================

-- 1. 若还没装 pgcrypto（Supabase 默认有）
create extension if not exists pgcrypto;

-- 2. 加密码哈希字段（与 owner_key 并存，二选一成立即可删）
alter table public.topics
  add column if not exists delete_password_hash text;

-- 3. 重新定义删除函数：现在支持两种调用方式
--    delete_topic(id, owner_key)        —— 浏览器凭证模式（owner_key 匹配才删）
--    delete_topic(id, delete_password) —— 密码模式（密码对得上才删）
-- 第二个参数必须以 'pwd:' 开头，走密码哈希比对；否则按 owner_key 处理
create or replace function public.delete_topic(p_id text, p_secret text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_topic public.topics%rowtype;
  v_matched boolean := false;
begin
  if p_secret is null or char_length(p_secret) = 0 then
    return false;
  end if;

  select * into v_topic from public.topics where id = p_id;
  if not found then
    return false;
  end if;

  -- 密码模式：调用方传 'pwd:xxxxxx'
  if starts_with(p_secret, 'pwd:') then
    declare
      v_pwd text := substring(p_secret from 5);
    begin
      if v_topic.delete_password_hash is not null
         and v_pwd is not null
         and char_length(v_pwd) >= 1 then
        -- crypt 比对：返回值以原始 bcrypt salt 为前缀，match 时忽略 cost
        v_matched := v_topic.delete_password_hash = crypt(v_pwd, v_topic.delete_password_hash);
      end if;
    end;
  else
    -- owner_key 模式（原行为）
    v_matched := v_topic.owner_key is not null
                 and v_topic.owner_key = p_secret;
  end if;

  if v_matched then
    delete from public.topics t where t.id = p_id;
    return true;
  end if;

  return false;
end;
$$;

-- 4. 允许匿名调用（已经在前一次迁移里 grant 过，这里兜底一下）
revoke all on function public.delete_topic(text, text) from public;
grant execute on function public.delete_topic(text, text) to anon, authenticated;

-- 5. 保存密码时的辅助函数（调用方传明文，内部生成 bcrypt 哈希）
create or replace function public.hash_delete_password(p_pwd text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_pwd is null or char_length(p_pwd) < 6 or char_length(p_pwd) > 40 then
    return null;
  end if;
  return crypt(p_pwd, gen_salt('bf', 10));
end;
$$;

revoke all on function public.hash_delete_password(text) from public;
grant execute on function public.hash_delete_password(text) to anon, authenticated;
