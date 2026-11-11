import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import { categoriesTable } from "./categoriesTable";
import { walletsTable } from "./walletsTable";

export const transactionsTable = p.snakeCase.table(
  "transactions",
  {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    date: p.timestamp({ withTimezone: true }).defaultNow().notNull(),
    walletId: p
      .integer()
      .notNull()
      .references(() => walletsTable.id),
    categoryId: p
      .integer()
      .notNull()
      .references(() => categoriesTable.id),
    amount: p.integer().notNull(),
  },
  (t) => [p.check("transactions_amount_neq_zero", sql`${t.amount} <> 0`)],
);
