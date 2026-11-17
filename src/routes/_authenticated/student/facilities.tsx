import { FacilityEvaluationList } from "@/features/student/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/facilities")({
  component: FacilityEvaluationList,
});
