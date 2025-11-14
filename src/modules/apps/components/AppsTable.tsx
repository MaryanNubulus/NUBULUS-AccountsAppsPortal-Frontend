// AppsTable.tsx - Table component for displaying apps

import { Edit, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { App } from "../types";

interface AppsTableProps {
  apps: App[];
  onEdit: (app: App) => void;
  onChangeState: (app: App, pause: boolean) => void;
  t: (key: string) => string;
}

export function AppsTable({ apps, onEdit, onChangeState, t }: AppsTableProps) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("table.empty")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.headers.key")}</TableHead>
            <TableHead>{t("table.headers.name")}</TableHead>
            <TableHead>{t("table.headers.status")}</TableHead>
            <TableHead className="text-right">
              {t("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => {
            const isActive = app.status.toLowerCase() === "a";
            return (
              <TableRow key={app.id}>
                <TableCell className="font-mono">{app.key}</TableCell>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {isActive
                      ? t("table.status.active")
                      : t("table.status.inactive")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(app)}
                      title={t("table.actions.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangeState(app, true)}
                        title={t("table.actions.pause")}
                      >
                        <Pause className="h-4 w-4 text-orange-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangeState(app, false)}
                        title={t("table.actions.resume")}
                      >
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
