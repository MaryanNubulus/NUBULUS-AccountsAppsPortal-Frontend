import { useEffect, useState } from "react";
import type {
  GetEmployeesResponse,
  EmployeeInfoDTO,
} from "@/modules/employees/types";
import { getEmployees } from "./service";

export function useEmployeesViewModel() {
  const [employees, setEmployees] = useState<EmployeeInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEmployees() {
      try {
        setIsLoading(true);
        setError(null);

        const response: GetEmployeesResponse = await getEmployees();

        if (!response.success) {
          throw new Error(response.message ?? "Unknown error");
        }

        if (isMounted) {
          setEmployees(response.employees ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching employees. Please try again later.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    employees,
    isLoading,
    error,
  };
}
