export interface GetAppsResponse {
  apps: AppInfoDTO[] | null;
}

export interface AppInfoDTO {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

export interface CreateAppRequest {
  key: string;
  name: string;
}

export interface ValidationErrors {
  key?: string;
  name?: string;
}

export function validateCreateAppRequest(
  data: CreateAppRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate key
  if (!data.key || data.key.trim().length === 0) {
    errors.key = t("addModal.validation.keyRequired");
  } else if (data.key.length < 5) {
    errors.key = t("addModal.validation.keyTooShort");
  } else if (data.key.length > 50) {
    errors.key = t("addModal.validation.keyTooLong");
  }

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.length < 2) {
    errors.name = t("addModal.validation.nameTooShort");
  } else if (data.name.length > 256) {
    errors.name = t("addModal.validation.nameTooLong");
  }

  return errors;
}

export interface UpdateAppRequest {
  name: string;
}

export interface UpdateValidationErrors {
  name?: string;
}

export function validateUpdateAppRequest(
  data: UpdateAppRequest,
  t: (key: string) => string
): UpdateValidationErrors {
  const errors: UpdateValidationErrors = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.length < 2) {
    errors.name = t("editModal.validation.nameTooShort");
  } else if (data.name.length > 256) {
    errors.name = t("editModal.validation.nameTooLong");
  }

  return errors;
}
