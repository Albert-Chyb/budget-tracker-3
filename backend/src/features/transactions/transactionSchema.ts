import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import z from "zod";
import { transactionsTable } from "../../database/schema/tables/transactionsTable";
import { categorySchema } from "../categories/categorySchema";
import { walletSchema } from "../wallets/walletSchema";

const refinments = {
  amount: (schema: z.ZodNumber) =>
    schema.refine((value) => value !== 0, {
      error: "Transaction amount cannot equal 0.",
    }),
};

export const transactionSchema = createSelectSchema(
  transactionsTable,
  refinments,
)
  .omit({
    categoryId: true,
    walletId: true,
  })
  .extend({
    wallet: walletSchema,
    category: categorySchema,
  });

export type Transaction = z.infer<typeof transactionSchema>;

export const transactionInsertSchema = createInsertSchema(
  transactionsTable,
  refinments,
);

export type TransactionInsert = z.infer<typeof transactionInsertSchema>;

export const transactionUpdateSchema = createUpdateSchema(
  transactionsTable,
  refinments,
);

export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;
