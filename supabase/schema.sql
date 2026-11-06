-- ============================================================
-- 驳学者 · 第 5 阶段建表脚本
-- 使用方法：Supabase 控制台 → 左侧 SQL Editor → 新建 query
--           粘贴全部内容 → Run
-- ============================================================

-- 1. 话题表
create table if not exists public.topics (
  id           text primary key,
  title        text not null,
  summary      text not null,
  body         text not null,
  created_at   timestamptz not null default now()
);

-- 2. 评论表（单链：同话题下同 parent_id 唯一）
create table if not exists public.comments (
  id                uuid primary key default gen_random_uuid(),
  topic_id          text not null references public.topics(id) on delete cascade,
  parent_id         uuid,                              -- 指向同话题上一条评论；首条评论为 null
  refute_type       text not null check (refute_type in ('full', 'partial')),
  target_quote      text,                              -- 仅部分反驳必填
  reason            text not null,
  author_name       text not null,
  created_at        timestamptz not null default now(),

  -- 业务规则：理由 20–2000，部分反驳时引用必填
  constraint reason_length check (char_length(reason) between 20 and 2000),
  constraint partial_quote_required check (
    (refute_type = 'full'     and target_quote is null)
    or
    (refute_type = 'partial'  and target_quote is not null and char_length(target_quote) between 1 and 200)
  ),

  -- 同话题下每条评论 parent_id 唯一 → 保证单链不分叉
  unique (topic_id, parent_id)
);

create index if not exists comments_topic_created_idx
  on public.comments (topic_id, created_at);

-- 3. 开启 RLS（我们在下面显式定义策略）
alter table public.topics   enable row level security;
alter table public.comments enable row level security;

-- 4. RLS 策略（阶段 5 只接数据库不接登录，允许匿名读写；以后升级再收紧）
drop policy if exists "topics readable by anon" on public.topics;
create policy "topics readable by anon"
  on public.topics for select using (true);

drop policy if exists "topics insertable by anon" on public.topics;
create policy "topics insertable by anon"
  on public.topics for insert with check (true);

drop policy if exists "comments readable by anon" on public.comments;
create policy "comments readable by anon"
  on public.comments for select using (true);

drop policy if exists "comments insertable by anon" on public.comments;
create policy "comments insertable by anon"
  on public.comments for insert with check (true);

-- 5. 预置两条话题和几条假评论，让页面打开就能看到内容
insert into public.topics (id, title, summary, body, created_at) values
  ('traffic-before-quality',
   '「先有流量，再谈质量」这个说法站得住脚吗？',
   '一个常见的发展顺序假设：先把人聚起来，内容质量自然会跟上。',
   '很多社区在起步阶段都会选择先追求流量：放宽准入、降低门槛、用争议内容换曝光。支持者的理由是「没有流量就没有讨论，质量无从谈起」。\n\n但也有人认为顺序反过来才成立：早期用户的口味决定了社区的气质，一旦用低质量内容拉新，后面再想收紧就来不及了。\n\n请在下方评论链中接力反驳，注意：每条新评论只能针对紧邻的上一条评论。',
   '2026-10-28T00:00:00Z'),
  ('remote-trust',
   '远程办公一定会削弱团队信任吗？',
   '线下见面减少之后，信任是靠流程补足，还是必然流失？',
   '远程办公的支持者强调结果导向：只要交付稳定，坐在哪里并不重要。反对者则认为信任来自高频的、非正式的接触，视频会议替代不了这些。\n\n有意思的是，双方的争论经常混在一起：一边在谈协作效率，一边在谈人际关系。接力时请先说清楚你到底在反驳哪一层。',
   '2026-10-30T00:00:00Z')
on conflict (id) do nothing;

-- 先清掉旧数据（如果反复跑脚本）
delete from public.comments;

-- 为了能在 comments 表里互相引用，先拿到自动生成的 uuid
do $$
declare
  c1 uuid := gen_random_uuid();
  c2 uuid := gen_random_uuid();
  c3 uuid := gen_random_uuid();
  c4 uuid := gen_random_uuid();
  c5 uuid := gen_random_uuid();
  c6 uuid := gen_random_uuid();
begin
  insert into public.comments (id, topic_id, parent_id, refute_type, target_quote, reason, author_name, created_at) values
    (c1, 'traffic-before-quality', null, 'full', null,
     '流量本身不区分好坏，早期为了拉新而放宽的规则会成为默认预期。社区一旦用争议内容获客，之后的每一次收紧都会被当成背叛，成本远高于一开始就慢一点。',
     '林一', '2026-10-28T13:10:00Z'),

    (c2, 'traffic-before-quality', c1, 'partial',
     '之后的每一次收紧都会被当成背叛',
     '假设太绝对。规则收紧确实有阻力，但阻力大小取决于是否提前公示。如果社区从一开始就把规则写在显眼位置，收紧只是执行既有承诺，并不会被当成背叛。',
     '周衡', '2026-10-29T01:02:00Z'),

    (c3, 'traffic-before-quality', c2, 'full', null,
     '提前公示并不能解决执行层面的问题。真正决定阻力的是早期用户构成：靠争议内容吸引来的人群，本来就不是为了规则而来，公示对他们没有约束力。',
     '陈默', '2026-10-29T07:40:00Z'),

    (c4, 'traffic-before-quality', c3, 'partial',
     '本来就不是为了规则而来，公示对他们没有约束力',
     '前半句成立，后半句过头了。用户不为规则而来，不等于规则无效；真正起作用的是规则的执行一致性，而不是用户的初始动机。把动机当作唯一变量，会让结论无法被验证。',
     '许言', '2026-10-30T03:05:00Z'),

    (c5, 'remote-trust', null, 'full', null,
     '「一定」这个词就不成立。信任的来源是预测能力：能预期对方在什么情况下会怎么反应。远程办公削弱的是非正式互动，但可以用更明确的交付约定和更短的反馈周期补上，两者不是同一件事。',
     '何嘉', '2026-10-30T12:18:00Z'),

    (c6, 'remote-trust', c5, 'partial',
     '可以用更明确的交付约定和更短的反馈周期补上',
     '补上的部分我同意，但补上的方式被高估了。明确约定能解决任务层面的预期，解决不了「这个人愿不愿意在关键时刻帮我」的判断，后者仍然依赖长期的非正式接触。',
     '方屿', '2026-10-31T02:26:00Z');
end $$;