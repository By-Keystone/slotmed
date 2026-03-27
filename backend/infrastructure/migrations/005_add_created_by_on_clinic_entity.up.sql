alter table clinics
  add column created_by uuid not null references users(id);
