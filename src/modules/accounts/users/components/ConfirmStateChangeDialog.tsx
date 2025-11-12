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
  shouldResume: boolean;
}

export function ConfirmStateChangeDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
  shouldResume,
}: ConfirmStateChangeDialogProps) {
  const { handleChangeState, isSubmitting, error, clearError, t } =
    useChangeUserState(() => {
      onSuccess();
      onOpenChange(false);
    });

  const handleConfirm = () => {
    if (user) {
      handleChangeState(user.userId.toString(), shouldResume);
    }
  };

  const handleClose = () => {
    clearError();
    onOpenChange(false);
  };

  const title = shouldResume
    ? t("confirmDialog.resume.title")
    : t("confirmDialog.pause.title");
  const description = shouldResume
    ? t("confirmDialog.resume.description")
    : t("confirmDialog.pause.description");

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
