import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useEmployeesViewModel } from "./viewmodel";
import EmployeesTable from "./components/EmployeesTable";

export default function EmployeesPage() {
  const { employees, isLoading, error, t } = useEmployeesViewModel();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("page.title")}
          </CardTitle>
          <CardDescription>{t("page.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          <EmployeesTable
            employees={employees}
            isLoading={isLoading}
            error={error}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  );
}
