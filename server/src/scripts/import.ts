import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { parse } from "csv-parse/sync";
import { randomUUID } from "crypto";
import { getDb } from "../db";
import { universities, universityFacts } from "../db/schema";
import { factCreateSchema } from "../validators/universities";
import { sanitizeText } from "../utils/validation";
import { sql } from "drizzle-orm";

dotenv.config();

function readFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".json") {
    return JSON.parse(content);
  }
  if (ext === ".csv") {
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
  }
  throw new Error(`Unsupported file type: ${ext}`);
}

function getArgValue(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

async function upsertUniversity(entry: any) {
  const db = getDb();
  const name = sanitizeText(String(entry.university_name || entry.name || ""));
  if (!name) {
    throw new Error("University name is required");
  }

  const existing = await db
    .select()
    .from(universities)
    .where(sql`lower(${universities.name}) = lower(${name})`)
    .get();

  const payload = {
    name,
    state: sanitizeText(String(entry.state || "")),
    tuitionUsd: entry.tuition_usd ? Number(entry.tuition_usd) : null,
    aidPolicy: entry.aid_policy ? sanitizeText(String(entry.aid_policy)) : null,
    satRangeMin: entry.sat_range_min ? Number(entry.sat_range_min) : null,
    satRangeMax: entry.sat_range_max ? Number(entry.sat_range_max) : null,
    englishReq: entry.english_req ? sanitizeText(String(entry.english_req)) : null,
    applicationDeadline: entry.application_deadline ? sanitizeText(String(entry.application_deadline)) : null,
    description: entry.description ? sanitizeText(String(entry.description)) : null
  };

  if (existing) {
    await db.update(universities).set(payload).where(sql`lower(${universities.name}) = lower(${name})`);
    return existing.id;
  }

  const id = randomUUID();
  await db.insert(universities).values({ id, ...payload });
  return id;
}

async function importUniversities(filePath: string) {
  const rows = readFile(filePath);
  if (!Array.isArray(rows)) {
    throw new Error("Universities input must be an array");
  }
  for (const row of rows) {
    await upsertUniversity(row);
  }
}

async function importFacts(filePath: string) {
  const rows = readFile(filePath);
  if (!Array.isArray(rows)) {
    throw new Error("Facts input must be an array");
  }
  const db = getDb();
  const allUnis = await db.select().from(universities);
  const nameMap = new Map(allUnis.map((u) => [u.name.toLowerCase(), u.id]));
  const errors: string[] = [];

  for (const row of rows) {
    const uniName = sanitizeText(String(row.university_name || ""));
    const uniId = nameMap.get(uniName.toLowerCase());
    if (!uniId) {
      errors.push(`Fact skipped. University not found: ${uniName}`);
      continue;
    }

    const parsed = factCreateSchema.safeParse({
      fact_text: row.fact_text,
      source_url: row.source_url,
      tag: row.tag || undefined,
      year: row.year ? Number(row.year) : undefined
    });

    if (!parsed.success) {
      errors.push(`Fact invalid for ${uniName}: ${parsed.error.message}`);
      continue;
    }

    await db.insert(universityFacts).values({
      id: randomUUID(),
      universityId: uniId,
      factText: sanitizeText(parsed.data.fact_text),
      sourceUrl: sanitizeText(parsed.data.source_url),
      tag: parsed.data.tag ? sanitizeText(parsed.data.tag) : null,
      year: parsed.data.year ?? null,
      createdAt: Date.now(),
      isVerified: 0
    });
  }

  if (errors.length) {
    console.warn("Import completed with issues:");
    errors.forEach((err) => console.warn(`- ${err}`));
  }
}

async function main() {
  const universitiesFile = getArgValue("--universities");
  const factsFile = getArgValue("--facts");

  if (!universitiesFile && !factsFile) {
    console.error("Usage: npm run import -- --universities <file> --facts <file>");
    process.exit(1);
  }

  if (universitiesFile) {
    await importUniversities(universitiesFile);
  }
  if (factsFile) {
    await importFacts(factsFile);
  }

  console.log("Import complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
