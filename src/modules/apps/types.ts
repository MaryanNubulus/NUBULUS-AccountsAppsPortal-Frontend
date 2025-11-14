// types.ts - App module types and validation

import type { PaginatedRequest, PaginatedResponse } from "../shared/types";

export type { PaginatedRequest, PaginatedResponse };

export interface App {
  id: number; // ID numérico único
  key: string; // Clave única de la app
  name: string; // Nombre de la aplicación
  status: string; // "A" = Active, "I" = Inactive
}

export interface CreateAppRequest {
  key: string;
  name: string;
}

export interface UpdateAppRequest {
  name: string;
}

export interface ValidationErrors {
  key?: string;
  name?: string;
}

// Validation functions
export function validateCreateAppRequest(
  data: CreateAppRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate key (3-100 characters, only letters, numbers, hyphens)
  if (!data.key || data.key.trim().length === 0) {
    errors.key = t("addModal.validation.keyRequired");
  } else if (data.key.trim().length < 3) {
    errors.key = t("addModal.validation.keyMinLength");
  } else if (data.key.length > 100) {
    errors.key = t("addModal.validation.keyMaxLength");
  } else {
    // Only letters, numbers, hyphens - no spaces or special characters
    const keyPattern = /^[a-zA-Z0-9\-]+$/;
    if (!keyPattern.test(data.key)) {
      errors.key = t("addModal.validation.keyInvalid");
    }
  }

  // Validate name (3-100 characters)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.trim().length < 3) {
    errors.name = t("addModal.validation.nameMinLength");
  } else if (data.name.length > 100) {
    errors.name = t("addModal.validation.nameMaxLength");
  }

  return errors;
}

export function validateUpdateAppRequest(
  data: UpdateAppRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name (3-100 characters)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.trim().length < 3) {
    errors.name = t("editModal.validation.nameMinLength");
  } else if (data.name.length > 100) {
    errors.name = t("editModal.validation.nameMaxLength");
  }

  return errors;
}
