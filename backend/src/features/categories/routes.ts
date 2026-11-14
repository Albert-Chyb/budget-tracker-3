import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { database } from "../../database/database";
import { categoriesTable } from "../../database/schema/tables/categoriesTable";
import { recordIdPathParamSchema } from "../../shared/schemas/recordIdPathParamSchema";
import { categoryInsertSchema, categoryUpdateSchema } from "./categorySchema";

const routes = new Hono();

routes.get("/", async (c) => {
  const categories = await database.query.categories.findMany();

  return c.json(categories);
});

routes.post("/", async (c) => {
  const { data, error } = categoryInsertSchema.safeParse(await c.req.json());
  if (error) throw new HTTPException(403, { message: error.message });

  const category = await database
    .insert(categoriesTable)
    .values(data)
    .returning();

  return c.json(category);
});

routes.patch("/:id", async (c) => {
  const { data: id, error: idError } = recordIdPathParamSchema.safeParse(
    c.req.param("id"),
  );
  if (idError) throw new HTTPException(403, { message: idError.message });

  const { data, error } = categoryUpdateSchema.safeParse(await c.req.json());
  if (error) throw new HTTPException(403, { message: error.message });

  const category = await database
    .update(categoriesTable)
    .set(data)
    .where(eq(categoriesTable.id, id))
    .returning();

  return c.json(category);
});

routes.delete("/:id", async (c) => {
  const { data: id, error: idError } = recordIdPathParamSchema.safeParse(
    c.req.param("id"),
  );
  if (idError) throw new HTTPException(403, { message: idError.message });

  const category = await database
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();

  return c.json(category);
});

export default routes;
