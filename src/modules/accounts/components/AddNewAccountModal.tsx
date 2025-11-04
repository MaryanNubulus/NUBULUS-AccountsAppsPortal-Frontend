// AddNewAccountModal.tsx - Modal for creating new accounts

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useCreateAccount } from "../viewmodel";
import type { CreateAccountRequest } from "../types";

interface AddNewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddNewAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: AddNewAccountModalProps) {
  const { createAccount, modalState, validationErrors, clearError, t } =
    useCreateAccount(onSuccess);

  const [formData, setFormData] = useState<CreateAccountRequest>({
    accountName: "",
    userName: "",
    userEmail: "",
    userPhone: "",
  });

  const handleChange = (field: keyof CreateAccountRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(formData);
  };

  const handleClose = () => {
    if (!modalState.isSubmitting) {
      setFormData({
        accountName: "",
        userName: "",
        userEmail: "",
        userPhone: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("addModal.title")}</DialogTitle>
          <DialogDescription>{t("addModal.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Account Name */}
            <div className="grid gap-2">
              <Label htmlFor="accountName">
                {t("addModal.form.accountName")}
              </Label>
              <Input
                id="accountName"
                type="text"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                placeholder={t("addModal.form.accountNamePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.accountName ? "border-red-500" : ""}
                minLength={2}
                maxLength={256}
                required
              />
              {validationErrors.accountName && (
                <p className="text-sm text-red-500">
                  {validationErrors.accountName}
                </p>
              )}
            </div>

            {/* User Name */}
            <div className="grid gap-2">
              <Label htmlFor="userName">{t("addModal.form.userName")}</Label>
              <Input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder={t("addModal.form.userNamePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.userName ? "border-red-500" : ""}
                minLength={2}
                maxLength={256}
                required
              />
              {validationErrors.userName && (
                <p className="text-sm text-red-500">
                  {validationErrors.userName}
                </p>
              )}
            </div>

            {/* User Email */}
            <div className="grid gap-2">
              <Label htmlFor="userEmail">{t("addModal.form.userEmail")}</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleChange("userEmail", e.target.value)}
                placeholder={t("addModal.form.userEmailPlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.userEmail ? "border-red-500" : ""}
                required
              />
              {validationErrors.userEmail && (
                <p className="text-sm text-red-500">
                  {validationErrors.userEmail}
                </p>
              )}
            </div>

            {/* User Phone */}
            <div className="grid gap-2">
              <Label htmlFor="userPhone">{t("addModal.form.userPhone")}</Label>
              <Input
                id="userPhone"
                type="tel"
                value={formData.userPhone}
                onChange={(e) => handleChange("userPhone", e.target.value)}
                placeholder={t("addModal.form.userPhonePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.userPhone ? "border-red-500" : ""}
                minLength={7}
                maxLength={15}
                required
              />
              {validationErrors.userPhone && (
                <p className="text-sm text-red-500">
                  {validationErrors.userPhone}
                </p>
              )}
            </div>

            {/* Status Messages */}
            {modalState.status.type !== "none" && (
              <div
                className={`p-3 rounded-md text-sm ${
                  modalState.status.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {modalState.status.message}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={modalState.isSubmitting}
            >
              {t("addModal.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={modalState.isSubmitting}>
              {modalState.isSubmitting
                ? t("addModal.buttons.creating")
                : t("addModal.buttons.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
