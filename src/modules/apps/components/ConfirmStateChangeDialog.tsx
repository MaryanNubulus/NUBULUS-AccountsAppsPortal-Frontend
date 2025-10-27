import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmStateChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPause: boolean;
  onConfirm: () => Promise<void>;
}

export function ConfirmStateChangeDialog({
  open,
  onOpenChange,
  isPause,
  onConfirm,
}: ConfirmStateChangeDialogProps) {
  const { t } = useTranslation("apps");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("confirmDialog.title")}</SheetTitle>
          <SheetDescription>
            {t(
              isPause
                ? "confirmDialog.pauseMessage"
                : "confirmDialog.activateMessage"
            )}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("confirmDialog.cancel")}
          </Button>
          <Button onClick={onConfirm}>{t("confirmDialog.confirm")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
