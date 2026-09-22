import { Link } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavigationItem } from "@/features/navigation/hooks/useRoleNavigation";

export function AppSidebarNav({ items }: { items: NavigationItem[] }) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={item.isActive}
              render={<Link to={item.href} />}>
              <item.icon aria-hidden />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
