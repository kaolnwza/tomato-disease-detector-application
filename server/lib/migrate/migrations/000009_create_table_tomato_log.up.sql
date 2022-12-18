create table tomato_log (
    tomato_log_uuid uuid primary key default uuid_generate_v4(),
    farm_plot_uuid uuid not null references farm_plot(farm_plot_uuid),
    recorder_uuid uuid not null references "user"(user_uuid),
    tomato_disease_uuid uuid not null references tomato_disease_info(disease_uuid),
    "description" text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
)