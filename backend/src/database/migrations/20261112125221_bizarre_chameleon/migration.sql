revoke all on wallets from server_app;
grant select, insert, delete on wallets to server_app;
grant update (id, name, created_at) on wallets to server_app;

create role wallet_balance_owner nologin noinherit;
grant select, update(balance) on wallets to wallet_balance_owner;

create or replace function update_wallet_balance_on_transaction_change()
returns trigger security definer set search_path = pg_catalog, pg_temp as $$
begin

    if (TG_OP = 'INSERT') then
        update public.wallets w set balance = balance + new.amount where w.id = new.wallet_id;
    elsif (TG_OP = 'UPDATE') then
        if (old.amount = new.amount and old.wallet_id = new.wallet_id) then
            return new;
        end if;

        update public.wallets w set balance = balance - old.amount where w.id = old.wallet_id;
        update public.wallets w set balance = balance + new.amount where w.id = new.wallet_id;
    elsif (TG_OP = 'DELETE') then
        update public.wallets w set balance = balance - old.amount where w.id = old.wallet_id;
    end if;

    return new;
end;
$$ language plpgsql;

alter function update_wallet_balance_on_transaction_change()
owner to wallet_balance_owner;

create trigger update_wallet_balance_on_transaction_change
after insert or update or delete on transactions
for each row execute function update_wallet_balance_on_transaction_change();
