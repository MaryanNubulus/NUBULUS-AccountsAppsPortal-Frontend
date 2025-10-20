import type { RouteDefinition } from "../shared/types";
import UsersPage from "./page";

export const routes: RouteDefinition[] = [
  {
    path: "/private/users",
    element: <UsersPage />,
  },
];
