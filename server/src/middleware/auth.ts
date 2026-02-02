import type { Request, Response, NextFunction } from "express";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../db";
import { sessions, users } from "../db/schema";
import { AppError } from "../utils/error";

const COOKIE_NAME = "sypev_session";

export async function authOptional(req: Request, _res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (!sessionId) {
      return next();
    }
    const db = getDb();
    const now = Date.now();
    const session = await db
      .select({ id: sessions.id, userId: sessions.userId })
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))
      .get();

    if (!session) {
      return next();
    }

    const user = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, session.userId))
      .get();

    if (user) {
      (req as Request & { user?: { id: string; email: string | null; name: string } }).user = user;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  await authOptional(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (!req.user) {
      return next(new AppError("UNAUTHORIZED", "Authentication required", 401));
    }
    return next();
  });
}

export function getUserFromRequest(req: Request) {
  return (req as Request & { user?: { id: string; email: string | null; name: string } }).user || null;
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}
