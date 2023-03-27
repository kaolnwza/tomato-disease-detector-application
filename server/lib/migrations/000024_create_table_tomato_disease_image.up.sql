create table tomato_disease_image (
    uuid uuid not null default uuid_generate_v4(),
    disease_uuid uuid not null references tomato_disease_info ("disease_uuid"),
    upload_uuid uuid not null references upload ("upload_uuid"),
    created_at timestamptz not null default now()
)