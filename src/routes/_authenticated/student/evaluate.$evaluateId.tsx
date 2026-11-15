import { EvaluationTakingView } from "@/features/evaluation-taking";
import type { EvaluationKind } from "@/features/evaluation-taking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/student/evaluate/$evaluateId",
)({
  validateSearch: (search: Record<string, unknown>): { type: EvaluationKind } => ({
    type: search.type === "facility" ? "facility" : "teacher",
  }),
  component: EvaluationTakingView,
});
