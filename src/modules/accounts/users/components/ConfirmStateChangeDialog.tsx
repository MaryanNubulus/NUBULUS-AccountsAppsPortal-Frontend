import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { User } from "../types";
import { useChangeUserState } from "../viewmodel";

interface ConfirmStateChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: User | null;
  shouldActivate: boolean;
}

export function ConfirmStateChangeDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
  shouldActivate,
}: ConfirmStateChangeDialogProps) {
  const { handleChangeState, isSubmitting, error, clearError, t } =
    useChangeUserState(() => {
      onSuccess();
      onOpenChange(false);
    });

  const handleConfirm = () => {
    if (user) {
      handleChangeState(user.id, shouldActivate);
    }
  };

  const handleClose = () => {
    clearError();
    onOpenChange(false);
  };

  const title = shouldActivate
    ? t("confirmDialog.activate.title")
    : t("confirmDialog.deactivate.title");
  const description = shouldActivate
    ? t("confirmDialog.activate.description")
    : t("confirmDialog.deactivate.description");

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {user && (
          <div className="py-4 px-2">
            <div className="rounded-md bg-muted p-4">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <SheetFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("confirmDialog.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting
              ? t("confirmDialog.submitting")
              : t("confirmDialog.confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
