import { z } from "zod";

export const aiTutorSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.enum(["SAT", "Admissions"]).optional(),
  university_id: z.string().min(1).max(64).optional()
});
