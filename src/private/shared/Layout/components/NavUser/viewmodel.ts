import { useCallback } from "react";
import { getSignOutUrl } from "./services";

export function useUserSessionViewModel() {
  const handleSignOut = useCallback(() => {
    const from =
      window.location.pathname + window.location.search + window.location.hash;

    const signOutUrl = getSignOutUrl(from);
    window.location.href = signOutUrl;
  }, []);

  return {
    handleSignOut,
  };
}
