// ConfirmStateChangeDialog.tsx - Confirmation dialog for pause/resume actions

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStateChangeApp } from "../viewmodel";
import type { App } from "../types";

interface ConfirmStateChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  app: App | null;
  action: "pause" | "resume" | null;
}

export function ConfirmStateChangeDialog({
  isOpen,
  onClose,
  onSuccess,
  app,
  action,
}: ConfirmStateChangeDialogProps) {
  const { pauseApp, resumeApp, modalState, t } = useStateChangeApp(onSuccess);

  const handleConfirm = async () => {
    if (app && action) {
      if (action === "pause") {
        await pauseApp(app.id);
      } else {
        await resumeApp(app.id);
      }
    }
  };

  const title =
    action === "pause"
      ? t("confirmDialog.pause.title")
      : t("confirmDialog.resume.title");

  const description =
    action === "pause"
      ? t("confirmDialog.pause.description")
      : t("confirmDialog.resume.description");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {modalState.status.type === "error" && (
          <div className="mx-4 mt-4 p-3 rounded-md text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {modalState.status.message}
          </div>
        )}

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={modalState.isSubmitting}
          >
            {t("confirmDialog.buttons.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={modalState.isSubmitting}>
            {modalState.isSubmitting
              ? t("confirmDialog.buttons.processing")
              : t("confirmDialog.buttons.confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
