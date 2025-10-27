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
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import type { AppInfoDTO } from "../types";
import { useTranslation } from "react-i18next";

interface AppsTableProps {
  apps?: AppInfoDTO[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (app: AppInfoDTO) => void;
  onStateChange?: (appId: string, newState: boolean) => void;
}

export default function AppsTable({
  apps = [],
  isLoading = false,
  error = null,
  onEdit,
  onStateChange,
}: AppsTableProps) {
  const { t } = useTranslation("apps");
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

  return (
    <Table>
      <TableCaption>{t("table.caption")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t("table.headers.key")}</TableHead>
          <TableHead>{t("table.headers.name")}</TableHead>
          <TableHead>{t("table.headers.status")}</TableHead>
          <TableHead className="w-[100px]">
            {t("table.headers.actions")}
          </TableHead>
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
                    onStateChange?.(app.id, !checked)
                  }
                  disabled={!onStateChange}
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
            <TableCell>
              <Button
                disabled={!app.isActive}
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(app)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
