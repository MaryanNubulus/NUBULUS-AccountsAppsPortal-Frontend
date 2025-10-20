import type { RouteDefinition } from "../shared/types";
import UsersTable from "./components/UsersTable";

export const routes: RouteDefinition[] = [
  {
    path: "/private/users",
    element: <UsersTable />,
  },
];
