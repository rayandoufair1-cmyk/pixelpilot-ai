-- PixelPilot AI — Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients table
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  company text,
  phone text,
  created_at timestamptz default now()
);

-- Projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  name text not null,
  status text not null default 'intake'
    check (status in ('intake','generating','review','approved','deploying','live')),
  tier text not null default 'starter'
    check (tier in ('starter','pro','enterprise')),
  intake_data jsonb not null default '{}',
  generated_code text,
  preview_url text,
  live_url text,
  stripe_payment_intent_id text,
  stripe_session_id text,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table (AI chat)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Leads table (marketing contact form)
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  message text,
  source text default 'website',
  converted_at timestamptz,
  created_at timestamptz default now()
);

-- Row Level Security
alter table clients enable row level security;
alter table projects enable row level security;
alter table messages enable row level security;
alter table leads enable row level security;

-- Clients: users can only see their own record
create policy "clients_own" on clients
  for all using (auth.uid() = user_id);

-- Projects: clients can see their own projects
create policy "projects_own" on projects
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

-- Messages: clients can see messages for their projects
create policy "messages_own" on messages
  for all using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.user_id = auth.uid()
    )
  );

-- Service role bypasses RLS (for API routes using service key)

-- Trigger: auto-update updated_at on projects
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

-- Indexes
create index projects_client_id_idx on projects(client_id);
create index messages_project_id_idx on messages(project_id);
create index projects_status_idx on projects(status);
