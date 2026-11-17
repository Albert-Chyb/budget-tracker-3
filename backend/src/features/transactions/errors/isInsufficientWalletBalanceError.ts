import { DatabaseError } from "pg";
import { DatabaseErrorCodes } from "../../../database/DatabaseErrorCodes";

export function isInsufficientWalletBalanceError(
  error: DatabaseError,
): boolean {
  return error.code === DatabaseErrorCodes.InsufficientWalletBalance;
}

export function getWalletIdWithInsufficientBalance(error: DatabaseError) {
  return Number(error.detail?.split("=")[1]);
}
