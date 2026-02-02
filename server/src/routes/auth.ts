import { Router } from "express";
import { randomUUID } from "crypto";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users, studentProfiles, sessions } from "../db/schema";
import { registerSchema, loginSchema } from "../validators/auth";
import { parseWithSchema } from "../utils/validation";
import { AppError } from "../utils/error";
import { getSessionCookieName } from "../middleware/auth";

const router = Router();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/"
  };
}

async function createSession(userId: string) {
  const db = getDb();
  const sessionId = randomUUID();
  const now = Date.now();
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  });
  return sessionId;
}

router.post("/register", async (req, res, next) => {
  try {
    const input = parseWithSchema(registerSchema, req.body);
    const email = input.email.toLowerCase();
    const db = getDb();
    const existing = await db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      throw new AppError("EMAIL_TAKEN", "Email already registered", 409);
    }

    const passwordHash = await argon2.hash(input.password);
    const userId = randomUUID();
    const now = Date.now();

    await db.insert(users).values({
      id: userId,
      email,
      telegramId: null,
      name: input.name || "Student",
      passwordHash,
      createdAt: now
    });

    await db.insert(studentProfiles).values({
      userId,
      grade: null,
      country: "Uzbekistan",
      targetMajor: null,
      satMath: null,
      satReadingWriting: null,
      satTotal: null,
      ieltsScore: null,
      updatedAt: now
    });

    const sessionId = await createSession(userId);
    res.cookie(getSessionCookieName(), sessionId, cookieOptions());
    res.json({ ok: true, data: { id: userId, email, name: input.name || "Student" } });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const input = parseWithSchema(loginSchema, req.body);
    const email = input.email.toLowerCase();
    const db = getDb();
    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }
    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }
    const sessionId = await createSession(user.id);
    res.cookie(getSessionCookieName(), sessionId, cookieOptions());
    res.json({ ok: true, data: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const db = getDb();
    const sessionId = req.cookies?.[getSessionCookieName()];
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    res.clearCookie(getSessionCookieName(), { path: "/" });
    res.json({ ok: true, data: { loggedOut: true } });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ ok: true, data: { user: null, profile: null } });
    }
    const db = getDb();
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, req.user.id))
      .get();
    res.json({ ok: true, data: { user: req.user, profile } });
  } catch (error) {
    next(error);
  }
});

export default router;
