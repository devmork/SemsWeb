import { EvaluationTakingView } from "@/features/evaluation-session/taking/components/EvaluationTakingView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/student/evaluate/$evaluateId")({
  component: EvaluationTakingView,
});
