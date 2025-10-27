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
import { useTranslation } from "react-i18next";
import type { AppInfoDTO } from "../types";
import { useEffect, useState } from "react";

interface EditAppModalProps {
  app: AppInfoDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appId: string, name: string) => Promise<"success" | "failed">;
  isSubmitting?: boolean;
  status?: {
    type: "none" | "error" | "success";
    message: string;
  };
}

export function EditAppModal({
  app,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  status = { type: "none", message: "" },
}: EditAppModalProps) {
  const { t } = useTranslation("apps");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app) return;
    await onSubmit(app.id, name);
  };

  useEffect(() => {
    if (app) {
      setName(app.name);
    }
  }, [app]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editModal.title")}</DialogTitle>
          <DialogDescription>{t("editModal.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="app-key">{t("editModal.form.key")}</Label>
              <Input id="app-key" value={app?.key ?? ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="app-name">{t("editModal.form.name")}</Label>
              <Input
                id="app-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {status.type !== "none" && (
            <div
              className={`p-3 mb-4 rounded-md ${
                status.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
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
              {t("editModal.form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("editModal.form.updating")
                : t("editModal.form.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
