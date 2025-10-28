import { useCallback, useEffect, useState } from "react";
import { getSignOutUrl, getCurrentEmployeeAsync } from "./services";
import type { EmployeeInfoDTO } from "@/modules/employees/types";

export function useEmployeeSessionViewModel() {
  const [employee, setEmployee] = useState<EmployeeInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = useCallback(() => {
    const signOutUrl = getSignOutUrl();
    window.location.href = signOutUrl;
  }, []);

  useEffect(() => {
    async function loadEmployee() {
      try {
        setIsLoading(true);
        setError(null);
        const employeeData = await getCurrentEmployeeAsync();
        setEmployee(employeeData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el usuario"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployee();
  }, []);

  return {
    employee,
    isLoading,
    error,
    handleSignOut,
  };
}
