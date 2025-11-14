// EditAppModal.tsx - Modal for editing existing apps

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
import { useUpdateApp } from "../viewmodel";
import { getApp } from "../service";
import type { App, UpdateAppRequest } from "../types";

interface EditAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  app: App | null;
}

export function EditAppModal({
  isOpen,
  onClose,
  onSuccess,
  app,
}: EditAppModalProps) {
  const { updateApp, modalState, validationErrors, clearError, resetModal, t } =
    useUpdateApp(onSuccess);

  const [formData, setFormData] = useState<UpdateAppRequest>({
    name: "",
  });

  const [appKey, setAppKey] = useState("");

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load app full details when modal opens
  useEffect(() => {
    if (app && isOpen) {
      setIsLoadingDetails(true);
      getApp(app.id).then((appInfo) => {
        if (appInfo) {
          setAppKey(appInfo.key);
          setFormData({
            name: appInfo.name,
          });
        }
        setIsLoadingDetails(false);
      });
    }
  }, [app, isOpen]);

  // Reset form and modal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAppKey("");
      setFormData({
        name: "",
      });
      resetModal();
    }
  }, [isOpen, resetModal]);

  const handleChange = (field: keyof UpdateAppRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (app) {
      await updateApp(app.id, formData);
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
              {t("editModal.loading")}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Key (read-only) */}
              <div className="grid gap-2">
                <Label htmlFor="key">{t("editModal.form.key")}</Label>
                <Input
                  id="key"
                  type="text"
                  value={appKey}
                  disabled={true}
                  className="bg-muted cursor-not-allowed"
                />
              </div>

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
                  minLength={3}
                  maxLength={100}
                  required
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
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
