import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type {
  App,
  CreateAppRequest,
  UpdateAppRequest,
  ValidationErrors,
} from "./types";
import { validateCreateAppRequest, validateUpdateAppRequest } from "./types";
import * as service from "./service";

interface ModalState {
  isSubmitting: boolean;
  status: { type: "none" | "error" | "success"; message: string };
}

export function useApps() {
  const { t } = useTranslation("apps");
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadApps = useCallback(
    async (page: number, pageSize: number, search: string) => {
      setIsLoading(true);
      setError(null);

      const data = await service.getApps({
        pageNumber: page,
        pageSize: pageSize,
        searchTerm: search,
      });

      if (data === null) {
        setError(t("errors.loadFailed"));
        setApps([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } else {
        setApps(data.items);
        setCurrentPage(data.pageNumber);
        const calculatedTotalPages = Math.ceil(data.totalCount / data.pageSize);
        setTotalPages(calculatedTotalPages);
        setTotalCount(data.totalCount);
        setHasPreviousPage(data.pageNumber > 1);
        setHasNextPage(data.pageNumber < calculatedTotalPages);
      }

      setIsLoading(false);
    },
    [pageSize, t]
  );

  useEffect(() => {
    loadApps(1, pageSize, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadApps(1, pageSize, term);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadApps(page, pageSize, searchTerm);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    loadApps(1, newSize, searchTerm);
  };

  const reload = useCallback(() => {
    loadApps(currentPage, pageSize, searchTerm);
  }, [loadApps, currentPage, pageSize, searchTerm]);

  return {
    apps,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    searchTerm,
    search,
    reload,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    t,
  };
}

export function useCreateApp(onSuccess: () => void) {
  const { t } = useTranslation("apps");
  const [modalState, setModalState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const createApp = async (data: CreateAppRequest) => {
    const errors = validateCreateAppRequest(data, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});

    const result = await service.createApp(data);

    if (result === "created") {
      setModalState({
        isSubmitting: false,
        status: { type: "success", message: t("addModal.messages.success") },
      });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else if (result === "key_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.keyExists") },
      });
    } else if (result === "validation_error") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.validationError") },
      });
    } else {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.createFailed") },
      });
    }
  };

  const clearError = (field: keyof ValidationErrors) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const resetModal = useCallback(() => {
    setModalState({
      isSubmitting: false,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});
  }, []);

  return {
    createApp,
    modalState,
    validationErrors,
    clearError,
    resetModal,
    t,
  };
}

export function useUpdateApp(onSuccess: () => void) {
  const { t } = useTranslation("apps");
  const [modalState, setModalState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const updateApp = async (appId: number, data: UpdateAppRequest) => {
    // Client-side validation
    const errors = validateUpdateAppRequest(data, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});

    const result = await service.updateApp(appId, data);

    if (result === "updated") {
      setModalState({
        isSubmitting: false,
        status: { type: "success", message: t("editModal.messages.success") },
      });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else if (result === "key_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.keyExists") },
      });
    } else if (result === "validation_error") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.validationError") },
      });
    } else if (result === "not_found") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.notFound") },
      });
    } else {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.updateFailed") },
      });
    }
  };

  const clearError = (field: keyof ValidationErrors) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const resetModal = useCallback(() => {
    setModalState({
      isSubmitting: false,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});
  }, []);

  return {
    updateApp,
    modalState,
    validationErrors,
    clearError,
    resetModal,
    t,
  };
}

export function useStateChangeApp(onSuccess: () => void) {
  const { t } = useTranslation("apps");
  const [modalState, setModalState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });

  const pauseApp = async (appId: number) => {
    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });

    const result = await service.pauseApp(appId);

    if (result === "paused") {
      setModalState({
        isSubmitting: false,
        status: {
          type: "success",
          message: t("confirmDialog.pause.success"),
        },
      });
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else if (result === "not_found") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.notFound") },
      });
    } else {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.stateChangeFailed") },
      });
    }
  };

  const resumeApp = async (appId: number) => {
    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });

    const result = await service.resumeApp(appId);

    if (result === "resumed") {
      setModalState({
        isSubmitting: false,
        status: {
          type: "success",
          message: t("confirmDialog.resume.success"),
        },
      });
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else if (result === "not_found") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.notFound") },
      });
    } else {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.stateChangeFailed") },
      });
    }
  };

  const resetModal = useCallback(() => {
    setModalState({
      isSubmitting: false,
      status: { type: "none", message: "" },
    });
  }, []);

  return {
    pauseApp,
    resumeApp,
    modalState,
    resetModal,
    t,
  };
}
