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

describe("facts validation", () => {
  it("rejects invalid URL", async () => {
    const db = getDb();
    const uniId = randomUUID();
    await db.insert(universities).values({
      id: uniId,
      name: "Test University",
      state: "TX",
      tuitionUsd: null,
      aidPolicy: null,
      satRangeMin: null,
      satRangeMax: null,
      englishReq: null,
      applicationDeadline: null,
      description: null
    });

    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "facter@example.com",
      password: "Password123",
      name: "Fact User"
    });

    const res = await agent.post(`/api/universities/${uniId}/facts`).send({
      fact_text: "Test fact",
      source_url: "not-a-url"
    });

    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects HTML tags in fact_text", async () => {
    const db = getDb();
    const uniId = randomUUID();
    await db.insert(universities).values({
      id: uniId,
      name: "Another University",
      state: "CA",
      tuitionUsd: null,
      aidPolicy: null,
      satRangeMin: null,
      satRangeMax: null,
      englishReq: null,
      applicationDeadline: null,
      description: null
    });

    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "html@example.com",
      password: "Password123",
      name: "HTML User"
    });

    const res = await agent.post(`/api/universities/${uniId}/facts`).send({
      fact_text: "<b>Bad</b>",
      source_url: "https://example.com"
    });

    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
