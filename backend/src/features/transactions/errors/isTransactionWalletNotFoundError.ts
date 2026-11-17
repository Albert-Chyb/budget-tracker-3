import type { DatabaseError } from "pg";

export function isTransactionWalletNotFoundError(
  error: DatabaseError,
): boolean {
  return error.constraint === "transactions_walletId_wallets_id_fkey";
}
