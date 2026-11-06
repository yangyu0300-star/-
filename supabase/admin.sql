-- ============================================================
-- 阶段 10 迁移脚本：举报处理后台
-- 使用方法：Supabase 控制台 → SQL Editor → 新建 query
--           1) 先把最后一段 insert 里的「你的管理员密码」替换成你自己想的密码
--              （建议 8 位以上，只用字母和数字，避免引号问题）
--           2) 粘贴全部内容 → Run
-- 说明：管理员密钥只以 md5 哈希存在数据库里，匿名用户读不到这张表
-- ============================================================

-- 1. 管理员密钥表（存哈希，不存明文）
create table if not exists public.admin_settings (
  id          int primary key,
  secret_hash text not null,
  updated_at  timestamptz not null default now()
);

-- 开启 RLS 且不建任何 policy：匿名用户完全读不到
alter table public.admin_settings enable row level security;

-- 2. 校验密钥
create or replace function public.admin_check(p_key text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_settings a
    where a.id = 1 and a.secret_hash = p_key
  );
$$;

-- 3. 列出待处理举报（密钥不对会抛 42501 forbidden）
create or replace function public.admin_list_reports(p_key text)
returns table (
  report_id         uuid,
  report_reason     text,
  reported_at       timestamptz,
  comment_id        uuid,
  comment_status    text,
  comment_author    text,
  comment_reason    text,
  refute_type       text,
  target_quote      text,
  comment_created_at timestamptz,
  topic_id          text,
  topic_title       text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_check(p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
    select r.id,
           r.reason,
           r.created_at,
           c.id,
           c.status,
           c.author_name,
           c.reason,
           c.refute_type,
           c.target_quote,
           c.created_at,
           t.id,
           t.title
      from public.reports r
      join public.comments c on c.id = r.comment_id
      join public.topics   t on t.id = c.topic_id
     order by r.created_at desc
     limit 200;
end;
$$;

-- 4. 隐藏 / 恢复某条评论（隐藏时顺带清掉它的举报）
create or replace function public.admin_set_comment_status(
  p_key text,
  p_comment_id uuid,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows int := 0;
begin
  if not public.admin_check(p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  if p_status not in ('visible', 'removed') then
    raise exception 'invalid status' using errcode = '22023';
  end if;

  update public.comments
     set status = p_status
   where id = p_comment_id;

  get diagnostics v_rows = row_count;

  if p_status = 'removed' then
    delete from public.reports where comment_id = p_comment_id;
  end if;

  return v_rows > 0;
end;
$$;

-- 5. 忽略举报（只删举报记录，不动评论）
create or replace function public.admin_delete_report(
  p_key text,
  p_report_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows int := 0;
begin
  if not public.admin_check(p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  delete from public.reports where id = p_report_id;

  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- 6. 权限：只给匿名用户执行这 4 个函数，表本身不暴露
revoke all on function public.admin_check(text) from public;
revoke all on function public.admin_list_reports(text) from public;
revoke all on function public.admin_set_comment_status(text, uuid, text) from public;
revoke all on function public.admin_delete_report(text, uuid) from public;

grant execute on function public.admin_check(text) to anon, authenticated;
grant execute on function public.admin_list_reports(text) to anon, authenticated;
grant execute on function public.admin_set_comment_status(text, uuid, text) to anon, authenticated;
grant execute on function public.admin_delete_report(text, uuid) to anon, authenticated;

-- ============================================================
-- 7. 设置管理员密码（把「你的管理员密码」替换掉再执行这一段）
--    重复执行会覆盖旧密码
--    注意：密码只能用字母、数字，不要用引号/反斜杠
-- ============================================================
insert into public.admin_settings (id, secret_hash, updated_at)
values (1, md5('boxuezhe-admin-v1:' || '你的管理员密码'), now())
on conflict (id) do update
  set secret_hash = excluded.secret_hash,
      updated_at  = excluded.updated_at;

-- 自检：返回 true 说明密码已写入
select public.admin_check(md5('boxuezhe-admin-v1:' || '你的管理员密码')) as secret_ok;
