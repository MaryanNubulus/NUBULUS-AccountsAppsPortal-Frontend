import type { CreateUserRequest, UpdateUserRequest, User } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getAllUsers(accountId: string): Promise<User[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (response.ok) {
    return await response.json();
  }

  return [];
}

export async function createUser(
  accountId: string,
  request: CreateUserRequest
): Promise<
  | "created"
  | "email_exists"
  | "phone_exists"
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
  if (response.status === 409) {
    const error = await response.json();
    if (error.message.includes("email")) return "email_exists";
    if (error.message.includes("phone")) return "phone_exists";
  }

  return "failed";
}

export async function updateUser(
  accountId: string,
  userId: string,
  request: UpdateUserRequest
): Promise<
  | "updated"
  | "email_exists"
  | "phone_exists"
  | "validation_error"
  | "not_found"
  | "cannot_modify_owner"
  | "failed"
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
  if (response.status === 400) {
    const error = await response.json();
    if (error.message?.includes("Owner")) return "cannot_modify_owner";
    return "validation_error";
  }
  if (response.status === 409) {
    const error = await response.json();
    if (error.message.includes("email")) return "email_exists";
    if (error.message.includes("phone")) return "phone_exists";
  }

  return "failed";
}

export async function deactivateUser(
  accountId: string,
  userId: string
): Promise<"deactivated" | "not_found" | "cannot_deactivate_owner" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/deactivate`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (response.status === 200) return "deactivated";
  if (response.status === 404) return "not_found";
  if (response.status === 400) {
    const error = await response.json();
    if (error.message?.includes("Owner")) return "cannot_deactivate_owner";
  }

  return "failed";
}

export async function activateUser(
  accountId: string,
  userId: string
): Promise<"activated" | "not_found" | "cannot_activate_owner" | "failed"> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users/${userId}/activate`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (response.status === 200) return "activated";
  if (response.status === 404) return "not_found";
  if (response.status === 400) {
    const error = await response.json();
    if (error.message?.includes("Owner")) return "cannot_activate_owner";
  }

  return "failed";
}
