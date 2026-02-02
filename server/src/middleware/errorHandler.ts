import type { Request, Response, NextFunction } from "express";
import { AppError, toErrorEnvelope } from "../utils/error";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = (req as Request & { id?: string }).id || "unknown";
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : "INTERNAL_ERROR";
  const message = isAppError ? err.message : "Unexpected error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[${requestId}]`, err);
  }

  const envelope = isAppError
    ? toErrorEnvelope(err)
    : { ok: false, error: { code, message } };

  res.status(status).json(envelope);
}
