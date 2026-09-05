import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user?.role !== "Admin") {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
