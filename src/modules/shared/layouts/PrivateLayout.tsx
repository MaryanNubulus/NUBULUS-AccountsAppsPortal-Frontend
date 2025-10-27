import { Outlet, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";
import { moduleRegistry } from "../registry";

export default function PrivateLayout() {
  const { t } = useTranslation("shared");
  const location = useLocation();
  const title = moduleRegistry.getRouteTitle(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <Header title={t(title)} />
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
