import type { Transaction } from "../transactionSchema";

export class TransactionNotFoundError extends Error {
  override name = "TransactionNotFoundError";

  constructor(public transactionId: Transaction["id"]) {
    super(`Transaction with id ${transactionId} was not found.`);
  }
}
