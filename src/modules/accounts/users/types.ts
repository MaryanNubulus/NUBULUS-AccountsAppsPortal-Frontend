export interface User {
  userId: number;
  userKey: string;
  fullName: string;
  email: string;
  phone: string;
  status: string; // "A" = Active, "I" = Inactive
  isCreator: boolean; // True si és el creador de l'Account
}

export interface UserToShare {
  userId: number;
  fullName: string;
  email: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phone: string;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phone: string;
}

export interface PaginatedUsersResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: User[];
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export function validateCreateUserRequest(
  data: CreateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar fullName: entre 2 i 100 caràcters
  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.fullName = t("addModal.validation.nameRequired");
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = t("addModal.validation.nameMinLength");
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = t("addModal.validation.nameMaxLength");
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

  // Validar phone: requereix i màxim 15 caràcters
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("addModal.validation.phoneRequired");
  } else if (data.phone.trim().length > 15) {
    errors.phone = t("addModal.validation.phoneMaxLength");
  }

  return errors;
}

export function validateUpdateUserRequest(
  data: UpdateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar fullName: entre 2 i 100 caràcters
  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.fullName = t("editModal.validation.nameRequired");
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = t("editModal.validation.nameMinLength");
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = t("editModal.validation.nameMaxLength");
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

  // Validar phone: requereix i màxim 15 caràcters
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("editModal.validation.phoneRequired");
  } else if (data.phone.trim().length > 15) {
    errors.phone = t("editModal.validation.phoneMaxLength");
  }

  return errors;
}
