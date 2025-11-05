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
import type { CreateUserRequest } from "../types";
import { useCreateUser } from "../viewmodel";

interface AddNewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddNewUserModal({
  open,
  onOpenChange,
  onSuccess,
}: AddNewUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
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
  } = useCreateUser(() => {
    onSuccess();
    onOpenChange(false);
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "User",
      });
      clearErrors();
    }
  }, [open, clearErrors]);

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearErrors();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("addModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("addModal.form.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("addModal.form.namePlaceholder")}
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
              <Label htmlFor="email">{t("addModal.form.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("addModal.form.emailPlaceholder")}
                required
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{t("addModal.form.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={t("addModal.form.phonePlaceholder")}
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
              <Label htmlFor="role">{t("addModal.form.role")}</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  handleInputChange("role", value as "Admin" | "User")
                }
              >
                <SelectTrigger
                  className={validationErrors.role ? "border-red-500" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">
                    {t("addModal.form.roleUser")}
                  </SelectItem>
                  <SelectItem value="Admin">
                    {t("addModal.form.roleAdmin")}
                  </SelectItem>
                </SelectContent>
              </Select>
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
              {t("addModal.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("addModal.submitting") : t("addModal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
