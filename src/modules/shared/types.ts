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
  title: string;
}

// Generic pagination interfaces
export interface PaginatedRequest {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}
