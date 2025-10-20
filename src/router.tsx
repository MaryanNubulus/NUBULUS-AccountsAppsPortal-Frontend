import { createBrowserRouter } from "react-router-dom";
import PrivateLayout from "./modules/shared/layouts/PrivateLayout";
import PublicLayout from "./modules/shared/layouts/PublicLayout";
import { requireAuth } from "./modules/auth/requireAuth";
import { moduleRegistry } from "./modules/shared/registry";
import Auth from "./modules/auth";

import "./modules/users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Auth />,
      },
    ],
  },
  {
    path: "/private",
    loader: requireAuth,
    element: <PrivateLayout />,
    children: [
      { index: true, element: <p>Welcome to the Main Dashboard!</p> },
      ...moduleRegistry.getPrivateRoutes(),
    ],
  },
]);

export default router;
