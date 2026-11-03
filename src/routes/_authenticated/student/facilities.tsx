import FacilityEvaluationList from "@/features/evaluation-session/taking/components/FacilityEvaluationList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/facilities")({
  component: FacilityEvaluationList,
});
