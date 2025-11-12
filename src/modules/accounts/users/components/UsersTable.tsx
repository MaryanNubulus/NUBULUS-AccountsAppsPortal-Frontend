import { Edit, Play, Pause } from "lucide-react";
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
  onChangeState: (user: User, shouldResume: boolean) => void;
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
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.isCreator")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                {t("table.noData")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "A" ? "default" : "secondary"}
                    className={
                      user.status === "A"
                        ? "bg-green-500 dark:bg-green-700"
                        : "bg-gray-400 dark:bg-gray-600"
                    }
                  >
                    {user.status === "A"
                      ? t("table.active")
                      : t("table.inactive")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isCreator ? "default" : "outline"}
                    className={
                      user.isCreator ? "bg-blue-500 dark:bg-blue-700" : ""
                    }
                  >
                    {user.isCreator
                      ? t("table.creator.yes")
                      : t("table.creator.no")}
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
                    {user.status === "A" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChangeState(user, false)}
                        title={t("table.pause")}
                      >
                        <Pause className="h-4 w-4 text-orange-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChangeState(user, true)}
                        title={t("table.resume")}
                      >
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
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
