import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { serverAppRole } from "../schema/roles/serverAppRole";

const db = drizzle(process.env.DATABASE_URL!);

const password = prompt("Enter password for server_app: \n");

if (!password) {
  throw new Error("Password cannot be empty");
}

await db.execute(
  `create user ${serverAppRole.name} with password '${password}'`,
);

console.log("Database role configured successfully!");

await db.$client.end();
