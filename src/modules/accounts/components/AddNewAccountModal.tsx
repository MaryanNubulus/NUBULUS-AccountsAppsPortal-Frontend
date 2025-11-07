// AddNewAccountModal.tsx - Modal for creating new accounts

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
  const {
    createAccount,
    modalState,
    validationErrors,
    clearError,
    resetModal,
    t,
  } = useCreateAccount(onSuccess);

  const [formData, setFormData] = useState<CreateAccountRequest>({
    name: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    numberId: "",
  });

  // Reset form and modal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        numberId: "",
      });
      resetModal();
    }
  }, [isOpen, resetModal]);

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
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">{t("addModal.form.name")}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("addModal.form.namePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.name ? "border-red-500" : ""}
                minLength={2}
                maxLength={100}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">{t("addModal.form.fullName")}</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder={t("addModal.form.fullNamePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.fullName ? "border-red-500" : ""}
                maxLength={200}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">{t("addModal.form.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t("addModal.form.emailPlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.email ? "border-red-500" : ""}
                minLength={5}
                maxLength={100}
                required
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("addModal.form.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={t("addModal.form.phonePlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.phone ? "border-red-500" : ""}
                minLength={10}
                maxLength={15}
                required
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">{t("addModal.form.address")}</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder={t("addModal.form.addressPlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.address ? "border-red-500" : ""}
                minLength={5}
                maxLength={200}
                required
              />
              {validationErrors.address && (
                <p className="text-sm text-red-500">
                  {validationErrors.address}
                </p>
              )}
            </div>

            {/* Number ID */}
            <div className="grid gap-2">
              <Label htmlFor="numberId">{t("addModal.form.numberId")}</Label>
              <Input
                id="numberId"
                type="text"
                value={formData.numberId}
                onChange={(e) => handleChange("numberId", e.target.value)}
                placeholder={t("addModal.form.numberIdPlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.numberId ? "border-red-500" : ""}
                minLength={5}
                maxLength={50}
                required
              />
              {validationErrors.numberId && (
                <p className="text-sm text-red-500">
                  {validationErrors.numberId}
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
