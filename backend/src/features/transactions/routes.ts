import { Hono } from "hono";
import { validateBody } from "../../shared/http/validateBody";
import { validatePathParams } from "../../shared/http/validatePathParams";
import { recordIdPathParamSchema } from "../../shared/schemas/recordIdPathParamSchema";
import {
  transactionInsertSchema,
  transactionUpdateSchema,
} from "./transactionSchema";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./transactionsService";

const routes = new Hono();

routes.get("/", async (c) => {
  return c.json(await getTransactions());
});

routes.post("/", validateBody(transactionInsertSchema), async (c) => {
  const body = c.get("validBody");
  const transaction = await createTransaction(body);
  return c.json(transaction, 201);
});

routes.patch(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  validateBody(transactionUpdateSchema),
  async (c) => {
    const { id } = c.get("validPathParams");
    const body = c.get("validBody");
    const transaction = await updateTransaction(id, body);
    return c.json(transaction);
  },
);

routes.delete(
  "/:id",
  validatePathParams(recordIdPathParamSchema),
  async (c) => {
    const { id } = c.get("validPathParams");
    const transaction = await deleteTransaction(id);
    if (transaction === undefined) return c.body(null, 204);
    return c.json(transaction);
  },
);

export default routes;
