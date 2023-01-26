create table farm_plot (
    farm_plot_uuid uuid primary key default uuid_generate_v4(),
    farm_uuid uuid not null references farm(farm_uuid),
    farm_plot_name varchar(50) not null,
    farm_plot_location jsonb,
    is_active boolean default true,
    created_at timestamp with time zone not null default now()
);

create index user_farm_plot_uuid_farm_uuid_unq_key on farm_plot(farm_uuid, farm_plot_name);