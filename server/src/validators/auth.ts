import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  name: z.string().max(120).optional()
});

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128)
});
