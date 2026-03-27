create table if not exists users (
  id         uuid        primary key default gen_random_uuid(),
  auth_id    uuid        not null unique,
  name       varchar(255) not null default '',
  lastname   varchar(255) not null default '',
  email      varchar(255) not null,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now(),
  deleted_at timestamptz
);
