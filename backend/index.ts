import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import categoriesRoutes from "./src/features/categories/routes";
import transactionsRoutes from "./src/features/transactions/routes";
import walletsRoutes from "./src/features/wallets/routes";
import { DatabaseOperationFailedError } from "./src/shared/errors/DatabaseOperationFailedError";
import { RecordNotFoundError } from "./src/shared/errors/RecrodNotFoundError";

const app = new Hono();

app.onError((error) => {
  if (error instanceof RecordNotFoundError)
    throw new HTTPException(404, { message: error.message });

  if (error instanceof DatabaseOperationFailedError)
    throw new HTTPException(500, { message: error.message });

  throw error;
});

app.route("/api/categories", categoriesRoutes);
app.route("/api/wallets", walletsRoutes);
app.route("/api/transactions", transactionsRoutes);

export default app;
