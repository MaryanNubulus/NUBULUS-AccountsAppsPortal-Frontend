import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getSignInUrl } from "./services";

export function useLoginViewModel() {
  const [params] = useSearchParams();

  const signInUrl = useMemo(() => {
    return getSignInUrl();
  }, [params]);

  return {
    signInUrl,
  };
}
