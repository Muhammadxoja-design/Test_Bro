import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import { setupTestDb, clearDb } from "./helpers";

beforeAll(async () => {
  await setupTestDb();
});

beforeEach(async () => {
  await clearDb();
});

describe("profile update", () => {
  it("auto-calculates sat_total", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "student@example.com",
      password: "Password123",
      name: "Test Student"
    });

    const res = await agent.put("/api/profile").send({
      sat_math: 700,
      sat_reading_writing: 650
    });

    expect(res.body.ok).toBe(true);
    expect(res.body.data.satTotal).toBe(1350);
  });
});
