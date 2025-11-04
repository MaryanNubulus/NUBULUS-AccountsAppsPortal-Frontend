"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEmployeeSessionViewModel } from "./viewmodel";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";

export function NavEmployee() {
  const { isMobile } = useSidebar();
  const { employee, isLoading, error, handleSignOut, t } =
    useEmployeeSessionViewModel();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="animate-pulse flex items-center space-x-4">
              <div className="rounded-lg bg-slate-200 h-8 w-8" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 bg-slate-200 rounded" />
                <div className="h-2 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {error || !employee
                    ? "?"
                    : employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                {error || !employee ? (
                  <span className="text-xs text-red-500">
                    {t("layout.header.employee.error")}
                  </span>
                ) : (
                  <>
                    <span className="truncate text-sm">{employee.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {employee.email}
                    </span>
                  </>
                )}
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem>
              <LanguageSelector />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ModeToggle isIcon={false} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              {t("layout.header.employee.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
