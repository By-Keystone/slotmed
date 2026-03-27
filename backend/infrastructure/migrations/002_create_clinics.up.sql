create table if not exists clinics (
  id         uuid         primary key default gen_random_uuid(),
  name       varchar(255) not null,
  address    varchar(500),
  phone      varchar(50),
  email      varchar(255),
  active     boolean      not null default true,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now(),
  deleted_at timestamptz
);
