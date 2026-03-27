create table if not exists appointments (
  id               uuid         primary key default gen_random_uuid(),
  doctor_id        uuid         not null references doctors(id),
  clinic_id        uuid         not null references clinics(id),
  patient_name     varchar(255) not null,
  patient_phone    varchar(50)  not null,
  appointment_date timestamptz  not null,
  start_time       varchar(10)  not null,
  end_time         varchar(10)  not null,
  status           varchar(50)  not null,
  notes            varchar(100),
  cancelled_at     timestamptz,
  scheduled_at     timestamptz  not null,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now(),
  deleted_at       timestamptz
);
