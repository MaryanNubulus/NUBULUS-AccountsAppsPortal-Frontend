import { useEffect, useState, useCallback } from "react";
import type { AppInfoDTO, CreateAppRequest, GetAppsResponse } from "./types";
import {
  createApp as createAppService,
  getApps,
  pauseResumeApp,
  updateApp,
} from "./service";
import { useTranslation } from "react-i18next";

interface ModalState {
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}

export function useAppsViewModel() {
  const { t } = useTranslation("apps");
  const [apps, setApps] = useState<AppInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addAppState, setAddAppState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppInfoDTO | null>(null);
  const [editAppState, setEditAppState] = useState<ModalState>({
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
      setError(t("errors.fetchApps"));
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
              message: t("addModal.messages.success"),
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
              message: t("addModal.messages.keyExists"),
            },
          }));
          return result;

        case "failed":
          setAddAppState((prev) => ({
            ...prev,
            status: {
              type: "error",
              message: t("addModal.messages.failed"),
            },
          }));
          return result;
      }
    } catch (error) {
      setAddAppState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: t("errors.unexpected"),
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

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingApp(null);
    setEditAppState({
      isSubmitting: false,
      status: { type: "none", message: "" },
    });
  }, []);

  const handleEditApp = async (
    appId: string,
    name: string
  ): Promise<"success" | "failed"> => {
    setEditAppState((prev) => ({
      ...prev,
      isSubmitting: true,
      status: { type: "none", message: "" },
    }));

    try {
      const result = await updateApp(appId, { name });

      if (result === "success") {
        setEditAppState((prev) => ({
          ...prev,
          status: {
            type: "success",
            message: t("editModal.messages.success"),
          },
        }));
        await loadApps();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
          setEditAppState((prev) => ({
            ...prev,
            status: { type: "none", message: "" },
          }));
        }, 1500);
        return "success";
      }

      setEditAppState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: t("editModal.messages.failed"),
        },
      }));
      return "failed";
    } catch (error) {
      setEditAppState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: t("errors.unexpected"),
        },
      }));
      return "failed";
    } finally {
      setEditAppState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  const handleStartEdit = (app: AppInfoDTO) => {
    setEditingApp(app);
    setIsEditModalOpen(true);
  };

  const handlePauseResumeApp = async (appId: string, pause: boolean) => {
    const result = await pauseResumeApp(appId, pause);
    if (result === "success") {
      setApps((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, isActive: !pause } : app
        )
      );
    }
  };

  return {
    apps,
    isLoading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    handleCloseModal,
    createApp: handleCreateApp,
    pauseResumeApp: handlePauseResumeApp,
    addAppState,
    editingApp,
    isEditModalOpen,
    handleCloseEditModal,
    handleStartEdit,
    handleEditApp,
    editAppState,
  };
}
