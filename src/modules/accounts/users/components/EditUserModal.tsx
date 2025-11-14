import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, UpdateUserRequest } from "../types";
import { useUpdateUser, useFetchUserInfo } from "../viewmodel";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: User | null;
}

export function EditUserModal({
  open,
  onOpenChange,
  onSuccess,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    fullName: "",
    email: "",
    phone: "",
  });

  const { user: fetchedUser, fetchUser } = useFetchUserInfo();

  const {
    handleSubmit,
    isSubmitting,
    status,
    validationErrors,
    clearErrors,
    clearStatus,
    t,
  } = useUpdateUser(() => {
    onSuccess();
    onOpenChange(false);
  });

  useEffect(() => {
    if (open && user) {
      fetchUser(user.userId.toString());
    }
  }, [open, user, fetchUser]);

  useEffect(() => {
    if (fetchedUser) {
      setFormData({
        fullName: fetchedUser.fullName,
        email: fetchedUser.email,
        phone: fetchedUser.phone,
      });
      clearErrors();
      clearStatus();
    }
  }, [fetchedUser, clearErrors, clearStatus]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      clearErrors();
      clearStatus();
      setFormData({
        fullName: "",
        email: "",
        phone: "",
      });
    }
  };

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearErrors();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      handleSubmit(user.userId.toString(), formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("editModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-fullName">{t("editModal.form.name")}</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder={t("editModal.form.namePlaceholder")}
                required
                minLength={2}
                maxLength={100}
                className={validationErrors.fullName ? "border-red-500" : ""}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">{t("editModal.form.email")}</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("editModal.form.emailPlaceholder")}
                required
                minLength={5}
                maxLength={100}
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">{t("editModal.form.phone")}</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={t("editModal.form.phonePlaceholder")}
                required
                maxLength={15}
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            {status.type === "error" && (
              <div className="rounded-md bg-red-50 dark:bg-red-950 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {status.message}
                </p>
              </div>
            )}

            {status.type === "success" && (
              <div className="rounded-md bg-green-50 dark:bg-green-950 p-3">
                <p className="text-sm text-green-600 dark:text-green-400">
                  {status.message}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("editModal.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("editModal.submitting") : t("editModal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
