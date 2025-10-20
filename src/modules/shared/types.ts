import type { ReactNode } from "react";

export interface ModuleDescriptor {
  id: string;
  isPrivate: boolean;
  routes: RouteDefinition[];
  menu?: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  order?: number;
}

export interface RouteDefinition {
  path: string;
  element: ReactNode;
  children?: RouteDefinition[];
}

export interface RouteHandle {
  title?: string;
}
