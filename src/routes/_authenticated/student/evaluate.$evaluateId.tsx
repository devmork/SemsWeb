import { EvaluationTakingView } from "@/features/student/evaluations";
import type { EvaluationKind } from "@/features/student/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/student/evaluate/$evaluateId",
)({
  validateSearch: (search: Record<string, unknown>): { type: EvaluationKind } => ({
    type: search.type === "facility" ? "facility" : "teacher",
  }),
  component: EvaluationTakingView,
});
