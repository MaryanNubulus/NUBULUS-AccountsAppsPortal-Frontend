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
import { getAccount } from "../service";
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
  const {
    updateAccount,
    modalState,
    validationErrors,
    clearError,
    resetModal,
    t,
  } = useUpdateAccount(onSuccess);

  const [formData, setFormData] = useState<UpdateAccountRequest>({
    name: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    numberId: "",
  });

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load account full details when modal opens
  useEffect(() => {
    if (account && isOpen) {
      setIsLoadingDetails(true);
      getAccount(account.accountId).then((accountInfo) => {
        if (accountInfo) {
          setFormData({
            name: accountInfo.name,
            fullName: accountInfo.fullName,
            email: accountInfo.email,
            phone: accountInfo.phone,
            address: accountInfo.address,
            numberId: accountInfo.numberId,
          });
        }
        setIsLoadingDetails(false);
      });
    }
  }, [account, isOpen]);

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

  const handleChange = (field: keyof UpdateAccountRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (account) {
      await updateAccount(account.accountId, formData);
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

        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-muted-foreground">
              {t("editModal.loading") || "Cargando..."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Name */}
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
                  maxLength={100}
                  required
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">{t("editModal.form.fullName")}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder={t("editModal.form.fullNamePlaceholder")}
                  disabled={true}
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
                <Label htmlFor="email">{t("editModal.form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={t("editModal.form.emailPlaceholder")}
                  disabled={true}
                  className={validationErrors.email ? "border-red-500" : ""}
                  minLength={5}
                  maxLength={100}
                  required
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("editModal.form.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={t("editModal.form.phonePlaceholder")}
                  disabled={modalState.isSubmitting}
                  className={validationErrors.phone ? "border-red-500" : ""}
                  minLength={10}
                  maxLength={15}
                  required
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">{t("editModal.form.address")}</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder={t("editModal.form.addressPlaceholder")}
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
                <Label htmlFor="numberId">{t("editModal.form.numberId")}</Label>
                <Input
                  id="numberId"
                  type="text"
                  value={formData.numberId}
                  onChange={(e) => handleChange("numberId", e.target.value)}
                  placeholder={t("editModal.form.numberIdPlaceholder")}
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
                {t("editModal.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={modalState.isSubmitting}>
                {modalState.isSubmitting
                  ? t("editModal.buttons.updating")
                  : t("editModal.buttons.update")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
