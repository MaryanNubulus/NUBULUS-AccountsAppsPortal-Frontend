import type { RouteDefinition } from "../../shared/types";
import { UsersPage } from "./page";

export const routes: RouteDefinition[] = [
  {
    path: "/private/accounts/:accountId/users",
    element: <UsersPage />,
    title: "users:page.title",
  },
];
