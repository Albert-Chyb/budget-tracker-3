import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const categoriesTable = p.snakeCase.table(
  "categories",
  {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: p.text().notNull(),
    createdAt: p.timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [p.check("name_not_blank", sql`length(trim(${t.name})) > 0`)],
);
