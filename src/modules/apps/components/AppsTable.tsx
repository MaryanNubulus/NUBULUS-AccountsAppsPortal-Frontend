import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { AppInfoDTO } from "../types";
import { useState } from "react";
import { ConfirmStateChangeDialog } from "./ConfirmStateChangeDialog";
import { useTranslation } from "react-i18next";

interface AppsTableProps {
  apps?: AppInfoDTO[];
  isLoading?: boolean;
  error?: string | null;
  onPauseResume?: (appId: string, pause: boolean) => Promise<void>;
}

export default function AppsTable({
  apps = [],
  isLoading = false,
  error = null,
  onPauseResume,
}: AppsTableProps) {
  const { t } = useTranslation("apps");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    appId: string;
    newState: boolean;
  } | null>(null);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("table.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {t("common.error")}: {error}
      </div>
    );
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("table.noApps")}
      </div>
    );
  }

  const handleStateChange = (appId: string, newState: boolean) => {
    setPendingAction({ appId, newState });
    setConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (pendingAction && onPauseResume) {
      await onPauseResume(pendingAction.appId, pendingAction.newState);
      setConfirmationOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>{t("table.caption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.headers.key")}</TableHead>
            <TableHead>{t("table.headers.name")}</TableHead>
            <TableHead>{t("table.headers.status")}</TableHead>
            <TableHead>{t("table.headers.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id} className="hover:bg-muted/50">
              <TableCell>{app.key}</TableCell>
              <TableCell>{app.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={app.isActive}
                    onCheckedChange={(checked: boolean) =>
                      handleStateChange(app.id, !checked)
                    }
                    disabled={!onPauseResume}
                  />
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      app.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t(
                      app.isActive
                        ? "table.status.active"
                        : "table.status.inactive"
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmStateChangeDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        isPause={pendingAction?.newState ?? false}
        onConfirm={handleConfirm}
      />
    </>
  );
}
