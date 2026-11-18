import { createFileRoute } from "@tanstack/react-router";
import { FacilityManagement } from "@/features/admin/facility";

export const Route = createFileRoute("/_authenticated/admin/facilities")({
  component: FacilityManagement,
});
