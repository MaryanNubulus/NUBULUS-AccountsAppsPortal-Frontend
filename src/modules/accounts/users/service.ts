import type {
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedUsersResponse,
  User,
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

export async function getUserInfo(
  accountId: string,
  userId: string
): Promise<User | null> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (response.ok) {
    return await response.json();
  }

  return null;
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

export async function getUsersToShare(
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
    `${API_BASE}/api/v1/accounts/${accountId}/users/to-share?${params}`,
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
    pageSize: pageSize,
    items: [],
  };
}

export async function getSharedUsers(
  accountId: string,
  searchTerm?: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedUsersResponse> {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }

  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/shareds?${params}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (response.ok) {
    return await response.json();
  }

  return {
    items: [],
    pageNumber: 1,
    pageSize: pageSize,
    totalCount: 0,
  };
}

export async function shareUser(
  accountId: string,
  userId: string
): Promise<"shared" | "not_found" | "already_shared" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/share`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (response.status === 200) return "shared";
  if (response.status === 404) return "not_found";
  if (response.status === 409) return "already_shared";

  return "failed";
}

export async function unshareUser(
  accountId: string,
  userId: string
): Promise<"unshared" | "not_found" | "cannot_unshare_creator" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/unshare`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (response.status === 200) return "unshared";
  if (response.status === 404) return "not_found";
  if (response.status === 409) return "cannot_unshare_creator";

  return "failed";
}
