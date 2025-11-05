import { Edit, Power, PowerOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onChangeState: (user: User, shouldActivate: boolean) => void;
  t: (key: string) => string;
}

export function UsersTable({
  users,
  onEdit,
  onChangeState,
  t,
}: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.phone")}</TableHead>
            <TableHead>{t("table.role")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                {t("table.noData")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "Owner"
                        ? "default"
                        : user.role === "Admin"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={
                      user.isActive
                        ? "bg-green-500 dark:bg-green-700"
                        : "bg-gray-400 dark:bg-gray-600"
                    }
                  >
                    {user.isActive ? t("table.active") : t("table.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title={t("table.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.role !== "Owner" && (
                      <>
                        {user.isActive ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onChangeState(user, false)}
                            title={t("table.deactivate")}
                          >
                            <PowerOff className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onChangeState(user, true)}
                            title={t("table.activate")}
                          >
                            <Power className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
