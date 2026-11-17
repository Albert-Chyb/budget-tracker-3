import type { DatabaseError } from "pg";

export function isTransactionCategoryNotFoundError(
  error: DatabaseError,
): boolean {
  return error.constraint === "transactions_categoryId_categories_id_fkey";
}
