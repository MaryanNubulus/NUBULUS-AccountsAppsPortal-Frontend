import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeInfoDTO } from "../types";
import type { TFunction } from "i18next";

interface EmployeesTableProps {
  employees?: EmployeeInfoDTO[];
  isLoading?: boolean;
  error?: string | null;
  t: TFunction<"employees", undefined>;
}

export default function EmployeesTable({
  employees = [],
  isLoading = false,
  error = null,
  t,
}: EmployeesTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("page.loading")}
      </div>
    );
  }

  if (error) {
    return null; // Error is shown in the parent component
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("page.noEmployeesFound")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("page.table.email")}</TableHead>
            <TableHead>{t("page.table.name")}</TableHead>
            <TableHead>{t("page.table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.email}</TableCell>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                >
                  {employee.isActive
                    ? t("page.status.active")
                    : t("page.status.inactive")}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
