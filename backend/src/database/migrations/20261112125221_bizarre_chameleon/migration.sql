revoke all on wallets from server_app;
grant select, insert, delete on wallets to server_app;
grant update (id, name, created_at) on wallets to server_app;

create role wallet_balance_owner nologin noinherit;
grant select, update(balance) on wallets to wallet_balance_owner;

create or replace function update_wallet_balance_on_transaction_change()
returns trigger
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
    v_wallet_id bigint;
    v_constraint text;
begin

    if (TG_OP = 'INSERT') then
        v_wallet_id := new.wallet_id;

        update public.wallets w
        set balance = balance + new.amount
        where w.id = v_wallet_id;

        return new;
    elsif (TG_OP = 'UPDATE') then
        if (old.amount = new.amount and old.wallet_id = new.wallet_id) then
            return new;
        end if;

        perform 1
        from public.wallets
        where id in (old.wallet_id, new.wallet_id)
        for update;

        v_wallet_id := old.wallet_id;

        update public.wallets w
        set balance = balance - old.amount
        where w.id = v_wallet_id;

        v_wallet_id := new.wallet_id;

        update public.wallets w
        set balance = balance + new.amount
        where w.id = v_wallet_id;

        return new;
    elsif (TG_OP = 'DELETE') then
        v_wallet_id := old.wallet_id;

        update public.wallets w
        set balance = balance - old.amount
        where w.id = v_wallet_id;

        return old;
    end if;

exception
    when check_violation then
        get stacked diagnostics
            v_constraint = CONSTRAINT_NAME;

        if v_constraint = 'wallets_balance_nonnegative' then
            raise exception using
                errcode  = 'W0001',
                message = format('Insufficient balance in wallet %s', v_wallet_id),
                detail = format('wallet_id=%s', v_wallet_id);
        end if;

        raise;
end;
$$ language plpgsql;

alter function update_wallet_balance_on_transaction_change()
owner to wallet_balance_owner;

create trigger update_wallet_balance_on_transaction_change
after insert or update or delete on transactions
for each row execute function update_wallet_balance_on_transaction_change();
