import type {
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedUsersResponse,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getUsers(
  accountId: string,
  searchTerm?: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedUsersResponse> {
  const params = new URLSearchParams();
  if (searchTerm) params.append("searchTerm", searchTerm);
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users?${params}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (response.ok) {
    return await response.json();
  }

  return {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    items: [],
  };
}

export async function createUser(
  accountId: string,
  request: CreateUserRequest
): Promise<
  | "created"
  | "user_exists"
  | "validation_error"
  | "account_not_found"
  | "failed"
> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    }
  );

  if (response.status === 201) return "created";
  if (response.status === 404) return "account_not_found";
  if (response.status === 400) return "validation_error";
  if (response.status === 409) return "user_exists";

  return "failed";
}

export async function updateUser(
  accountId: string,
  userId: string,
  request: UpdateUserRequest
): Promise<
  "updated" | "user_exists" | "validation_error" | "not_found" | "failed"
> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    }
  );

  if (response.status === 200) return "updated";
  if (response.status === 404) return "not_found";
  if (response.status === 400) return "validation_error";
  if (response.status === 409) return "user_exists";

  return "failed";
}

export async function pauseUser(
  accountId: string,
  userId: string
): Promise<"paused" | "not_found" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/pause`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (response.status === 200) return "paused";
  if (response.status === 404) return "not_found";

  return "failed";
}

export async function resumeUser(
  accountId: string,
  userId: string
): Promise<"resumed" | "not_found" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/resume`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (response.status === 200) return "resumed";
  if (response.status === 404) return "not_found";

  return "failed";
}
