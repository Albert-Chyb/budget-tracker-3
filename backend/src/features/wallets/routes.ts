import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { database } from "../../database/database";
import { walletsTable } from "../../database/schema/tables/walletsTable";
import { validateBody } from "../../shared/http/validateBody";
import { validatePathParams } from "../../shared/http/validatePathParams";
import { recordIdPathParamSchema } from "../../shared/schemas/recordIdPathParamSchema";
import { walletInsertSchema, walletUpdateSchema } from "./walletSchema";

const routes = new Hono();

routes.get("/", async (c) => {
  const wallets = await database.query.wallets.findMany();

  return c.json(wallets);
});

routes.post("/", validateBody(walletInsertSchema), async (c) => {
  const body = c.get("validBody");
  const [wallet] = await database.insert(walletsTable).values(body).returning();

  if (!wallet)
    throw new HTTPException(500, { message: "Database operation failed" });

  return c.json(wallet, 201);
});

routes.patch(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  validateBody(walletUpdateSchema),
  async (c) => {
    const { id } = c.get("validPathParams");
    const body = c.get("validBody");

    const [wallet] = await database
      .update(walletsTable)
      .set(body)
      .where(eq(walletsTable.id, id))
      .returning();

    if (wallet === undefined)
      throw new HTTPException(404, {
        message: `Wallet with id of ${id} was not found.`,
      });

    return c.json(wallet);
  },
);

routes.delete(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");

    const [wallet] = await database
      .delete(walletsTable)
      .where(eq(walletsTable.id, id))
      .returning();

    if (wallet === undefined) return c.body(null, 204);

    return c.json(wallet);
  },
);

export default routes;
