import type { Wallet } from "../../wallets/walletSchema";

export class InsufficientWalletBalanceError extends Error {
  override name = "InsufficientWalletBalanceError";

  constructor(walletId: Wallet["id"]) {
    super(`Wallet (id=${walletId}) does not have sufficient balance.`);
  }
}
