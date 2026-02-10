import { toast } from "sonner";

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  config: { silent?: boolean } = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    credentials: "include"
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    const fallback = {
      ok: false,
      error: {
        code: "NON_JSON_RESPONSE",
        message: res.ok ? "Unexpected non-JSON response" : "Request failed"
      }
    };
    if (!config.silent) {
      toast.error(fallback.error.message);
    }
    throw fallback.error;
  }
  if (!data.ok) {
    const err = data.error as ApiError;
    if (!config.silent) {
      toast.error(err.message || "Request failed");
    }
    throw err;
  }
  return data.data as T;
}
