import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const walletsTable = p.snakeCase.table(
  "wallets",
  {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: p.text().notNull(),
    createdAt: p.timestamp({ withTimezone: true }).defaultNow().notNull(),
    balance: p.integer().notNull(),
  },
  (t) => [
    p.check("wallet_name_not_blank", sql`length(trim(${t.name})) > 0`),
    p.check("wallet_balance_nonnegative", sql`${t.balance} >= 0`),
  ],
);
