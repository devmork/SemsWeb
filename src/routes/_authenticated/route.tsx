import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/shared/layout/AppLayout";
import { requireAuth } from "@/lib/guards";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    await requireAuth();
  },
  component: AppLayout,
});
