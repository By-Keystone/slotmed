create table if not exists doctors (
  id                    uuid         primary key default gen_random_uuid(),
  clinic_id             uuid         not null references clinics(id),
  name                  varchar(255) not null,
  specialty             varchar(255),
  email                 varchar(255),
  phone                 varchar(50),
  slot_duration_minutes int          not null,
  active                boolean      not null default true,
  created_at            timestamptz  not null default now(),
  updated_at            timestamptz  not null default now(),
  deleted_at            timestamptz
);

create table if not exists doctor_schedules (
  id         uuid        primary key default gen_random_uuid(),
  doctor_id  uuid        not null references doctors(id),
  day_of_week int        not null,
  start_time varchar(5)  not null,
  end_time   varchar(5)  not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
