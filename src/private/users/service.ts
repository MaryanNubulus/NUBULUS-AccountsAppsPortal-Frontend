import type { GetUsersResponse } from "@/shared/DTOs/GetUsersResponse";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getUsers(): Promise<GetUsersResponse> {
  const url = new URL("/api/v1/users", API_BASE);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data: GetUsersResponse = await response.json();
  return data;
}
