import type { ModuleDescriptor } from "../shared/types";
import { routes } from "./routes";
import { Users as EmployeesIcon } from "lucide-react";

export const employeeModule: ModuleDescriptor = {
  id: "employees",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "employees.list",
      label: "employees:page.title",
      path: "/private/employees",
      icon: <EmployeesIcon />,
      order: 1,
    },
  ],
};

import { moduleRegistry } from "../shared/registry";
moduleRegistry.register(employeeModule);
