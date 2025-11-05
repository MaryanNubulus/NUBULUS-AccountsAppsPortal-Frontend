export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: "Owner" | "Admin" | "User";
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "User";
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: "Owner" | "Admin" | "User";
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export function validateCreateUserRequest(
  data: CreateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("addModal.validation.nameMinLength");
  } else if (data.name.trim().length > 256) {
    errors.name = t("addModal.validation.nameMaxLength");
  }

  // Validar email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("addModal.validation.emailRequired");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = t("addModal.validation.emailInvalid");
    }
  }

  // Validar phone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("addModal.validation.phoneRequired");
  } else if (data.phone.trim().length < 7) {
    errors.phone = t("addModal.validation.phoneMinLength");
  } else if (data.phone.trim().length > 15) {
    errors.phone = t("addModal.validation.phoneMaxLength");
  }

  // Validar role
  if (!data.role) {
    errors.role = t("addModal.validation.roleRequired");
  } else if (data.role !== "Admin" && data.role !== "User") {
    errors.role = t("addModal.validation.roleInvalid");
  }

  return errors;
}

export function validateUpdateUserRequest(
  data: UpdateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("editModal.validation.nameMinLength");
  } else if (data.name.trim().length > 256) {
    errors.name = t("editModal.validation.nameMaxLength");
  }

  // Validar email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("editModal.validation.emailRequired");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = t("editModal.validation.emailInvalid");
    }
  }

  // Validar phone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("editModal.validation.phoneRequired");
  } else if (data.phone.trim().length < 7) {
    errors.phone = t("editModal.validation.phoneMinLength");
  } else if (data.phone.trim().length > 15) {
    errors.phone = t("editModal.validation.phoneMaxLength");
  }

  // Validar role
  if (!data.role) {
    errors.role = t("editModal.validation.roleRequired");
  } else if (
    data.role !== "Owner" &&
    data.role !== "Admin" &&
    data.role !== "User"
  ) {
    errors.role = t("editModal.validation.roleInvalid");
  }

  return errors;
}
