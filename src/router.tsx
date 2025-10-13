import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateLayout from "./private/shared/Layout";
import Main from "./private/main";
import Login from "./public/login";
import { requireAuth } from "./shared/auth/requireAuth";

const router = createBrowserRouter([
  {
    id: "private",
    path: "/",
    loader: requireAuth,
    element: <PrivateLayout />,
    children: [{ index: true, element: <Main /> }],
  },
  { path: "/private", element: <Navigate to="/" replace /> },
  { path: "/login", element: <Login /> },
]);

export default router;
