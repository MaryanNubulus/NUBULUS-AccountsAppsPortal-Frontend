// service.ts - Account module API services

import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "./types";
import type { PaginatedRequest, PaginatedResponse } from "../shared/types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface AccountInfo {
  accountId: number;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  numberId: string;
  address: string;
  status: string;
}

export async function getAccount(
  accountId: number
): Promise<AccountInfo | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/accounts/${accountId}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
}

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
    if (response.status === 422) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error creating account:", error);
    return "failed";
  }
}

export async function updateAccount(
  accountId: number,
  request: UpdateAccountRequest
): Promise<
  "updated" | "not_found" | "already_exists" | "validation_error" | "failed"
> {
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
    if (response.status === 404) return "not_found";
    if (response.status === 409) return "already_exists";
    if (response.status === 422) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error updating account:", error);
    return "failed";
  }
}

export async function pauseAccount(
  accountId: number
): Promise<"paused" | "not_found" | "failed"> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/accounts/${accountId}/pause`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 200) return "paused";
    if (response.status === 404) return "not_found";

    return "failed";
  } catch (error) {
    console.error("Error pausing account:", error);
    return "failed";
  }
}

export async function resumeAccount(
  accountId: number
): Promise<"resumed" | "not_found" | "failed"> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/accounts/${accountId}/resume`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 200) return "resumed";
    if (response.status === 404) return "not_found";

    return "failed";
  } catch (error) {
    console.error("Error resuming account:", error);
    return "failed";
  }
}
