create table tomato_disease_info (
    disease_uuid uuid primary key default uuid_generate_v4(),
    disease_name varchar(50) not null,
    disease_cause text,
    disease_symptom text,
    disease_epidemic text,
    disease_resolve text
)