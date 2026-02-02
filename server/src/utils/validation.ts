import { z } from "zod";
import { AppError } from "./error";

const htmlTagRegex = /<[^>]*>/;

export function rejectHtmlTags(value: string) {
  return !htmlTagRegex.test(value);
}

export function sanitizeText(value: string) {
  return value.trim();
}

export function parseWithSchema<T>(schema: z.ZodSchema<T>, input: unknown) {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid input", 400, result.error.flatten());
  }
  return result.data;
}

export function httpUrlSchema(maxLen: number) {
  return z
    .string()
    .max(maxLen)
    .url()
    .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
      message: "URL must start with http:// or https://"
    });
}
