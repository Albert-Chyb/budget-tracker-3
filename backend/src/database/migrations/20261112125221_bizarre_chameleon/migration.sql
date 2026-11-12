create or replace function update_wallet_balance_on_transaction_change() returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update wallets w set balance = balance + new.amount where w.id = new.wallet_id;
    elsif (TG_OP = 'UPDATE') then
        if (old.amount = new.amount and old.wallet_id = new.wallet_id) then
            return new;
        end if;

        update wallets w set balance = balance - old.amount where w.id = old.wallet_id;
        update wallets w set balance = balance + new.amount where w.id = new.wallet_id;
    elsif (TG_OP = 'DELETE') then
        update wallets w set balance = balance - old.amount where w.id = old.wallet_id;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger update_wallet_balance_on_transaction_change
after insert or update or delete on transactions
for each row execute function update_wallet_balance_on_transaction_change();
