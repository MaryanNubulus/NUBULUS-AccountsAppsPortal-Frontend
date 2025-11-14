// AccountsTable.tsx - Table component for displaying accounts

import { Edit, Pause, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Account } from "../types";

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onChangeState: (account: Account, pause: boolean) => void;
  t: (key: string) => string;
}

export function AccountsTable({
  accounts,
  onEdit,
  onChangeState,
  t,
}: AccountsTableProps) {
  const navigate = useNavigate();

  if (accounts.length === 0) {
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
            <TableHead>{t("table.headers.name")}</TableHead>
            <TableHead>{t("table.headers.fullName")}</TableHead>
            <TableHead>{t("table.headers.email")}</TableHead>
            <TableHead>{t("table.headers.phone")}</TableHead>
            <TableHead>{t("table.headers.numberId")}</TableHead>
            <TableHead>{t("table.headers.status")}</TableHead>
            <TableHead className="text-right">
              {t("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const isActive = account.status.toLowerCase() === "a";
            return (
              <TableRow key={account.accountId}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>{account.fullName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.phone}</TableCell>
                <TableCell>{account.numberId}</TableCell>
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
                      onClick={() =>
                        navigate(`/private/accounts/${account.accountId}/users`)
                      }
                      title={t("table.actions.users")}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(account)}
                      title={t("table.actions.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangeState(account, true)}
                        title={t("table.actions.pause")}
                      >
                        <Pause className="h-4 w-4 text-orange-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangeState(account, false)}
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
