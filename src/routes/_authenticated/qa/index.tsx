import { requireRole } from "@/lib/guards";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/qa/")({
  beforeLoad: () => requireRole("qa"),
  component: () => <Outlet />,
});
