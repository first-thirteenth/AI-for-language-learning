// apps/mobile/services/api.ts
import { supabase } from "../utils/supabase";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg =
      (body as { message?: string; error?: string }).message ??
      (body as { error?: string }).error ??
      `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return response.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, { headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg =
      (body as { message?: string; error?: string }).message ??
      (body as { error?: string }).error ??
      `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return response.json() as Promise<T>;
}

export const apiClient = { post, get };
