// service.ts - Account module API services

import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "./types";
import type { PaginatedRequest, PaginatedResponse } from "../shared/types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getAccounts(
  request: PaginatedRequest
): Promise<PaginatedResponse<Account> | null> {
  try {
    const params = new URLSearchParams();

    if (request.pageNumber) {
      params.append("pageNumber", request.pageNumber.toString());
    }
    if (request.pageSize) {
      params.append("pageSize", request.pageSize.toString());
    }
    if (request.searchTerm && request.searchTerm.trim() !== "") {
      params.append("searchTerm", request.searchTerm.trim());
    }

    const response = await fetch(`${API_BASE}/api/v1/accounts?${params}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return null;
  }
}

export async function createAccount(
  request: CreateAccountRequest
): Promise<"created" | "already_exists" | "validation_error" | "failed"> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (response.status === 201) return "created";
    if (response.status === 409) return "already_exists";
    if (response.status === 400) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error creating account:", error);
    return "failed";
  }
}

export async function updateAccount(
  accountId: string,
  request: UpdateAccountRequest
): Promise<"updated" | "already_exists" | "validation_error" | "failed"> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/accounts/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (response.status === 200) return "updated";
    if (response.status === 409) return "already_exists";
    if (response.status === 400) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error updating account:", error);
    return "failed";
  }
}

export async function deactivateAccount(
  accountId: string
): Promise<"deactivated" | "validation_error" | "failed"> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/accounts/${accountId}/deactivate`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.status === 200) return "deactivated";
    if (response.status === 400) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error deactivating account:", error);
    return "failed";
  }
}

export async function activateAccount(
  accountId: string
): Promise<"activated" | "validation_error" | "failed"> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/accounts/${accountId}/activate`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.status === 200) return "activated";
    if (response.status === 400) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error activating account:", error);
    return "failed";
  }
}
