import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import type { CreateAppRequest, ValidationErrors } from "../types";
import { validateCreateAppRequest } from "../types";

interface AddNewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAppRequest) => void;
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}

export function AddNewAppModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  status,
}: AddNewAppModalProps) {
  const { t } = useTranslation("apps");
  const [formData, setFormData] = useState<CreateAppRequest>({
    key: "",
    name: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateCreateAppRequest(formData, t);
    setValidationErrors(errors);

    // Only submit if no errors
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("addModal.title")}</DialogTitle>
            <DialogDescription>{t("addModal.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                {t("addModal.form.key")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, key: e.target.value }));
                    // Clear error when user starts typing
                    if (validationErrors.key) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        key: undefined,
                      }));
                    }
                  }}
                  required
                  pattern="^[a-zA-Z0-9-_]+$"
                  title={t("addModal.form.keyPlaceholder")}
                  className={validationErrors.key ? "border-red-500" : ""}
                  minLength={5}
                  maxLength={50}
                />
                {validationErrors.key && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.key}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("addModal.form.name")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    // Clear error when user starts typing
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        name: undefined,
                      }));
                    }
                  }}
                  required
                  className={validationErrors.name ? "border-red-500" : ""}
                  minLength={2}
                  maxLength={256}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          {status.message && (
            <div
              className={`mb-4 p-2 text-sm rounded ${
                status.type === "error"
                  ? "bg-red-100 text-red-700"
                  : status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : ""
              }`}
            >
              {status.message}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("addModal.form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("addModal.form.creating")
                : t("addModal.form.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
