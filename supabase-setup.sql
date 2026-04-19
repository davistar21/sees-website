-- ============================================================
-- SEES Website — Supabase Setup
-- Run this entire file in the Supabase SQL Editor once.
-- ============================================================

-- Events
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  image_url    text,
  location     text,
  event_time   text,
  event_date   text,
  category     text not null default 'Corporate events',
  is_featured     boolean not null default false,
  youtube_url     text,
  gallery_images  jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- Migration: add new columns to existing events table if upgrading
alter table events add column if not exists youtube_url    text;
alter table events add column if not exists gallery_images jsonb not null default '[]'::jsonb;

-- Team Members (website build team, grouped by category)
create table if not exists team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  description   text,
  image_url     text,
  portfolio     text not null default '#',
  category      text not null default 'Team',
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

alter table team_members enable row level security;
create policy if not exists "public read team_members"  on team_members for select using (true);
create policy if not exists "auth write team_members"   on team_members for all using (auth.role() = 'authenticated');

-- Executives
create table if not exists executives (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  description   text,
  image_url     text,
  portfolio     text not null default '#',
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- Resources
create table if not exists resources (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  type       text not null check (type in ('lesson_notes','youtube','tutorial','textbook')),
  url        text,
  level      int  check (level in (100,200,300,400,500)),
  created_at timestamptz not null default now()
);

-- Hero slides
create table if not exists hero_slides (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  title         text not null,
  subtitle      text,
  display_order int not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Announcements
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────

alter table events        enable row level security;
alter table executives    enable row level security;
alter table resources     enable row level security;
alter table hero_slides   enable row level security;
alter table announcements enable row level security;

-- Public can read everything
create policy "public read events"        on events        for select using (true);
create policy "public read executives"    on executives    for select using (true);
create policy "public read resources"     on resources     for select using (true);
create policy "public read hero_slides"   on hero_slides   for select using (true);
create policy "public read announcements" on announcements for select using (true);

-- Only signed-in admins can write
create policy "auth write events"        on events        for all using (auth.role() = 'authenticated');
create policy "auth write executives"    on executives    for all using (auth.role() = 'authenticated');
create policy "auth write resources"     on resources     for all using (auth.role() = 'authenticated');
create policy "auth write hero_slides"   on hero_slides   for all using (auth.role() = 'authenticated');
create policy "auth write announcements" on announcements for all using (auth.role() = 'authenticated');

-- ── Storage bucket ────────────────────────────────────────────
-- Run these separately in Storage → New bucket if the SQL editor
-- doesn't support storage commands in your plan:
--
--   Bucket name : images
--   Public      : true   (so images load without signed URLs)
--
-- Then add this policy so authenticated users can upload:

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "auth upload images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "auth update images"
  on storage.objects for update
  using (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "auth delete images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
