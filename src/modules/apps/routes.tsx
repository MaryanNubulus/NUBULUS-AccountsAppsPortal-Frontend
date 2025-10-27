import type { RouteDefinition } from "../shared/types";
import AppsPage from "./page";

export const routes: RouteDefinition[] = [
  {
    path: "/private/apps",
    element: <AppsPage />,
    title: "apps:page.title",
  },
];
