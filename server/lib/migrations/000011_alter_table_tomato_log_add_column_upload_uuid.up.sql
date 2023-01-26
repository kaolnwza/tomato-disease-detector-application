alter table tomato_log 
add column upload_uuid uuid not null references upload (upload_uuid)