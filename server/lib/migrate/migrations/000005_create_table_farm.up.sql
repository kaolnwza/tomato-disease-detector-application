create table farm (
    farm_uuid uuid primary key default uuid_generate_v4(),
    farm_name varchar(50) not null,
    farm_location jsonb,
    is_active boolean default true,
    created_at timestamp with time zone not null default now()
)