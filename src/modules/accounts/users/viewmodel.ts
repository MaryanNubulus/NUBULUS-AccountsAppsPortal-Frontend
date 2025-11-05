import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  ValidationErrors,
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

  const loadUsers = useCallback(async () => {
    if (!accountId) return;

    setIsLoading(true);
    const data = await userService.getAllUsers(accountId);
    setUsers(data);
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    reload: loadUsers,
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
      } else if (result === "email_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.emailExists") },
        });
      } else if (result === "phone_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.phoneExists") },
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
      } else if (result === "email_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.emailExists") },
        });
      } else if (result === "phone_exists") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.phoneExists") },
        });
      } else if (result === "not_found") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.userNotFound") },
        });
      } else if (result === "cannot_modify_owner") {
        setState({
          isSubmitting: false,
          status: { type: "error", message: t("errors.cannotModifyOwner") },
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
    async (userId: string, shouldActivate: boolean) => {
      if (!accountId) return;

      setIsSubmitting(true);
      setError("");

      const result = shouldActivate
        ? await userService.activateUser(accountId, userId)
        : await userService.deactivateUser(accountId, userId);

      if (result === "activated" || result === "deactivated") {
        setIsSubmitting(false);
        onSuccess();
      } else if (result === "not_found") {
        setIsSubmitting(false);
        setError(t("errors.userNotFound"));
      } else if (
        result === "cannot_activate_owner" ||
        result === "cannot_deactivate_owner"
      ) {
        setIsSubmitting(false);
        setError(t("errors.cannotModifyOwner"));
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
