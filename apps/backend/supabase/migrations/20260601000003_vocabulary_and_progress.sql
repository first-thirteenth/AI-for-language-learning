-- Migration: 20260601000003_vocabulary_and_progress.sql
-- User saved vocabulary and learning progress

-- Vocabulary table (words saved by user)
create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  word text not null,
  translation text not null,
  language text not null,
  context text,
  times_reviewed integer not null default 0,
  mastered boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, word, language)
);

-- Lessons table (content units)
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  language text not null,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  type text not null check (type in ('vocabulary', 'grammar', 'conversation', 'pronunciation')),
  content jsonb not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz default now() not null
);

-- User progress per lesson
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean not null default false,
  score integer check (score >= 0 and score <= 100),
  xp_earned integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, lesson_id)
);

-- RLS for vocabulary
alter table public.vocabulary enable row level security;

create policy "Users can manage own vocabulary"
  on public.vocabulary for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS for lessons (public read — everyone can see lessons)
alter table public.lessons enable row level security;

create policy "Lessons are publicly readable"
  on public.lessons for select
  using (true);

-- RLS for user_progress
alter table public.user_progress enable row level security;

create policy "Users can manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index idx_vocabulary_user_id on public.vocabulary(user_id);
create index idx_vocabulary_language on public.vocabulary(user_id, language);
create index idx_lessons_language_level on public.lessons(language, level);
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_lesson_id on public.user_progress(lesson_id);

-- updated_at triggers
create trigger handle_updated_at before update on public.vocabulary
  for each row execute procedure extensions.moddatetime(updated_at);

create trigger handle_updated_at before update on public.user_progress
  for each row execute procedure extensions.moddatetime(updated_at);
