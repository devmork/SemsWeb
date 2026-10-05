import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/shared/layout/AppLayout";
import { requireAuth } from "@/lib/guards";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: requireAuth,
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
