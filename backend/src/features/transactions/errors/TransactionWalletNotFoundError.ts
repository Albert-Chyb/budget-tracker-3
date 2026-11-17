import type { Wallet } from "../../wallets/walletSchema";

export class TransactionWalletNotFoundError extends Error {
  override name = "TransactionWalletNotFoundError";

  constructor(public walletId: Wallet["id"]) {
    super(`Transaction references non-existing wallet: ${walletId}.`);
  }
}
