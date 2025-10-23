import { useEffect, useState, useCallback } from "react";
import type { AppInfoDTO, CreateAppRequest, GetAppsResponse } from "./types";
import { createApp as createAppService, getApps } from "./service";

interface AddAppState {
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}

export function useAppsViewModel() {
  const [apps, setApps] = useState<AppInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addAppState, setAddAppState] = useState<AddAppState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });

  const loadApps = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: GetAppsResponse = await getApps();

      if (!response.success) {
        throw new Error(response.message ?? "Unknown error");
      }

      setApps(response.apps ?? []);
    } catch (err) {
      setError("Error fetching apps. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleCreateApp = async (request: CreateAppRequest) => {
    setAddAppState((prev) => ({
      ...prev,
      isSubmitting: true,
      status: { type: "none", message: "" },
    }));

    try {
      const result = await createAppService(request);

      switch (result) {
        case "created":
          setAddAppState((prev) => ({
            ...prev,
            status: {
              type: "success",
              message: "App created successfully",
            },
          }));
          await loadApps();
          setTimeout(() => {
            setIsAddModalOpen(false);
            setAddAppState((prev) => ({
              ...prev,
              status: { type: "none", message: "" },
            }));
          }, 1500);
          return result;

        case "key_exists":
          setAddAppState((prev) => ({
            ...prev,
            status: {
              type: "error",
              message: "An app with this key already exists",
            },
          }));
          return result;

        case "failed":
          setAddAppState((prev) => ({
            ...prev,
            status: {
              type: "error",
              message: "Failed to create app. Please try again.",
            },
          }));
          return result;
      }
    } catch (error) {
      setAddAppState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: "An unexpected error occurred",
        },
      }));
    } finally {
      setAddAppState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }

    return addAppState.status;
  };

  const handleCloseModal = useCallback(() => {
    setIsAddModalOpen(false);
    setAddAppState({
      isSubmitting: false,
      status: { type: "none", message: "" },
    });
  }, []);

  return {
    apps,
    isLoading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    handleCloseModal,
    createApp: handleCreateApp,
    addAppState,
  };
}
