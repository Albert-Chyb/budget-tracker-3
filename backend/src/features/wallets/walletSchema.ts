import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import z from "zod";
import { walletsTable } from "../../database/schema/tables/walletsTable";

const refinements = {
  name: (schema: z.ZodString) => schema.trim().min(1),
  balance: (schema: z.ZodNumber) => schema.min(0),
};

export const walletInsertSchema = createInsertSchema(walletsTable, refinements);

export type WalletInsert = z.infer<typeof walletInsertSchema>;

export const walletUpdateSchema = createUpdateSchema(
  walletsTable,
  refinements,
).omit({ balance: true });

export type WalletUpdate = z.infer<typeof walletUpdateSchema>;
