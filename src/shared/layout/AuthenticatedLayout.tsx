import { AppLayout } from "@/shared/layout";
import { SidebarAccountMenu } from "@/app/components/SidebarAccountMenu";
import { useRoleNavigation } from "@/app/hooks/useRoleNavigation";

export function AuthenticatedLayout() {
  const { items } = useRoleNavigation();

  return (
    <AppLayout navItems={items} sidebarFooter={<SidebarAccountMenu />} />
  );
}
