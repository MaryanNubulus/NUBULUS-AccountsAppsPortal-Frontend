import type { ModuleDescriptor } from "./types";

class ModuleRegistry {
  private modules: ModuleDescriptor[] = [];

  register(module: ModuleDescriptor) {
    if (this.modules.find((m) => m.id === module.id)) {
      throw new Error(`Module with id ${module.id} already exists`);
    }
    this.modules.push(module);
  }

  getModules() {
    return this.modules;
  }

  getMenuItems() {
    return this.modules
      .flatMap((m) => m.menu || [])
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getRoutes() {
    return this.modules.flatMap((m) => m.routes);
  }

  getPrivateRoutes() {
    return this.modules.filter((m) => m.isPrivate).flatMap((m) => m.routes);
  }

  getPublicRoutes() {
    return this.modules.filter((m) => !m.isPrivate).flatMap((m) => m.routes);
  }
}

export const moduleRegistry = new ModuleRegistry();
