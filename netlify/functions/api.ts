import serverless from "serverless-http";
import app from "../../server/src/app";
import { ensureSchema, getDb } from "../../server/src/db";

try {
  ensureSchema();
  getDb();
} catch (error) {
  console.error("Failed to initialize database:", error);
}

export const handler = serverless(app, {
  basePath: "/.netlify/functions/api"
});
