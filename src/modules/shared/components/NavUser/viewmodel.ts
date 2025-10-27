import { useCallback, useEffect, useState } from "react";
import { getSignOutUrl, getCurrentUserAsync } from "./services";
import type { UserInfoDTO } from "@/modules/users/types";

export function useUserSessionViewModel() {
  const [user, setUser] = useState<UserInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = useCallback(() => {
    const signOutUrl = getSignOutUrl();
    window.location.href = signOutUrl;
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await getCurrentUserAsync();
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el usuario"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    handleSignOut,
  };
}
