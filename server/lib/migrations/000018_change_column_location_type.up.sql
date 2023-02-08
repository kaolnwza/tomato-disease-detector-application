alter table tomato_log
drop column "location";

alter table tomato_log
add column "location" geometry;