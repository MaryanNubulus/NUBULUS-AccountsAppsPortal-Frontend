// viewmodel.ts - Account module viewmodel hooks

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ValidationErrors,
} from "./types";
import {
  validateCreateAccountRequest,
  validateUpdateAccountRequest,
} from "./types";
import * as service from "./service";

interface ModalState {
  isSubmitting: boolean;
  status: { type: "none" | "error" | "success"; message: string };
}

export function useAccounts() {
  const { t } = useTranslation("accounts");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadAccounts = useCallback(
    async (page: number = currentPage, search: string = searchTerm) => {
      setIsLoading(true);
      setError(null);

      const data = await service.getAccounts({
        pageNumber: page,
        pageSize: pageSize,
        searchTerm: search,
      });

      if (data === null) {
        setError(t("errors.loadFailed"));
        setAccounts([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } else {
        setAccounts(data.items);
        setCurrentPage(data.pageNumber);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setHasPreviousPage(data.pageNumber > 1);
        setHasNextPage(data.pageNumber < data.totalPages);
      }

      setIsLoading(false);
    },
    [currentPage, pageSize, searchTerm, t]
  );

  useEffect(() => {
    loadAccounts(1, searchTerm);
  }, []);

  const search = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadAccounts(1, term);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadAccounts(page, searchTerm);
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

  return {
    accounts,
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
    reload: () => loadAccounts(currentPage, searchTerm),
    goToPage,
    nextPage,
    previousPage,
    t,
  };
}

export function useCreateAccount(onSuccess: () => void) {
  const { t } = useTranslation("accounts");
  const [modalState, setModalState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const createAccount = async (data: CreateAccountRequest) => {
    // Client-side validation
    const errors = validateCreateAccountRequest(data, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});

    const result = await service.createAccount(data);

    if (result === "created") {
      setModalState({
        isSubmitting: false,
        status: { type: "success", message: t("addModal.messages.success") },
      });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else if (result === "name_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.nameExists") },
      });
    } else if (result === "email_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.emailExists") },
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

  return {
    createAccount,
    modalState,
    validationErrors,
    clearError,
    t,
  };
}

export function useUpdateAccount(onSuccess: () => void) {
  const { t } = useTranslation("accounts");
  const [modalState, setModalState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const updateAccount = async (
    accountId: string,
    data: UpdateAccountRequest
  ) => {
    // Client-side validation
    const errors = validateUpdateAccountRequest(data, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setModalState({
      isSubmitting: true,
      status: { type: "none", message: "" },
    });
    setValidationErrors({});

    const result = await service.updateAccount(accountId, data);

    if (result === "updated") {
      setModalState({
        isSubmitting: false,
        status: { type: "success", message: t("editModal.messages.success") },
      });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else if (result === "name_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.nameExists") },
      });
    } else if (result === "email_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.emailExists") },
      });
    } else if (result === "phone_exists") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.phoneExists") },
      });
    } else if (result === "validation_error") {
      setModalState({
        isSubmitting: false,
        status: { type: "error", message: t("errors.validationError") },
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

  return {
    updateAccount,
    modalState,
    validationErrors,
    clearError,
    t,
  };
}

export function useChangeAccountState(onSuccess: () => void) {
  const { t } = useTranslation("accounts");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeState = async (accountId: string, activate: boolean) => {
    setIsSubmitting(true);
    setError(null);

    const result = activate
      ? await service.activateAccount(accountId)
      : await service.deactivateAccount(accountId);

    if (result === "activated" || result === "deactivated") {
      setIsSubmitting(false);
      onSuccess();
    } else if (result === "validation_error") {
      setIsSubmitting(false);
      setError(t("errors.validationError"));
    } else {
      setIsSubmitting(false);
      setError(t("errors.stateChangeFailed"));
    }
  };

  return {
    changeState,
    isSubmitting,
    error,
    t,
  };
}
