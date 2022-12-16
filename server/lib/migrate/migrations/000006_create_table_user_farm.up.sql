CREATE TYPE "user_farm_role" AS ENUM ('owner', 'employee');

create table user_farm (
    user_farm_uuid uuid primary key default uuid_generate_v4(),
    user_uuid uuid not null references users(user_uuid),
    farm_uuid uuid not null references farm(farm_uuid),
    user_farm_role user_farm_role not null,
    is_active boolean not null default true,
    created_at timestamp with time zone not null default now()
)