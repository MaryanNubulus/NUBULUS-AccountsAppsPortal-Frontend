// index.tsx - Accounts module descriptor and registration

import { Building2 } from "lucide-react";
import { moduleRegistry } from "../shared/registry";
import type { ModuleDescriptor } from "../shared/types";
import { routes } from "./routes";
import "./translations";

export const accountsModule: ModuleDescriptor = {
  id: "accounts",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "accounts.list",
      label: "accounts:page.title",
      path: "/private/accounts",
      icon: <Building2 />,
      order: 1,
    },
  ],
};

moduleRegistry.register(accountsModule);
