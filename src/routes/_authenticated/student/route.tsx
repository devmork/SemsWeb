import { requireRole } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student")({
  beforeLoad: () => requireRole("student"),
  component: () => <Outlet />,
});
