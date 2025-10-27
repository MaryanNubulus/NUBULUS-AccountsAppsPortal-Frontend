import type { UserInfoDTO } from "@/modules/users/types";

const API_BASE = import.meta.env.VITE_API_BASE;

export function getSignOutUrl(): string {
  const post = `${window.location.origin}/`;
  const url = new URL(
    `/api/v1/auth/sign-out?returnUrl=${encodeURIComponent(post)}`,
    API_BASE
  );
  return url.toString();
}

export async function getCurrentUserAsync(): Promise<UserInfoDTO> {
  const url = new URL("/api/v1/users/current", API_BASE);
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  const data: UserInfoDTO = await response.json();
  return data;
}
