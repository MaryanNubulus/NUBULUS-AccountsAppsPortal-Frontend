import { createBrowserRouter } from "react-router-dom";
import PrivateLayout from "./private/shared/Layout";
import PublicLayout from "./public/shared/Layout";
import Main from "./private/main";
import Login from "./public/login";
import { requireAuth } from "./shared/auth/requireAuth";
import Users from "./private/users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/private",
    loader: requireAuth,
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <Main />,
        handle: { title: "Dashboard" },
      },
      {
        path: "users",
        element: <Users />,
        handle: { title: "Users" },
      },
    ],
  },
]);

export default router;
