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
import type { CreateAppRequest } from "../types";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              <Input
                id="key"
                className="col-span-3"
                value={formData.key}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, key: e.target.value }))
                }
                required
                pattern="^[a-zA-Z0-9-_]+$"
                title={t("addModal.form.keyPlaceholder")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("addModal.form.name")}
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
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
