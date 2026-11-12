import { defineRelations } from "drizzle-orm";
import { categoriesTable } from "./schema/tables/categoriesTable";
import { transactionsTable } from "./schema/tables/transactionsTable";
import { walletsTable } from "./schema/tables/walletsTable";

const tables = {
  categories: categoriesTable,
  transactions: transactionsTable,
  wallets: walletsTable,
};

export const relations = defineRelations(tables, (r) => ({
  transactions: {
    wallet: r.one.wallets({
      from: r.transactions.walletId,
      to: r.wallets.id,
    }),

    category: r.one.categories({
      from: r.transactions.categoryId,
      to: r.categories.id,
    }),
  },
}));
