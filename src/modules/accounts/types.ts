// types.ts - Account module types and validation

import type { PaginatedRequest, PaginatedResponse } from "../shared/types";

export type { PaginatedRequest, PaginatedResponse };

export interface Account {
  accountId: number; // ID numérico único (del backend)
  name: string; // Nombre de la cuenta
  fullName: string; // Nombre completo del creador (JOIN con users)
  email: string; // Email de la cuenta
  phone: string; // Teléfono
  numberId: string; // Número de identificación (CIF/NIF)
  status: string; // "A" = Active, "I" = Inactive
}

export interface CreateAccountRequest {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  numberId: string;
}

export interface UpdateAccountRequest {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  numberId: string;
}

export interface ValidationErrors {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  numberId?: string;
}

// Validation functions
export function validateCreateAccountRequest(
  data: CreateAccountRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name (2-100 characters)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("addModal.validation.nameMinLength");
  } else if (data.name.length > 100) {
    errors.name = t("addModal.validation.nameMaxLength");
  }

  // Validate fullName (optional, but if provided should be reasonable)
  if (data.fullName && data.fullName.length > 200) {
    errors.fullName = t("addModal.validation.fullNameMaxLength");
  }

  // Validate email (5-100 characters, valid format)
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("addModal.validation.emailRequired");
  } else if (data.email.length < 5 || data.email.length > 100) {
    errors.email = t("addModal.validation.emailLength");
  } else if (!emailPattern.test(data.email)) {
    errors.email = t("addModal.validation.emailInvalid");
  }

  // Validate phone (10-15 characters, numeric with optional +)
  const phonePattern = /^\+?[0-9]{10,15}$/;
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("addModal.validation.phoneRequired");
  } else if (data.phone.length < 10 || data.phone.length > 15) {
    errors.phone = t("addModal.validation.phoneLength");
  } else if (!phonePattern.test(data.phone)) {
    errors.phone = t("addModal.validation.phoneInvalid");
  }

  // Validate address (5-200 characters)
  if (!data.address || data.address.trim().length === 0) {
    errors.address = t("addModal.validation.addressRequired");
  } else if (data.address.length < 5 || data.address.length > 200) {
    errors.address = t("addModal.validation.addressLength");
  }

  // Validate numberId (5-50 characters)
  if (!data.numberId || data.numberId.trim().length === 0) {
    errors.numberId = t("addModal.validation.numberIdRequired");
  } else if (data.numberId.length < 5 || data.numberId.length > 50) {
    errors.numberId = t("addModal.validation.numberIdLength");
  }

  return errors;
}

export function validateUpdateAccountRequest(
  data: UpdateAccountRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name (2-100 characters)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("editModal.validation.nameMinLength");
  } else if (data.name.length > 100) {
    errors.name = t("editModal.validation.nameMaxLength");
  }

  // Validate fullName (optional, but if provided should be reasonable)
  if (data.fullName && data.fullName.length > 200) {
    errors.fullName = t("editModal.validation.fullNameMaxLength");
  }

  // Validate email (5-100 characters, valid format)
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("editModal.validation.emailRequired");
  } else if (data.email.length < 5 || data.email.length > 100) {
    errors.email = t("editModal.validation.emailLength");
  } else if (!emailPattern.test(data.email)) {
    errors.email = t("editModal.validation.emailInvalid");
  }

  // Validate phone (10-15 characters, numeric with optional +)
  const phonePattern = /^\+?[0-9]{10,15}$/;
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = t("editModal.validation.phoneRequired");
  } else if (data.phone.length < 10 || data.phone.length > 15) {
    errors.phone = t("editModal.validation.phoneLength");
  } else if (!phonePattern.test(data.phone)) {
    errors.phone = t("editModal.validation.phoneInvalid");
  }

  // Validate address (5-200 characters)
  if (!data.address || data.address.trim().length === 0) {
    errors.address = t("editModal.validation.addressRequired");
  } else if (data.address.length < 5 || data.address.length > 200) {
    errors.address = t("editModal.validation.addressLength");
  }

  // Validate numberId (5-50 characters)
  if (!data.numberId || data.numberId.trim().length === 0) {
    errors.numberId = t("editModal.validation.numberIdRequired");
  } else if (data.numberId.length < 5 || data.numberId.length > 50) {
    errors.numberId = t("editModal.validation.numberIdLength");
  }

  return errors;
}
