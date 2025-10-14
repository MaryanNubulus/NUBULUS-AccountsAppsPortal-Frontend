import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";

export async function requireAuth({ request }: LoaderFunctionArgs) {
  const res = await fetch("http://localhost:5016/api/v1/auth/sesion-is-valid", {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const url = new URL(request.url);
    const from = url.pathname + url.search + url.hash;
    throw redirect(`/?from=${encodeURIComponent(from)}`);
  }
  return null;
}
