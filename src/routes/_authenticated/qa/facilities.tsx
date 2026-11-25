import { createFileRoute } from "@tanstack/react-router";
import { FacilityManagement } from "@/features/qa/facility";

export const Route = createFileRoute("/_authenticated/qa/facilities")({
  component: FacilityManagement,
});
