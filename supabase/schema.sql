-- Run this in Supabase SQL Editor.
create table if not exists public.journal_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  mood smallint check (mood between 1 and 5),
  text text not null default '',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_date)
);

alter table public.journal_entries enable row level security;

create policy "Users can read their own journal"
on public.journal_entries for select
using (auth.uid() = user_id);

create policy "Users can insert their own journal"
on public.journal_entries for insert
with check (auth.uid() = user_id);

create policy "Users can update their own journal"
on public.journal_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own journal"
on public.journal_entries for delete
using (auth.uid() = user_id);
