import type { GetEmployeesResponse } from "@/modules/employees/types";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getEmployees(): Promise<GetEmployeesResponse> {
  const url = new URL("/api/v1/employees", API_BASE);
  let data: GetEmployeesResponse;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  data = { employees: await response.json() };
  return data;
}
