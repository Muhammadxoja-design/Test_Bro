import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { randomUUID } from "crypto";
import app from "../src/app";
import { setupTestDb, clearDb } from "./helpers";
import { getDb } from "../src/db";
import { universities } from "../src/db/schema";

beforeAll(async () => {
  await setupTestDb();
});

beforeEach(async () => {
  await clearDb();
});

describe("admissions recommend", () => {
  it("returns tiers and disclaimer", async () => {
    const db = getDb();
    await db.insert(universities).values([
      {
        id: randomUUID(),
        name: "Safety U",
        state: "NY",
        tuitionUsd: null,
        aidPolicy: null,
        satRangeMin: 1100,
        satRangeMax: 1250,
        englishReq: null,
        applicationDeadline: null,
        description: null
      },
      {
        id: randomUUID(),
        name: "Target U",
        state: "MA",
        tuitionUsd: null,
        aidPolicy: null,
        satRangeMin: 1350,
        satRangeMax: 1450,
        englishReq: null,
        applicationDeadline: null,
        description: null
      },
      {
        id: randomUUID(),
        name: "Reach U",
        state: "CA",
        tuitionUsd: null,
        aidPolicy: null,
        satRangeMin: 1500,
        satRangeMax: 1580,
        englishReq: null,
        applicationDeadline: null,
        description: null
      }
    ]);

    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "admit@example.com",
      password: "Password123",
      name: "Admit User"
    });

    await agent.put("/api/profile").send({
      sat_math: 700,
      sat_reading_writing: 700
    });

    const res = await agent.post("/api/admissions/recommend").send({});

    expect(res.body.ok).toBe(true);
    expect(res.body.data.disclaimer).toBe("Estimate only. Not a guarantee.");
    expect(res.body.data.safety.length).toBe(1);
    expect(res.body.data.target.length).toBe(1);
    expect(res.body.data.reach.length).toBe(1);
  });
});
