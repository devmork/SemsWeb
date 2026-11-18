import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconCommand } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { AppSidebarNav } from "./AppSidebarNav";
import type { NavigationSection } from "@/shared/config/navigation/types";

interface AppSidebarProps {
  sections: NavigationSection[];
  footer?: ReactNode;
}

export function AppSidebar({ sections, footer }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconCommand className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">SEMS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <AppSidebarNav sections={sections} />
      </SidebarContent>

      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  );
}
