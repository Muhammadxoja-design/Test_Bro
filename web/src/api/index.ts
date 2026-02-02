import { apiFetch } from "./client";

export type User = { id: string; email: string | null; name: string };
export type Profile = {
  userId: string;
  grade: number | null;
  country: string;
  targetMajor: string | null;
  satMath: number | null;
  satReadingWriting: number | null;
  satTotal: number | null;
  ieltsScore: number | null;
  updatedAt: number;
};

export type University = {
  id: string;
  name: string;
  state: string;
  tuitionUsd: number | null;
  aidPolicy: string | null;
  satRangeMin: number | null;
  satRangeMax: number | null;
  englishReq: string | null;
  applicationDeadline: string | null;
  description: string | null;
};

export type UniversityFact = {
  id: string;
  universityId: string;
  factText: string;
  sourceUrl: string;
  tag: string | null;
  year: number | null;
  createdAt: number;
  isVerified: number;
};

export async function register(payload: { email: string; password: string; name?: string }) {
  return apiFetch<User>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<User>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function logout() {
  return apiFetch<{ loggedOut: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function me() {
  return apiFetch<{ user: User; profile: Profile | null }>("/api/auth/me", {}, { silent: true });
}

export async function getProfile() {
  return apiFetch<Profile>("/api/profile");
}

export async function updateProfile(payload: {
  grade?: number | null;
  country?: string | null;
  target_major?: string | null;
  sat_math?: number | null;
  sat_reading_writing?: number | null;
  ielts_score?: number | null;
}) {
  return apiFetch<Profile>("/api/profile", { method: "PUT", body: JSON.stringify(payload) });
}

export async function listUniversities(params: { search?: string; state?: string; limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.state) searchParams.set("state", params.state);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.offset) searchParams.set("offset", String(params.offset));
  const query = searchParams.toString();
  return apiFetch<University[]>(`/api/universities${query ? `?${query}` : ""}`);
}

export async function getUniversity(id: string) {
  return apiFetch<University & { facts: UniversityFact[] }>(`/api/universities/${id}`);
}

export async function addFact(id: string, payload: { fact_text: string; source_url: string; tag?: string; year?: number }) {
  return apiFetch<UniversityFact>(`/api/universities/${id}/facts`, { method: "POST", body: JSON.stringify(payload) });
}

export async function admissionsRecommend() {
  return apiFetch<{ safety: University[]; target: University[]; reach: University[]; disclaimer: string; message?: string }>(
    "/api/admissions/recommend",
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function aiTutor(payload: { message: string; context?: "SAT" | "Admissions"; university_id?: string }) {
  return apiFetch<{ reply: string; mode: string; disclaimer: string }>("/api/ai/tutor", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getSatTopics() {
  return apiFetch<{ id: string; name: string; description: string | null }[]>("/api/sat/topics");
}
