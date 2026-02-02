import { Router } from "express";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { studentProfiles } from "../db/schema";
import { profileUpdateSchema } from "../validators/profile";
import { parseWithSchema, sanitizeText } from "../utils/validation";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, req.user!.id))
      .get();
    res.json({ ok: true, data: profile });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const input = parseWithSchema(profileUpdateSchema, req.body);
    const db = getDb();
    const current = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, req.user!.id))
      .get();

    const nextValues = {
      grade: input.grade ?? current?.grade ?? null,
      country: input.country !== undefined && input.country !== null ? sanitizeText(input.country) : current?.country || "Uzbekistan",
      targetMajor:
        input.target_major !== undefined && input.target_major !== null ? sanitizeText(input.target_major) : current?.targetMajor || null,
      satMath: input.sat_math ?? current?.satMath ?? null,
      satReadingWriting: input.sat_reading_writing ?? current?.satReadingWriting ?? null,
      ieltsScore: input.ielts_score ?? current?.ieltsScore ?? null
    };

    const satMath = nextValues.satMath;
    const satReadingWriting = nextValues.satReadingWriting;
    const hasBothSat = typeof satMath === "number" && typeof satReadingWriting === "number";
    const satTotal = hasBothSat ? satMath + satReadingWriting : null;

    await db
      .update(studentProfiles)
      .set({
        grade: nextValues.grade,
        country: nextValues.country,
        targetMajor: nextValues.targetMajor,
        satMath: nextValues.satMath,
        satReadingWriting: nextValues.satReadingWriting,
        satTotal,
        ieltsScore: nextValues.ieltsScore,
        updatedAt: Date.now()
      })
      .where(eq(studentProfiles.userId, req.user!.id));

    const updated = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, req.user!.id))
      .get();

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
