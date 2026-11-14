import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import z from "zod";
import { categoriesTable } from "../../database/schema/tables/categoriesTable";

const refinments = {
  name: (schema: z.ZodString) => schema.trim().min(1),
};

export const categorySchema = createSelectSchema(categoriesTable, refinments);

export type Category = z.infer<typeof categorySchema>;

export const categoryInsertSchema = createInsertSchema(
  categoriesTable,
  refinments,
);

export type CategoryInsert = z.infer<typeof categoryInsertSchema>;

export const categoryUpdateSchema = createUpdateSchema(
  categoriesTable,
  refinments,
);

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
