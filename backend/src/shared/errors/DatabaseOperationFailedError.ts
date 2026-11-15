export class DatabaseOperationFailedError extends Error {
  override name = "DatabaseOperationFailedError";

  constructor() {
    super("Database operation failed");
  }
}
