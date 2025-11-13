import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { UserToShare } from "../types";

interface SharedUsersTableProps {
  sharedUsers: UserToShare[];
  onUnshare: (user: UserToShare) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

export function SharedUsersTable({
  sharedUsers,
  onUnshare,
  isLoading,
  t,
}: SharedUsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sharedUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                {t("sharedTable.noData")}
              </TableCell>
            </TableRow>
          ) : (
            sharedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUnshare(user)}
                    disabled={isLoading}
                    title={t("sharedTable.unshare")}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
