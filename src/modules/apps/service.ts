// service.ts - App module API services

import type { App, CreateAppRequest, UpdateAppRequest } from "./types";
import type { PaginatedRequest, PaginatedResponse } from "../shared/types";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface AppInfo {
  id: number;
  key: string;
  name: string;
  status: string;
}

export async function getApp(appId: number): Promise<AppInfo | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/apps/${appId}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error fetching app:", error);
    return null;
  }
}

export async function getApps(
  request: PaginatedRequest
): Promise<PaginatedResponse<App> | null> {
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

    const response = await fetch(`${API_BASE}/api/v1/apps?${params}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error fetching apps:", error);
    return null;
  }
}

export async function createApp(
  request: CreateAppRequest
): Promise<"created" | "key_exists" | "validation_error" | "failed"> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/apps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (response.status === 201) return "created";
    if (response.status === 409) return "key_exists";
    if (response.status === 422) return "validation_error";

    return "failed";
  } catch (error) {
    console.error("Error creating app:", error);
    return "failed";
  }
}

export async function updateApp(
  appId: number,
  request: UpdateAppRequest
): Promise<
  "updated" | "key_exists" | "validation_error" | "not_found" | "failed"
> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/apps/${appId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (response.status === 204) return "updated";
    if (response.status === 409) return "key_exists";
    if (response.status === 422) return "validation_error";
    if (response.status === 404) return "not_found";

    return "failed";
  } catch (error) {
    console.error("Error updating app:", error);
    return "failed";
  }
}

export async function pauseApp(
  appId: number
): Promise<"paused" | "not_found" | "failed"> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/apps/${appId}/pause`, {
      method: "PATCH",
      credentials: "include",
    });

    if (response.status === 204) return "paused";
    if (response.status === 404) return "not_found";

    return "failed";
  } catch (error) {
    console.error("Error pausing app:", error);
    return "failed";
  }
}

export async function resumeApp(
  appId: number
): Promise<"resumed" | "not_found" | "failed"> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/apps/${appId}/resume`, {
      method: "PATCH",
      credentials: "include",
    });

    if (response.status === 204) return "resumed";
    if (response.status === 404) return "not_found";

    return "failed";
  } catch (error) {
    console.error("Error resuming app:", error);
    return "failed";
  }
}
