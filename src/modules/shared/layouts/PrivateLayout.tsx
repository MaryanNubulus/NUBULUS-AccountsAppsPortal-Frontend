import { Outlet, useMatches } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { RouteHandle } from "../types";
import { AppSidebar } from "../components/AppSidebar";
import { Header } from "../components/Header";

export default function PrivateLayout() {
  const matches = useMatches();
  const currentMatch = matches.find((m) => (m.handle as RouteHandle)?.title);
  const title = (currentMatch?.handle as RouteHandle)?.title || "App";

  return (
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <Header title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
