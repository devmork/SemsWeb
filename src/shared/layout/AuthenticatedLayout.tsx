import { AppLayout } from "./AppLayout";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { useRoleNavigation } from "@/features/auth";

/**
 * Application shell. Lives in `shared/layout` by request, but it is the one
 * deliberate exception to the "shared must not import features" rule because it
 * composes the authenticated shell (role navigation + account menu).
 */
export function AuthenticatedLayout() {
  const { sections } = useRoleNavigation();

  return (
    <AppLayout navSections={sections} sidebarFooter={<AppSidebarFooter />} />
  );
}
