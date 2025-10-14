export function getSignInUrl(): string {
  const url = new URL("/api/v1/auth/sign-in", window.location.origin);
  return url.toString();
}
