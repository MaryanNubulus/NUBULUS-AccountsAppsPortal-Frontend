// routes.tsx - Accounts module route configuration

import type { RouteDefinition } from "../shared/types";
import AccountsPage from "./page";

export const routes: RouteDefinition[] = [
  {
    path: "/private/accounts",
    element: <AccountsPage />,
    title: "accounts:page.title",
  },
];
