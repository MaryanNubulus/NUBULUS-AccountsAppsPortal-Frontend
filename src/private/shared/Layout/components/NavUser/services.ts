export function getSignOutUrl(from: string): string {
  const post = `${window.location.origin}/?from=${encodeURIComponent(from)}`;
  const url = `/api/v1/auth/sign-out?returnUrl=${encodeURIComponent(post)}`;
  return url;
}
