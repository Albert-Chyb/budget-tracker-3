import { pgRole } from "drizzle-orm/pg-core";

export const serverAppRole = pgRole("server_app").existing();
