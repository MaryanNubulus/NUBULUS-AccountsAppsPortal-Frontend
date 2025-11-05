import { Users } from "lucide-react";
import type { ModuleDescriptor } from "../../shared/types";
import { moduleRegistry } from "../../shared/registry";
import { routes } from "./routes";
import "./translations";

export const usersModule: ModuleDescriptor = {
  id: "users",
  isPrivate: true,
  routes,
};

moduleRegistry.register(usersModule);

export { Users as UsersIcon };
