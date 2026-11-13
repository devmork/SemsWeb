import { FacilityEvaluationList } from "@/features/evaluation-taking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/facilities")({
  component: FacilityEvaluationList,
});
