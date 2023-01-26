-- CREATE TYPE "user_provider_type" AS ENUM ('oauth2');

create table user_provider (
    user_provider_uuid uuid primary key default uuid_generate_v4(),
    user_uuid uuid not null references "user"(user_uuid),
    email varchar(100) unique,
    password varchar(255) ,
    type user_provider_type not null, 
    created_at timestamp with time zone not null default now()
)