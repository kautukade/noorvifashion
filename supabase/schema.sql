-- ─────────────────────────────────────────────────────────────
-- NOORVI FASHION — Journal (blog) schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- 1. Tables ──────────────────────────────────────────────────

create table if not exists public.blog_categories (
  id         text primary key,
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id                 text primary key,
  title              text not null,
  slug               text not null unique,
  excerpt            text default '',
  content            text default '',
  category           text not null,
  post_type          text not null default 'IMAGE'
                     check (post_type in ('IMAGE','VIDEO','IMAGE_GALLERY','TEXT','REEL')),
  featured_image_url text default '',
  video_url          text default '',
  video_poster_url   text default '',
  video_ratio        text default '16/9' check (video_ratio in ('16/9','9/16')),
  status             text not null default 'draft'
                     check (status in ('draft','published','hidden')),
  is_featured        boolean not null default false,
  views              integer not null default 0,
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.blog_media (
  id            text primary key default gen_random_uuid()::text,
  post_id       text not null references public.blog_posts(id) on delete cascade,
  media_type    text not null default 'image',
  media_url     text not null,
  thumbnail_url text,
  alt_text      text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts (status, published_at desc);
create index if not exists blog_media_post_idx on public.blog_media (post_id, sort_order);

-- 2. Row Level Security ──────────────────────────────────────
-- Visitors can only READ published posts; only signed-in users
-- (the store owner, via Supabase Auth) can write.

alter table public.blog_categories enable row level security;
alter table public.blog_posts      enable row level security;
alter table public.blog_media      enable row level security;

drop policy if exists "categories read all"    on public.blog_categories;
drop policy if exists "categories write auth"  on public.blog_categories;
drop policy if exists "posts read published"   on public.blog_posts;
drop policy if exists "posts read own auth"    on public.blog_posts;
drop policy if exists "posts write auth"       on public.blog_posts;
drop policy if exists "media read published"   on public.blog_media;
drop policy if exists "media write auth"       on public.blog_media;

create policy "categories read all"   on public.blog_categories for select using (true);
create policy "categories write auth" on public.blog_categories for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "posts read published" on public.blog_posts for select
  using (status = 'published' or auth.role() = 'authenticated');
create policy "posts write auth" on public.blog_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "media read published" on public.blog_media for select
  using (exists (select 1 from public.blog_posts p where p.id = blog_media.post_id and (p.status = 'published' or auth.role() = 'authenticated')));
create policy "media write auth" on public.blog_media for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 3. Storage buckets ─────────────────────────────────────────
-- Public read (so <img>/<video> tags work), authenticated write.

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('blog-videos', 'blog-videos', true)
on conflict (id) do nothing;

drop policy if exists "blog-images public read" on storage.objects;
drop policy if exists "blog-images auth write"  on storage.objects;
drop policy if exists "blog-videos public read" on storage.objects;
drop policy if exists "blog-videos auth write"  on storage.objects;

create policy "blog-images public read" on storage.objects for select
  using (bucket_id = 'blog-images');
create policy "blog-images auth write" on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "blog-videos public read" on storage.objects for select
  using (bucket_id = 'blog-videos');
create policy "blog-videos auth write" on storage.objects for insert
  with check (bucket_id = 'blog-videos' and auth.role() = 'authenticated');

-- 4. Create the owner login ──────────────────────────────────
-- In Supabase Dashboard → Authentication → Users → Add user,
-- create the store owner's email + password. That login unlocks
-- the Blog / Stories manager in /admin (the hardcoded demo
-- password is ignored entirely once Supabase keys are added).
