import { z } from "zod";

export const admissionsRecommendSchema = z.object({
  preferences: z
    .object({
      state: z.string().max(2).optional(),
      max_tuition: z.number().int().min(0).optional()
    })
    .optional()
});
