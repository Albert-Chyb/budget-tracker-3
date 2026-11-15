import { eq } from "drizzle-orm";
import { database } from "../../database/database";
import { transactionsTable } from "../../database/schema/tables/transactionsTable";
import { DatabaseOperationFailedError } from "../../shared/errors/DatabaseOperationFailedError";
import { RecordNotFoundError } from "../../shared/errors/RecrodNotFoundError";
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
  if (transaction === undefined)
    throw new RecordNotFoundError(
      `Transaction with id of ${id} was not found.`,
    );
  return transaction;
}

export async function createTransaction(
  data: TransactionInsert,
): Promise<Transaction> {
  const [transaction] = await database
    .insert(transactionsTable)
    .values(data)
    .returning({ id: transactionsTable.id });
  if (transaction === undefined) throw new DatabaseOperationFailedError();
  return getTransactionOrThrow(transaction.id);
}

export async function updateTransaction(
  id: Transaction["id"],
  data: TransactionUpdate,
): Promise<Transaction> {
  const [transaction] = await database
    .update(transactionsTable)
    .set(data)
    .where(eq(transactionsTable.id, id))
    .returning({ id: transactionsTable.id });
  if (transaction === undefined)
    throw new RecordNotFoundError(
      `Transaction with id of ${id} was not found.`,
    );
  return getTransactionOrThrow(id);
}

export async function deleteTransaction(
  id: Transaction["id"],
): Promise<Transaction | undefined> {
  const transaction = await getTransaction(id);
  if (transaction === undefined) return;
  await database.delete(transactionsTable).where(eq(transactionsTable.id, id));
  return transaction;
}
