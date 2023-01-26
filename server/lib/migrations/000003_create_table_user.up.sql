create table "user" (
    user_uuid uuid primary key default uuid_generate_v4(),
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    profile_picture varchar(255)
    created_at timestamp with time zone not null default now()
)