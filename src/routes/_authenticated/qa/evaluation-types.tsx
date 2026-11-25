import { createFileRoute } from "@tanstack/react-router";
import { EvaluationTypeManagement } from "@/features/qa/evaluation-types";

export const Route = createFileRoute("/_authenticated/qa/evaluation-types")({
  component: EvaluationTypeManagement,
});
