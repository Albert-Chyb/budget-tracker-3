grant connect on database postgres to server_app;

grant usage on schema public to server_app;

grant insert, select, update, delete on all tables in schema public to server_app;

grant usage, select on all sequences in schema public to server_app;

alter default privileges in schema public
    grant insert, select, update, delete on tables to server_app;

alter default privileges in schema public
    grant usage, select on sequences to server_app;
