-- Study entries
create table study_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  subject text not null,
  hours numeric(5,2) not null,
  notes text default '',
  created_at timestamptz default now()
);

-- Todos
create table todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean default false,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamptz default now()
);

-- Calendar events
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  start_time text not null,
  end_time text not null,
  color text default '#3b82f6',
  created_at timestamptz default now()
);

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  current numeric not null default 0,
  target numeric not null,
  unit text default '',
  deadline date,
  created_at timestamptz default now()
);

-- News items
create table news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  source text not null,
  url text default '',
  fetched_at timestamptz default now()
);

-- Enable Row Level Security (open for now, lock down later with auth)
alter table study_entries enable row level security;
alter table todos enable row level security;
alter table calendar_events enable row level security;
alter table goals enable row level security;
alter table news_items enable row level security;

-- Permissive policies (no auth yet)
create policy "Allow all" on study_entries for all using (true) with check (true);
create policy "Allow all" on todos for all using (true) with check (true);
create policy "Allow all" on calendar_events for all using (true) with check (true);
create policy "Allow all" on goals for all using (true) with check (true);
create policy "Allow all" on news_items for all using (true) with check (true);
