import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  const handleSignOut = () => {
    const from =
      window.location.pathname + window.location.search + window.location.hash;
    const post = `${window.location.origin}/login?from=${encodeURIComponent(
      from
    )}`;
    window.location.href = `/api/v1/auth/sign-out?returnUrl=${encodeURIComponent(
      post
    )}`;
  };

  return (
    <>
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <strong>Área privada</strong>
        <nav style={{ float: "right" }}>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              color: "#c00",
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </header>
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
