import { createFileRoute } from "@tanstack/react-router";
import { EvaluationTypeManagement } from "@/features/admin/evaluation-types";

export const Route = createFileRoute("/_authenticated/admin/evaluation-types")({
  component: EvaluationTypeManagement,
});
