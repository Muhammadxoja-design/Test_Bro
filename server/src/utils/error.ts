export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toErrorEnvelope(err: AppError) {
  return {
    ok: false,
    error: {
      code: err.code,
      message: err.message,
      details: err.details
    }
  };
}
