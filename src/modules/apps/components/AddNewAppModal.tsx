// AddNewAppModal.tsx - Modal for creating new apps

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateApp } from "../viewmodel";
import type { CreateAppRequest } from "../types";

interface AddNewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddNewAppModal({
  isOpen,
  onClose,
  onSuccess,
}: AddNewAppModalProps) {
  const { createApp, modalState, validationErrors, clearError, resetModal, t } =
    useCreateApp(onSuccess);

  const [formData, setFormData] = useState<CreateAppRequest>({
    key: "",
    name: "",
  });

  // Reset form and modal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        key: "",
        name: "",
      });
      resetModal();
    }
  }, [isOpen, resetModal]);

  const handleChange = (field: keyof CreateAppRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createApp(formData);
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
            {/* Key */}
            <div className="grid gap-2">
              <Label htmlFor="key">{t("addModal.form.key")}</Label>
              <Input
                id="key"
                type="text"
                value={formData.key}
                onChange={(e) => handleChange("key", e.target.value)}
                placeholder={t("addModal.form.keyPlaceholder")}
                disabled={modalState.isSubmitting}
                className={validationErrors.key ? "border-red-500" : ""}
                minLength={3}
                maxLength={100}
                pattern="[a-zA-Z0-9\-]+"
                required
              />
              {validationErrors.key && (
                <p className="text-sm text-red-500">{validationErrors.key}</p>
              )}
            </div>

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
                minLength={3}
                maxLength={100}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>
          </div>

          {/* Status message */}
          {modalState.status.type !== "none" && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                modalState.status.type === "error"
                  ? "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200"
                  : "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200"
              }`}
            >
              {modalState.status.message}
            </div>
          )}

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
