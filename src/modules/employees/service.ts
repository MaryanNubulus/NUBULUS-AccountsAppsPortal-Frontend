import type { GetEmployeesResponse } from "@/modules/employees/types";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getEmployees(): Promise<GetEmployeesResponse> {
  const url = new URL("/api/v1/employees", API_BASE);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data: GetEmployeesResponse = await response.json();
  return data;
}
