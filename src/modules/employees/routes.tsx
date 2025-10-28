import type { RouteDefinition } from "../shared/types";
import EmployeesPage from "./page";

export const routes: RouteDefinition[] = [
  {
    path: "/private/employees",
    element: <EmployeesPage />,
    title: "employees:page.title",
  },
];
