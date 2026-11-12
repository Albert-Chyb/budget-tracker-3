import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";

export const database = drizzle(process.env.DATABASE_URL!, { relations });

export type Database = typeof database;
