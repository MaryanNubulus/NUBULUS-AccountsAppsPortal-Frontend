// ConfirmStateChangeDialog.tsx - Confirmation dialog for pause/resume actions

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { useChangeAccountState } from "../viewmodel";
import type { Account } from "../types";

interface ConfirmStateChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: Account | null;
  action: "pause" | "resume" | null;
}

export function ConfirmStateChangeDialog({
  isOpen,
  onClose,
  onSuccess,
  account,
  action,
}: ConfirmStateChangeDialogProps) {
  const { changeState, isSubmitting, error, t } =
    useChangeAccountState(onSuccess);

  const handleConfirm = async () => {
    if (account && action) {
      await changeState(account.accountId, action === "pause");
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

        {error && (
          <div className="mx-4 mt-4 p-3 rounded-md text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isSubmitting}
          >
            {t("confirmDialog.buttons.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting
              ? t("confirmDialog.buttons.processing")
              : t("confirmDialog.buttons.confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
