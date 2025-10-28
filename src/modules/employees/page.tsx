import { useEmployeesViewModel } from "./viewmodel";
import EmployeesTable from "./components/EmployeesTable";

export default function EmployeesPage() {
  const { employees, isLoading, error } = useEmployeesViewModel();

  return (
    <>
      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
