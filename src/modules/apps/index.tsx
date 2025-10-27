import { LayoutPanelLeft } from "lucide-react";
import type { ModuleDescriptor } from "../shared/types";
import { routes } from "./routes";

export const appModule: ModuleDescriptor = {
  id: "apps",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "apps.list",
      label: "apps:page.title",
      path: "/private/apps",
      icon: <LayoutPanelLeft />,
      order: 2,
    },
  ],
};

import { moduleRegistry } from "../shared/registry";
moduleRegistry.register(appModule);
