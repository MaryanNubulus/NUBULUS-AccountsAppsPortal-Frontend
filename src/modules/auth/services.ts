const API_BASE = import.meta.env.VITE_API_BASE;

export function getSignInUrl(): string {
  const url = new URL("/api/v1/auth/sign-in", API_BASE);
  return url.toString();
}
