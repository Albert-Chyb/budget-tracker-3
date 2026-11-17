import { Hono } from "hono";
import { validateBody } from "../../shared/http/validateBody";
import { validatePathParams } from "../../shared/http/validatePathParams";
import { recordIdPathParamSchema } from "../../shared/schemas/recordIdPathParamSchema";
import { InsufficientWalletBalanceError } from "./errors/InsufficientWalletBalanceError";
import { TransactionCategoryNotFoundError } from "./errors/TransactionCategoryNotFoundError";
import { TransactionWalletNotFoundError } from "./errors/TransactionWalletNotFoundError";
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

routes.onError((error, c) => {
  if (
    error instanceof TransactionWalletNotFoundError ||
    error instanceof TransactionCategoryNotFoundError ||
    error instanceof InsufficientWalletBalanceError
  ) {
    return c.json(
      {
        name: error.name,
        message: error.message,
      },
      422,
    );
  }

  throw error;
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

routes.get("/", async (c) => {
  return c.json(await getTransactions());
});

routes.post("/", validateBody(transactionInsertSchema), async (c) => {
  const body = c.get("validBody");
  const transaction = await createTransaction(body);
  return c.json(transaction, 201);
});

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
