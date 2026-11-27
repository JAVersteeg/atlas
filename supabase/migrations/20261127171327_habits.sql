-- Habits and their daily check-ins. A check-in row means "done that day"; no row means not done.
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  position integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.habit_checkins (
  habit_id uuid not null references public.habits (id) on delete cascade,
  day date not null,
  created_at timestamptz not null default now(),
  primary key (habit_id, day)
);

-- The list screen reads the recent days of every habit.
create index habit_checkins_day_idx on public.habit_checkins (day);

-- Single user, reachable only over Tailscale: the anon role gets full access.
alter table public.habits enable row level security;
alter table public.habit_checkins enable row level security;

create policy habits_anon_all on public.habits
  for all to anon using (true) with check (true);
create policy habit_checkins_anon_all on public.habit_checkins
  for all to anon using (true) with check (true);
