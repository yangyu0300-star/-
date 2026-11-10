-- ============================================================
-- 阶段 8 安全加固：用 SECURITY DEFINER RPC 接管 votes 写入
-- 使用方法：Supabase 控制台 → SQL Editor → 粘贴全部 → Run
-- 效果：anon 无法直接读写 votes 表，所有投票必须走 RPC
-- ============================================================

-- 1. 先保留 read（comments 的 vote_up/vote_down 列是 trigger 维护的，不需要 votes 表 select）
--    所以我们直接撤销 anon 对 votes 的所有权限

drop policy if exists "votes readable by anon"  on public.votes;
drop policy if exists "votes insertable by anon" on public.votes;
drop policy if exists "votes updateable by anon" on public.votes;
drop policy if exists "votes deleteable by anon" on public.votes;

-- 2. RPC：投票 upsert（安全定义者，不受 RLS 限制）
--    同 comment + voter_key 唯一；重复投票会改写 value
create or replace function public.cast_vote(
  p_comment_id uuid,
  p_voter_key  text,
  p_value      text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 服务端二次校验（RLS 之外的双保险）
  if p_value not in ('up', 'down') then
    raise exception 'vote value must be up or down';
  end if;
  if char_length(p_voter_key) < 8 or char_length(p_voter_key) > 64 then
    raise exception 'voter_key length invalid';
  end if;

  insert into public.votes (comment_id, voter_key, value)
    values (p_comment_id, p_voter_key, p_value)
    on conflict (comment_id, voter_key)
    do update set value = excluded.value;
end;
$$;

-- 3. RPC：撤回投票（可选，给未来扩展留口子）
create or replace function public.revoke_vote(
  p_comment_id uuid,
  p_voter_key  text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(p_voter_key) < 8 or char_length(p_voter_key) > 64 then
    raise exception 'voter_key length invalid';
  end if;

  delete from public.votes
    where comment_id = p_comment_id and voter_key = p_voter_key;
end;
$$;

-- 4. 同样的模式：comments 和 topics 的 insert 也改成 RPC 吗？
--    目前 topics/comments 写入还是 with check (true)，但有长度校验 + 单链约束
--    这俩暂时先不动，优先堵 votes 这个最直接能被刷的口子
