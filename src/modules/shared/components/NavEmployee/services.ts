import type { EmployeeInfoDTO } from "@/modules/employees/types";

const API_BASE = import.meta.env.VITE_API_BASE;

export function getSignOutUrl(): string {
  const post = `${window.location.origin}/`;
  const url = new URL(
    `/api/v1/auth/sign-out?returnUrl=${encodeURIComponent(post)}`,
    API_BASE
  );
  return url.toString();
}

export async function getCurrentEmployeeAsync(): Promise<EmployeeInfoDTO> {
  const url = new URL("/api/v1/employees/current", API_BASE);
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch current employee");
  }
  const data: EmployeeInfoDTO = await response.json();
  return data;
}
