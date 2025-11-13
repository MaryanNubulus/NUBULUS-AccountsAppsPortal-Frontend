import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserToShare,
  ValidationErrors,
  PaginatedUsersResponse,
} from "./types";
import { validateCreateUserRequest, validateUpdateUserRequest } from "./types";
import * as userService from "./service";

interface ModalState {
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}

export function useUsers() {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const loadUsers = useCallback(
    async (page: number = 1, search: string = "") => {
      if (!accountId) return;

      setIsLoading(true);
      const data: PaginatedUsersResponse = await userService.getUsers(
        accountId,
        search || undefined,
        page,
        pageSize
      );
      setUsers(data.items);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
      setIsLoading(false);
    },
    [accountId]
  );

  useEffect(() => {
    loadUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm, loadUsers]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    loadUsers(1, searchTerm);
  };

  return {
    users,
    isLoading,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    searchTerm,
    setSearchTerm: search,
    reload: () => loadUsers(1, ""),
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    t,
  };
}

export function useCreateUser(onSuccess: () => void) {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [state, setState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = useCallback(
    async (data: CreateUserRequest) => {
      if (!accountId) return;

      const errors = validateCreateUserRequest(data, t);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setState({ isSubmitting: true, status: { type: "none", message: "" } });
      setValidationErrors({});

      const result = await userService.createUser(accountId, data);

      if (result === "created") {
        setState({
          isSubmitting: false,
          status: { type: "success", message: t("addModal.messages.success") },
        });
        setTimeout(onSuccess, 1000);
      } else if (result === "user_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.userExists") },
        });
      } else if (result === "account_not_found") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.accountNotFound") },
        });
      } else {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("addModal.messages.error") },
        });
      }
    },
    [accountId, t, onSuccess]
  );

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    handleSubmit,
    isSubmitting: state.isSubmitting,
    status: state.status,
    validationErrors,
    clearErrors,
    t,
  };
}

export function useUpdateUser(onSuccess: () => void) {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [state, setState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = useCallback(
    async (userId: string, data: UpdateUserRequest) => {
      if (!accountId) return;

      const errors = validateUpdateUserRequest(data, t);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setState({ isSubmitting: true, status: { type: "none", message: "" } });
      setValidationErrors({});

      const result = await userService.updateUser(accountId, userId, data);

      if (result === "updated") {
        setState({
          isSubmitting: false,
          status: {
            type: "success",
            message: t("editModal.messages.success"),
          },
        });
        setTimeout(onSuccess, 1000);
      } else if (result === "user_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.userExists") },
        });
      } else if (result === "not_found") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.userNotFound") },
        });
      } else {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("editModal.messages.error") },
        });
      }
    },
    [accountId, t, onSuccess]
  );

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    handleSubmit,
    isSubmitting: state.isSubmitting,
    status: state.status,
    validationErrors,
    clearErrors,
    t,
  };
}

export function useChangeUserState(onSuccess: () => void) {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChangeState = useCallback(
    async (userId: string, shouldResume: boolean) => {
      if (!accountId) return;

      setIsSubmitting(true);
      setError("");

      const result = shouldResume
        ? await userService.resumeUser(accountId, userId)
        : await userService.pauseUser(accountId, userId);

      if (result === "resumed" || result === "paused") {
        setIsSubmitting(false);
        onSuccess();
      } else if (result === "not_found") {
        setIsSubmitting(false);
        setError(t("errors.userNotFound"));
      } else {
        setIsSubmitting(false);
        setError(t("errors.changeStateFailed"));
      }
    },
    [accountId, t, onSuccess]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    handleChangeState,
    isSubmitting,
    error,
    clearError,
    t,
  };
}

export function useGetSharedUsers() {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [sharedUsers, setSharedUsers] = useState<UserToShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSharedUsers = useCallback(
    async (page: number = 1, search: string = "") => {
      if (!accountId) return;

      setIsLoading(true);
      const data = await userService.getSharedUsers(
        accountId,
        search || undefined,
        page,
        pageSize
      );
      setSharedUsers(data.items);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
      setIsLoading(false);
    },
    [accountId, pageSize]
  );

  useEffect(() => {
    loadSharedUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm, loadSharedUsers]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    loadSharedUsers(1, searchTerm);
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    sharedUsers,
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    searchTerm,
    setSearchTerm: search,
    nextPage,
    previousPage,
    goToPage,
    changePageSize,
    reload: () => loadSharedUsers(currentPage, searchTerm),
    t,
  };
}

export function useGetUsersToShare() {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [availableUsers, setAvailableUsers] = useState<UserToShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const loadUsersToShare = useCallback(
    async (page: number = 1, search: string = "") => {
      if (!accountId) return;

      setIsLoading(true);
      const data = await userService.getUsersToShare(
        accountId,
        search || undefined,
        page,
        pageSize
      );
      setAvailableUsers(data.items);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
      setIsLoading(false);
      setHasSearched(true);
    },
    [accountId, pageSize]
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadUsersToShare(page, searchTerm);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const search = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadUsersToShare(1, term);
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    loadUsersToShare(1, searchTerm);
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    availableUsers,
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    searchTerm,
    setSearchTerm: search,
    nextPage,
    previousPage,
    goToPage,
    changePageSize,
    hasSearched,
    load: loadUsersToShare,
    t,
  };
}

export function useShareUser(onSuccess: () => void) {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleShare = useCallback(
    async (userId: string) => {
      if (!accountId) return;

      setIsSubmitting(true);
      setError("");

      const result = await userService.shareUser(accountId, userId);

      if (result === "shared") {
        setIsSubmitting(false);
        onSuccess();
      } else if (result === "not_found") {
        setIsSubmitting(false);
        setError(t("errors.userNotFound"));
      } else if (result === "already_shared") {
        setIsSubmitting(false);
        setError(t("errors.userAlreadyShared"));
      } else {
        setIsSubmitting(false);
        setError(t("errors.shareUserFailed"));
      }
    },
    [accountId, t, onSuccess]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    handleShare,
    isSubmitting,
    error,
    clearError,
    t,
  };
}

export function useUnshareUser(onSuccess: () => void) {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useTranslation("users");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUnshare = useCallback(
    async (userId: string) => {
      if (!accountId) return;

      setIsSubmitting(true);
      setError("");

      const result = await userService.unshareUser(accountId, userId);

      if (result === "unshared") {
        setIsSubmitting(false);
        onSuccess();
      } else if (result === "not_found") {
        setIsSubmitting(false);
        setError(t("errors.userNotFound"));
      } else if (result === "cannot_unshare_creator") {
        setIsSubmitting(false);
        setError(t("errors.cannotUnshareCreator"));
      } else {
        setIsSubmitting(false);
        setError(t("errors.unshareUserFailed"));
      }
    },
    [accountId, t, onSuccess]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    handleUnshare,
    isSubmitting,
    error,
    clearError,
    t,
  };
}
