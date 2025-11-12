export interface User {
  userId: number;
  name: string;
  email: string;
  status: string; // "A" = Active, "I" = Inactive
  isCreator: boolean; // True si és el creador de l'Account
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
}

export interface PaginatedUsersResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: User[];
}

export interface ValidationErrors {
  name?: string;
  email?: string;
}

export function validateCreateUserRequest(
  data: CreateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar name: entre 2 i 100 caràcters
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("addModal.validation.nameMinLength");
  } else if (data.name.trim().length > 100) {
    errors.name = t("addModal.validation.nameMaxLength");
  }

  // Validar email: entre 5 i 100 caràcters, format vàlid
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("addModal.validation.emailRequired");
  } else if (data.email.trim().length < 5) {
    errors.email = t("addModal.validation.emailMinLength");
  } else if (data.email.trim().length > 100) {
    errors.email = t("addModal.validation.emailMaxLength");
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = t("addModal.validation.emailInvalid");
    }
  }

  return errors;
}

export function validateUpdateUserRequest(
  data: UpdateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar name: entre 2 i 100 caràcters
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("editModal.validation.nameMinLength");
  } else if (data.name.trim().length > 100) {
    errors.name = t("editModal.validation.nameMaxLength");
  }

  // Validar email: entre 5 i 100 caràcters, format vàlid
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("editModal.validation.emailRequired");
  } else if (data.email.trim().length < 5) {
    errors.email = t("editModal.validation.emailMinLength");
  } else if (data.email.trim().length > 100) {
    errors.email = t("editModal.validation.emailMaxLength");
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = t("editModal.validation.emailInvalid");
    }
  }

  return errors;
}
