import path from "path";
import fs from "fs";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getDb, getDbPath } from "../src/db";
import {
  universityFacts,
  satAttempts,
  satQuestions,
  satTopics,
  sessions,
  studentProfiles,
  universities,
  users
} from "../src/db/schema";

let migrated = false;

export async function setupTestDb() {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = getDb();
  if (!migrated) {
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    migrated = true;
  }
}

export async function clearDb() {
  const db = getDb();
  await db.delete(universityFacts);
  await db.delete(satAttempts);
  await db.delete(satQuestions);
  await db.delete(satTopics);
  await db.delete(sessions);
  await db.delete(studentProfiles);
  await db.delete(universities);
  await db.delete(users);
}
