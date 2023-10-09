class StandardError extends Error {
  public success: boolean;
  public status: number;

  constructor({
    success,
    message,
    status,
  }: {
    success: boolean;
    message: string;
    status: number;
  }) {
    super(message);
    this.success = success;
    this.status = status;
  }
}

export default StandardError;
