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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UpdateUserRequest } from "../types";
import { useUpdateUser } from "../viewmodel";

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
    name: "",
    email: "",
    phone: "",
    role: "User",
  });

  const {
    handleSubmit,
    isSubmitting,
    status,
    validationErrors,
    clearErrors,
    t,
  } = useUpdateUser(() => {
    onSuccess();
    onOpenChange(false);
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
      clearErrors();
    }
  }, [open, user, clearErrors]);

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearErrors();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      handleSubmit(user.id, formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("editModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("editModal.form.name")}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("editModal.form.namePlaceholder")}
                required
                minLength={2}
                maxLength={256}
                className={validationErrors.name ? "border-red-500" : ""}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
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
                minLength={7}
                maxLength={15}
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">{t("editModal.form.role")}</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  handleInputChange("role", value as "Admin" | "User")
                }
                disabled={user?.role === "Owner"}
              >
                <SelectTrigger
                  className={validationErrors.role ? "border-red-500" : ""}
                  disabled={user?.role === "Owner"}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">
                    {t("editModal.form.roleUser")}
                  </SelectItem>
                  <SelectItem value="Admin">
                    {t("editModal.form.roleAdmin")}
                  </SelectItem>
                  {user?.role === "Owner" && (
                    <SelectItem value="Owner">
                      {t("editModal.form.roleOwner")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {user?.role === "Owner" && (
                <p className="text-sm text-muted-foreground">
                  {t("editModal.form.roleOwnerNote")}
                </p>
              )}
              {validationErrors.role && (
                <p className="text-sm text-red-500">{validationErrors.role}</p>
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
