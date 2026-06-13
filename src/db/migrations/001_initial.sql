-- Enable pgvector for intake and resource embeddings
create extension if not exists vector;

-- WARN filing references
create table cohorts (
  id        uuid primary key default gen_random_uuid(),
  employer  text not null,
  rif_date  date not null,
  source    text not null  -- URL or filing reference
);

create table members (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  contact             text not null,
  region              text,
  craft               text,
  cohort_id           uuid references cohorts(id),
  ladder_rung         text not null default 'arrived'
                        check (ladder_rung in (
                          'arrived','supported','in_a_pod',
                          'contributing','trained','facilitating','leading'
                        )),
  mattermost_user_id  text,
  created_at          timestamptz not null default now()
);

-- Organizer-only; intake data must never be publicly exposed
create table intakes (
  id               uuid primary key default gen_random_uuid(),
  member_id        uuid not null references members(id) on delete cascade,
  raw_conversation jsonb not null default '[]',
  extracted        jsonb not null default '{}',  -- {employer,role,timing,region,needs[],craft,offers[]}
  embedding        vector(1536),
  created_at       timestamptz not null default now()
);

create table pods (
  id                   uuid primary key default gen_random_uuid(),
  template             text not null check (template in ('support','study','build','interview','action')),
  facilitator_id       uuid references members(id),
  mattermost_channel_id text,
  ritual_cadence       text not null default 'weekly',
  status               text not null default 'pending'
                         check (status in ('pending','active','archived')),
  created_at           timestamptz not null default now()
);

create table pod_memberships (
  pod_id    uuid not null references pods(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  role      text not null default 'member' check (role in ('member','facilitator')),
  joined_at timestamptz not null default now(),
  primary key (pod_id, member_id)
);

create table sessions (
  id         uuid primary key default gen_random_uuid(),
  pod_id     uuid not null references pods(id) on delete cascade,
  datetime   timestamptz not null,
  jitsi_link text not null,
  summary    text,
  attendance uuid[] default '{}',
  created_at timestamptz not null default now()
);

-- Stub: no UI on Day 1; schema in place so September needs no rearchitecture
create table evidence_records (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  session_id    uuid references sessions(id),
  activity_type text not null,
  artifact_url  text,
  rubric_json   jsonb default '{}',
  reviewer_ids  uuid[] default '{}',
  created_at    timestamptz not null default now()
);

-- Stub: vouching opens September with quarterly budgets per member
create table vouches (
  id               uuid primary key default gen_random_uuid(),
  voucher_id       uuid not null references members(id),
  vouchee_id       uuid not null references members(id),
  claim_text       text not null,
  cohort_verified  boolean not null default false,
  status           text not null default 'active'
                     check (status in ('active','retracted','outcome_known')),
  created_at       timestamptz not null default now()
);

-- Knowledge layer corpus; bot reads this, never member messages
create table resources (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  body       text not null,
  category   text not null,
  embedding  vector(1536),
  created_at timestamptz not null default now()
);

create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  datetime      timestamptz not null,
  jitsi_link    text not null,
  training_path text,
  rsvps         uuid[] default '{}',
  created_at    timestamptz not null default now()
);

-- RLS: intake data visible to organizers only
alter table intakes enable row level security;
create policy "organizers only" on intakes
  using (auth.jwt() ->> 'role' = 'organizer');
