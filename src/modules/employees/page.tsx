import { useEmployeesViewModel } from "./viewmodel";
import EmployeesTable from "./components/EmployeesTable";

export default function EmployeesPage() {
  const { employees, isLoading, error, t } = useEmployeesViewModel();

  return (
    <>
      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        error={error}
        t={t}
      />
    </>
  );
}
