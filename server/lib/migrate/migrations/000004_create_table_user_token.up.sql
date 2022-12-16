create table user_token (
    user_token_uuid uuid primary key default uuid_generate_v4(),
    user_uuid uuid not null references users(user_uuid),
    email varchar(100) unique,
    password varchar(255) ,
    created_at timestamp with time zone not null default now()
)