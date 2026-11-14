import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { database } from "../../database/database";
import { categoriesTable } from "../../database/schema/tables/categoriesTable";
import { validateBody } from "../../shared/http/validateBody";
import { validatePathParams } from "../../shared/http/validatePathParams";
import { recordIdPathParamSchema } from "../../shared/schemas/recordIdPathParamSchema";
import { categoryInsertSchema, categoryUpdateSchema } from "./categorySchema";

const routes = new Hono();

routes.get("/", async (c) => {
  const categories = await database.query.categories.findMany();

  return c.json(categories);
});

routes.post("/", validateBody(categoryInsertSchema), async (c) => {
  const body = c.get("validBody");
  const category = await database
    .insert(categoriesTable)
    .values(body)
    .returning();

  return c.json(category);
});

routes.patch(
  "/:id",
  validateBody(categoryUpdateSchema),
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");
    const data = c.get("validBody");

    const category = await database
      .update(categoriesTable)
      .set(data)
      .where(eq(categoriesTable.id, id))
      .returning();

    return c.json(category);
  },
);

routes.delete(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");

    const category = await database
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();

    return c.json(category);
  },
);

export default routes;
