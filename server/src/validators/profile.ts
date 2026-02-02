import { z } from "zod";

export const profileUpdateSchema = z.object({
  grade: z.number().int().min(1).max(12).nullable().optional(),
  country: z.string().max(60).nullable().optional(),
  target_major: z.string().max(120).nullable().optional(),
  sat_math: z.number().int().min(200).max(800).nullable().optional(),
  sat_reading_writing: z.number().int().min(200).max(800).nullable().optional(),
  ielts_score: z.number().min(0).max(9).nullable().optional()
});
