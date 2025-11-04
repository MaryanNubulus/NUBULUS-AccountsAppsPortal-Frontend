// EditAccountModal.tsx - Modal for editing existing accounts

import { useState, useEffect } from "react";
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
import { useUpdateAccount } from "../viewmodel";
import type { Account, UpdateAccountRequest } from "../types";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: Account | null;
}

export function EditAccountModal({
  isOpen,
  onClose,
  onSuccess,
  account,
}: EditAccountModalProps) {
  const { updateAccount, modalState, validationErrors, clearError, t } =
    useUpdateAccount(onSuccess);

  const [formData, setFormData] = useState<UpdateAccountRequest>({
    name: "",
    userName: "",
    userEmail: "",
    userPhone: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        userName: account.userName,
        userEmail: account.userEmail,
        userPhone: account.userPhone,
      });
    }
  }, [account]);

  const handleChange = (field: keyof UpdateAccountRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (account) {
      await updateAccount(account.id, formData);
    }
  };

  const handleClose = () => {
    if (!modalState.isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("editModal.title")}</DialogTitle>
          <DialogDescription>{t("editModal.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Account Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">{t("editModal.form.name")}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("editModal.form.namePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.name ? "border-red-500" : ""}
                minLength={2}
                maxLength={256}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* User Name */}
            <div className="grid gap-2">
              <Label htmlFor="userName">{t("editModal.form.userName")}</Label>
              <Input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder={t("editModal.form.userNamePlaceholder")}
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
              <Label htmlFor="userEmail">{t("editModal.form.userEmail")}</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleChange("userEmail", e.target.value)}
                placeholder={t("editModal.form.userEmailPlaceholder")}
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
              <Label htmlFor="userPhone">{t("editModal.form.userPhone")}</Label>
              <Input
                id="userPhone"
                type="tel"
                value={formData.userPhone}
                onChange={(e) => handleChange("userPhone", e.target.value)}
                placeholder={t("editModal.form.userPhonePlaceholder")}
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
              {t("editModal.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={modalState.isSubmitting}>
              {modalState.isSubmitting
                ? t("editModal.buttons.updating")
                : t("editModal.buttons.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
