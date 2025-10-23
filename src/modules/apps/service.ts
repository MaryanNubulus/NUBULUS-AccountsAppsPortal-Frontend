import type { CreateAppRequest, GetAppsResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getApps(): Promise<GetAppsResponse> {
  const url = new URL("/api/v1/apps", API_BASE);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data: GetAppsResponse = await response.json();

  return data;
}

export async function createApp(request: CreateAppRequest) {
  const url = new URL("/api/v1/apps", API_BASE);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (response.status == 409) return "key_exists";
  if (response.ok) return "created";

  return "failed";
}
