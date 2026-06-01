-- Migration: 20260601000001_init_profiles.sql
-- Creates user profiles table linked to Supabase Auth

-- Enable moddatetime extension for updated_at triggers
create extension if not exists moddatetime schema extensions;

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  native_language text not null default 'en',
  target_language text not null default 'es',
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  avatar_url text,
  streak_days integer not null default 0,
  total_xp integer not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- updated_at trigger
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure extensions.moddatetime(updated_at);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
