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

  const title = isPause
    ? t("confirmDialog.deactivate.title")
    : t("confirmDialog.activate.title");

  const description = isPause
    ? t("confirmDialog.deactivate.description")
    : t("confirmDialog.activate.description");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("confirmDialog.cancel")}
          </Button>
          <Button onClick={onConfirm}>{t("confirmDialog.confirm")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
