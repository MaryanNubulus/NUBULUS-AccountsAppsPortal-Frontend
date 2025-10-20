import { useEffect, useState } from "react";
import type { GetUsersResponse, UserInfoDTO } from "@/modules/users/types";
import { getUsers } from "./service";

export function useUsersViewModel() {
  const [users, setUsers] = useState<UserInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsLoading(true);
        setError(null);

        const response: GetUsersResponse = await getUsers();

        if (!response.success) {
          throw new Error(response.message ?? "Unknown error");
        }

        if (isMounted) {
          setUsers(response.users ?? []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (isMounted) {
          setError("Error fetching users. Please try again later.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}
