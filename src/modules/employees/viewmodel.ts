import { useEffect, useState } from "react";
import type {
  GetEmployeesResponse,
  EmployeeInfoDTO,
} from "@/modules/employees/types";
import { getEmployees } from "./service";
import { useTranslation } from "react-i18next";

export function useEmployeesViewModel() {
  const [employees, setEmployees] = useState<EmployeeInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("employees");

  useEffect(() => {
    let isMounted = true;

    async function loadEmployees() {
      try {
        setIsLoading(true);
        setError(null);

        const response: GetEmployeesResponse = await getEmployees();

        if (isMounted) {
          setEmployees(response.employees ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(t("page.error"));
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
    t,
  };
}
