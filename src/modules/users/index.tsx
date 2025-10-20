import type { ModuleDescriptor } from "../shared/types";
import { routes } from "./routes";
import { Users as UsersIcon } from "lucide-react";

export const userModule: ModuleDescriptor = {
  id: "users",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "users.list",
      label: "Usuarios",
      path: "/private/users",
      icon: <UsersIcon />,
      order: 1,
    },
  ],
};

import { moduleRegistry } from "../shared/registry";
moduleRegistry.register(userModule);
