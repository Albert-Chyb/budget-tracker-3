import { Hono } from "hono";
import categoriesRoutes from "./src/features/categories/routes";

const app = new Hono();

app.route("/api/categories", categoriesRoutes);

export default app;
