import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "./AppSidebarNav";
import type { NavigationSection } from "@/shared/config/navigation/types";
import { Separator } from "@/components/ui/separator";

interface AppSidebarProps {
  sections: NavigationSection[];
  footer?: ReactNode;
}

export function AppSidebar({ sections, footer }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:px-0">
        <div className="flex items-center justify-start py-1 group-data-[collapsible=icon]:justify-center">
          <img
            src="/assets/logos/app-logo.png"
            alt="SEMS"
            className="size-12 max-w-none shrink-0 object-contain"
          />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <AppSidebarNav sections={sections} />
      </SidebarContent>

      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  );
}
