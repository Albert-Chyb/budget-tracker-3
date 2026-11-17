import type { Category } from "../../categories/categorySchema";

export class TransactionCategoryNotFoundError extends Error {
  override name = "TransactionCategoryNotFoundError";

  constructor(public categoryId: Category["id"]) {
    super(`Transaction references non-existing category: ${categoryId}.`);
  }
}
