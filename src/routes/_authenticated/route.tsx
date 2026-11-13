import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/app/layout/AuthenticatedLayout";
import { requireAuth } from "@/features/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    await requireAuth();
  },
  component: AuthenticatedLayout,
});
