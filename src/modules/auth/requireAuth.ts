import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function requireAuth({}: LoaderFunctionArgs) {
  const url = new URL("/api/v1/auth/is-valid-session", API_BASE);
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok || res.status > 299) {
    throw redirect(`/`);
  }
  return null;
}
