import { DrizzleQueryError, eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import { database } from "../../database/database";
import { transactionsTable } from "../../database/schema/tables/transactionsTable";
import { InsufficientWalletBalanceError } from "./errors/InsufficientWalletBalanceError";
import {
  getWalletIdWithInsufficientBalance,
  isInsufficientWalletBalanceError,
} from "./errors/isInsufficientWalletBalanceError";
import { isTransactionCategoryNotFoundError } from "./errors/isTransactionCategoryNotFoundError";
import { isTransactionWalletNotFoundError } from "./errors/isTransactionWalletNotFoundError";
import { TransactionCategoryNotFoundError } from "./errors/TransactionCategoryNotFoundError";
import { TransactionNotFoundError } from "./errors/TransactionNotFoundError";
import { TransactionWalletNotFoundError } from "./errors/TransactionWalletNotFoundError";
import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
} from "./transactionSchema";

const queryBase = {
  columns: {
    categoryId: false,
    walletId: false,
  },
  with: {
    category: true,
    wallet: true,
  },
} as const;

export function getTransactions(): Promise<Transaction[]> {
  return database.query.transactions.findMany(queryBase) as Promise<
    Transaction[]
  >;
}

export function getTransaction(
  id: Transaction["id"],
): Promise<Transaction | undefined> {
  return database.query.transactions.findFirst({
    ...queryBase,
    where: {
      id: { eq: id },
    },
  }) as Promise<Transaction | undefined>;
}

async function getTransactionOrThrow(
  id: Transaction["id"],
): Promise<Transaction> {
  const transaction = await getTransaction(id);
  if (transaction === undefined) throw new TransactionNotFoundError(id);
  return transaction;
}

export async function createTransaction(
  data: TransactionInsert,
): Promise<Transaction> {
  try {
    const [transaction] = await database
      .insert(transactionsTable)
      .values(data)
      .returning({ id: transactionsTable.id });
    return getTransactionOrThrow(transaction!.id);
  } catch (error) {
    if (
      error instanceof DrizzleQueryError &&
      error.cause instanceof DatabaseError
    ) {
      const databaseError = error.cause;

      if (isInsufficientWalletBalanceError(databaseError))
        throw new InsufficientWalletBalanceError(data.walletId);

      if (isTransactionWalletNotFoundError(databaseError))
        throw new TransactionCategoryNotFoundError(data.categoryId);

      if (isTransactionCategoryNotFoundError(databaseError))
        throw new TransactionWalletNotFoundError(data.walletId);
    }

    throw error;
  }
}

export async function updateTransaction(
  id: Transaction["id"],
  data: TransactionUpdate,
): Promise<Transaction> {
  try {
    await database
      .update(transactionsTable)
      .set(data)
      .where(eq(transactionsTable.id, id))
      .returning();
    return getTransactionOrThrow(id);
  } catch (error) {
    if (
      error instanceof DrizzleQueryError &&
      error.cause instanceof DatabaseError
    ) {
      const databaseError = error.cause;

      if (data.categoryId && isTransactionCategoryNotFoundError(databaseError))
        throw new TransactionCategoryNotFoundError(data.categoryId);

      if (data.walletId && isTransactionWalletNotFoundError(databaseError))
        throw new TransactionWalletNotFoundError(data.walletId);

      if (isInsufficientWalletBalanceError(databaseError))
        throw new InsufficientWalletBalanceError(
          getWalletIdWithInsufficientBalance(databaseError),
        );
    }

    throw error;
  }
}

export async function deleteTransaction(
  id: Transaction["id"],
): Promise<Transaction | undefined> {
  try {
    const transaction = await getTransaction(id);
    if (transaction === undefined) return;
    await database
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, id));
    return transaction;
  } catch (error) {
    if (
      error instanceof DrizzleQueryError &&
      error.cause instanceof DatabaseError
    ) {
      const databaseError = error.cause;

      if (isInsufficientWalletBalanceError(databaseError))
        throw new InsufficientWalletBalanceError(
          getWalletIdWithInsufficientBalance(databaseError),
        );
    }

    throw error;
  }
}
