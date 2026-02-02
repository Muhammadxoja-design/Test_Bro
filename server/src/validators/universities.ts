import { z } from "zod";
import { httpUrlSchema, rejectHtmlTags } from "../utils/validation";

export const universityListQuerySchema = z.object({
  search: z.string().max(120).optional(),
  state: z.string().max(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional()
});

export const universityIdParamSchema = z.object({
  id: z.string().min(1).max(64)
});

export const factCreateSchema = z.object({
  fact_text: z
    .string()
    .max(280)
    .refine(rejectHtmlTags, { message: "HTML tags are not allowed" }),
  source_url: httpUrlSchema(500),
  tag: z.string().max(50).optional(),
  year: z.number().int().min(1900).max(2100).optional()
});
