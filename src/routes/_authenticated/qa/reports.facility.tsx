import { createFileRoute } from "@tanstack/react-router";
import { FacilityResults } from "@/features/qa/reports";

export const Route = createFileRoute("/_authenticated/qa/reports/facility")({
  component: FacilityResults,
});
