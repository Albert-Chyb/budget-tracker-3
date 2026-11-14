import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
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
  const [category] = await database
    .insert(categoriesTable)
    .values(body)
    .returning();

  if (category === undefined)
    throw new HTTPException(500, { message: "Database operation failed." });

  return c.json(category, 201);
});

routes.patch(
  "/:id",
  validateBody(categoryUpdateSchema),
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");
    const data = c.get("validBody");

    const [category] = await database
      .update(categoriesTable)
      .set(data)
      .where(eq(categoriesTable.id, id))
      .returning();

    if (!category)
      throw new HTTPException(404, {
        message: `Category with id of ${id} was not found.`,
      });

    return c.json(category);
  },
);

routes.delete(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");

    const [category] = await database
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();

    if (category === undefined) return c.body(null, 204);

    return c.json(category);
  },
);

export default routes;
