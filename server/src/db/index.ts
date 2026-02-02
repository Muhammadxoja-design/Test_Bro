import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqliteInstance: Database.Database | null = null;

export function getDbPath() {
  return path.resolve(process.cwd(), process.env.DB_PATH || "./data/dev.sqlite");
}

export function ensureDataDir(dbPath: string) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getSqlite() {
  if (!sqliteInstance) {
    const dbPath = getDbPath();
    ensureDataDir(dbPath);
    sqliteInstance = new Database(dbPath);
  }
  return sqliteInstance;
}

export function ensureSchema() {
  try {
    const sqlite = getSqlite();
    const row = sqlite
      .prepare("select name from sqlite_master where type='table' and name='users'")
      .get();
    if (row) {
      return;
    }
    const migrationPath = path.join(process.cwd(), "drizzle", "0000_init.sql");
    if (!fs.existsSync(migrationPath)) {
      console.warn(`Migration file not found at: ${migrationPath}`);
      return;
    }
    const sql = fs.readFileSync(migrationPath, "utf-8");
    sqlite.exec(sql);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return;
    }
    throw error;
  }
}

export function getDb() {
  if (!dbInstance) {
    const sqlite = getSqlite();
    dbInstance = drizzle(sqlite, { schema });
  }
  return dbInstance;
}

export type Db = ReturnType<typeof getDb>;
