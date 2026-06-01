-- Migration: 20260601000002_conversations.sql
-- AI conversation sessions and messages

-- Conversations table (one session = one conversation topic)
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  language text not null,
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Messages table (individual messages in a conversation)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  audio_url text,
  created_at timestamptz default now() not null
);

-- RLS for conversations
alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own conversations"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- RLS for messages
alter table public.messages enable row level security;

create policy "Users can view messages in own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and c.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in own conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and c.user_id = auth.uid()
    )
  );

-- Indexes
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_messages_conversation_id on public.messages(conversation_id);

-- updated_at trigger for conversations
create trigger handle_updated_at before update on public.conversations
  for each row execute procedure extensions.moddatetime(updated_at);
