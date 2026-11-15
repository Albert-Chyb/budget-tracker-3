import { Hono } from "hono";
import categoriesRoutes from "./src/features/categories/routes";
import walletsRoutes from "./src/features/wallets/routes";

const app = new Hono();

app.route("/api/categories", categoriesRoutes);
app.route("/api/wallets", walletsRoutes);

export default app;
