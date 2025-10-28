"use client";

import * as React from "react";
import { NavEmployee } from "../NavEmployee";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { moduleRegistry } from "@/modules/shared/registry";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const menuItems = moduleRegistry.getMenuItems();
  const { t } = useTranslation("shared");
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <span className="text-base font-semibold">
                {t("layout.sidebar.portal")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  onClick={() => navigate(item.path)}
                >
                  <SidebarMenuButton tooltip={t(item.label)}>
                    {item.icon}
                    <span>{t(item.label)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavEmployee />
      </SidebarFooter>
    </Sidebar>
  );
}
