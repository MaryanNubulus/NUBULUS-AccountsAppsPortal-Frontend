// types.ts - Account module types and validation

export interface Account {
  id: string;
  name: string;
  isActive: boolean;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface CreateAccountRequest {
  accountName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface UpdateAccountRequest {
  name: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface ValidationErrors {
  accountName?: string;
  name?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

// Validation functions
export function validateCreateAccountRequest(
  data: CreateAccountRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate accountName
  if (!data.accountName || data.accountName.trim().length === 0) {
    errors.accountName = t("addModal.validation.accountNameRequired");
  } else if (data.accountName.trim().length < 2) {
    errors.accountName = t("addModal.validation.accountNameMinLength");
  } else if (data.accountName.length > 256) {
    errors.accountName = t("addModal.validation.accountNameMaxLength");
  }

  // Validate userName
  if (!data.userName || data.userName.trim().length === 0) {
    errors.userName = t("addModal.validation.userNameRequired");
  } else if (data.userName.trim().length < 2) {
    errors.userName = t("addModal.validation.userNameMinLength");
  } else if (data.userName.length > 256) {
    errors.userName = t("addModal.validation.userNameMaxLength");
  }

  // Validate userEmail
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.userEmail || data.userEmail.trim().length === 0) {
    errors.userEmail = t("addModal.validation.userEmailRequired");
  } else if (!emailPattern.test(data.userEmail)) {
    errors.userEmail = t("addModal.validation.userEmailInvalid");
  }

  // Validate userPhone
  if (!data.userPhone || data.userPhone.trim().length === 0) {
    errors.userPhone = t("addModal.validation.userPhoneRequired");
  } else if (data.userPhone.trim().length < 7) {
    errors.userPhone = t("addModal.validation.userPhoneMinLength");
  } else if (data.userPhone.length > 15) {
    errors.userPhone = t("addModal.validation.userPhoneMaxLength");
  }

  return errors;
}

export function validateUpdateAccountRequest(
  data: UpdateAccountRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("editModal.validation.nameRequired");
  } else if (data.name.trim().length < 2) {
    errors.name = t("editModal.validation.nameMinLength");
  } else if (data.name.length > 256) {
    errors.name = t("editModal.validation.nameMaxLength");
  }

  // Validate userName
  if (!data.userName || data.userName.trim().length === 0) {
    errors.userName = t("editModal.validation.userNameRequired");
  } else if (data.userName.trim().length < 2) {
    errors.userName = t("editModal.validation.userNameMinLength");
  } else if (data.userName.length > 256) {
    errors.userName = t("editModal.validation.userNameMaxLength");
  }

  // Validate userEmail
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.userEmail || data.userEmail.trim().length === 0) {
    errors.userEmail = t("editModal.validation.userEmailRequired");
  } else if (!emailPattern.test(data.userEmail)) {
    errors.userEmail = t("editModal.validation.userEmailInvalid");
  }

  // Validate userPhone
  if (!data.userPhone || data.userPhone.trim().length === 0) {
    errors.userPhone = t("editModal.validation.userPhoneRequired");
  } else if (data.userPhone.trim().length < 7) {
    errors.userPhone = t("editModal.validation.userPhoneMinLength");
  } else if (data.userPhone.length > 15) {
    errors.userPhone = t("editModal.validation.userPhoneMaxLength");
  }

  return errors;
}
