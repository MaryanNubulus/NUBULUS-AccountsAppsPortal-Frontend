import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [params] = useSearchParams();

  const signInUrl = useMemo(() => {
    const url = new URL("/api/v1/auth/sign-in", window.location.origin);
    return url.toString();
  }, [params]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Accede al Portal</h1>
      <p>Autentícate con Microsoft para continuar.</p>
      <a
        href={signInUrl}
        style={{
          background: "#0078D4",
          color: "white",
          padding: "10px 20px",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        Iniciar sesión con Microsoft
      </a>
    </div>
  );
}
