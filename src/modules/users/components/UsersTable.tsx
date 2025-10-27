import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { UserInfoDTO } from "../types";
import { useTranslation } from "react-i18next";

interface UsersTableProps {
  users?: UserInfoDTO[];
  isLoading?: boolean;
  error?: string | null;
}

export default function UsersTable({
  users = [],
  isLoading = false,
  error = null,
}: UsersTableProps) {
  const { t } = useTranslation("users");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("page.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("page.noUsersFound")}
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>{t("page.title")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t("page.table.email")}</TableHead>
          <TableHead>{t("page.table.name")}</TableHead>
          <TableHead>{t("page.table.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className={"hover:bg-muted/50"}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive
                  ? t("page.status.active")
                  : t("page.status.inactive")}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
