alter table tomato_disease_info
add column upload_uuid uuid not null references upload (upload_uuid)