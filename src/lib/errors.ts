export class DatabaseError extends Error {
  constructor(
    message: string,
    public isClientError: boolean = true,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}
